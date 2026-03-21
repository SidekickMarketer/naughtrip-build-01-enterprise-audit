#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const platformDataPath = path.join(repoRoot, "data", "platform-health-data.json");
const lighthouseSummaryPath = path.join(repoRoot, "data", "lighthouse-summary.json");

const PAGESPEED_CATEGORIES = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
];

const SOCIAL_PATTERNS = [
  { label: "Facebook", terms: ["facebook.com/"] },
  { label: "Instagram", terms: ["instagram.com/"] },
  { label: "LinkedIn", terms: ["linkedin.com/"] },
  { label: "X", terms: ["twitter.com/", "x.com/"] },
  { label: "YouTube", terms: ["youtube.com/", "youtu.be/"] },
  { label: "TikTok", terms: ["tiktok.com/"] },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(domain) {
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function scoreFromCategory(category) {
  if (typeof category?.score !== "number") return null;
  return Math.round(category.score * 100);
}

async function fetchPageSpeed(domain, apiKey) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", `https://${domain}`);
  endpoint.searchParams.set("strategy", "mobile");
  for (const category of PAGESPEED_CATEGORIES) {
    endpoint.searchParams.append("category", category);
  }
  if (apiKey) endpoint.searchParams.set("key", apiKey);

  const response = await fetchWithTimeout(endpoint.toString());
  if (!response.ok) {
    throw new Error(`PageSpeed HTTP ${response.status} for ${domain}`);
  }

  const payload = await response.json();
  if (payload.error?.message) {
    throw new Error(`PageSpeed error for ${domain}: ${payload.error.message}`);
  }

  const lighthouse = payload.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  const audits = lighthouse.audits || {};

  return {
    performance: scoreFromCategory(categories.performance),
    accessibility: scoreFromCategory(categories.accessibility),
    bestPractices: scoreFromCategory(categories["best-practices"]),
    seo: scoreFromCategory(categories.seo),
    lcp_ms: Math.round(audits["largest-contentful-paint"]?.numericValue || 0),
    cls: Number((audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3)),
    tbt_ms: Math.round(audits["total-blocking-time"]?.numericValue || 0),
    fetchTime: new Date().toISOString(),
  };
}

async function fetchWebsiteContent(domain) {
  const candidates = [
    { url: `https://${domain}`, source: "direct-https" },
    { url: `http://${domain}`, source: "direct-http" },
    { url: `https://r.jina.ai/http://${domain}`, source: "jina-reader" },
  ];

  for (const candidate of candidates) {
    try {
      const response = await fetchWithTimeout(
        candidate.url,
        {
          headers: {
            "user-agent": "ApexPlatformHealthBot/1.0",
          },
          redirect: "follow",
        },
        15_000
      );

      if (!response.ok) continue;
      const text = await response.text();
      if (text && text.length > 400) {
        return { content: text, source: candidate.source };
      }
    } catch {
      // Try next candidate.
    }
  }

  return { content: "", source: null };
}

function detectMartech(content, fallback) {
  const lower = content.toLowerCase();
  const has = (...terms) => terms.some((term) => lower.includes(term));

  const hubspot = has("js.hs-scripts.com", "hs-script-loader", "hsforms", "hubspot");
  const ga4 = has(
    "googletagmanager.com/gtag",
    "google-analytics.com/g/collect",
    "gtag('config'",
    "gtm-"
  );
  const oneTrust = has("onetrust", "cookielaw.org", "optanon");

  let platform = fallback.platform;
  let pageBuilder = fallback.pageBuilder;

  if (has("<app-root", "ng-version", "angular")) {
    platform = "Angular SPA";
    pageBuilder = "N/A";
  } else if (has("wp-content", "wordpress")) {
    if (has("elementor")) {
      platform = "WordPress + Elementor";
      pageBuilder = "Elementor Pro";
    } else if (has("wpbakery", "vc_row", "js_composer")) {
      platform = "WordPress + WPBakery";
      pageBuilder = "WPBakery";
    } else if (has("divi", "et_pb_")) {
      platform = "WordPress + Divi";
      pageBuilder = "Divi";
    } else if (has("betheme", "mfn-")) {
      platform = "WordPress + BeTheme";
      pageBuilder = "BeTheme";
    } else if (has("genesis")) {
      platform = "WordPress + Genesis";
      pageBuilder = "Genesis";
    } else if (has("wpengine")) {
      platform = "WordPress + WP Engine";
      pageBuilder = "WP Default";
    } else {
      platform = "WordPress + Custom";
      pageBuilder = fallback.pageBuilder === "N/A" ? "Custom" : fallback.pageBuilder || "Custom";
    }
  } else if (has("squarespace")) {
    platform = "Squarespace";
    pageBuilder = "Squarespace";
  } else if (has("wix.com", "wix-site")) {
    platform = "Wix";
    pageBuilder = "Wix";
  }

  return {
    platform,
    pageBuilder,
    hubspot,
    ga4,
    oneTrust,
  };
}

function detectWebsiteSignals(content) {
  const lower = content.toLowerCase();
  const has = (...terms) => terms.some((term) => lower.includes(term));

  const socialPlatforms = SOCIAL_PATTERNS
    .filter((platform) => platform.terms.some((term) => lower.includes(term)))
    .map((platform) => platform.label);

  const hasPhoneVisible = /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(content);

  return {
    hasFacebookPixel: has(
      "connect.facebook.net/en_us/fbevents.js",
      "fbq(",
      "facebook.com/tr"
    ),
    hasSchemaMarkup: has("application/ld+json", "itemscope", "itemtype="),
    hasContactForm: has("<form", "contact-form", "gravityforms", "wpforms", "ninja-forms"),
    hasClearCta: has(
      "call now",
      "request a quote",
      "get a quote",
      "contact us",
      "schedule",
      "book now",
      "get started",
      "start your quote"
    ),
    hasPhoneVisible,
    hasSocialLinks: socialPlatforms.length > 0,
    socialPlatforms,
    hasAnalytics: has(
      "googletagmanager.com",
      "google-analytics.com",
      "gtag(",
      "ga(",
      "analytics.js"
    ),
  };
}

function computeWebsiteQualityScore(property, signals) {
  let score = 1;

  if (property.performance >= 70) score += 2;
  else if (property.performance >= 50) score += 1;

  if (signals.hasAnalytics) score += 2;
  if (signals.hasFacebookPixel) score += 1;
  if (signals.hasSchemaMarkup) score += 1;
  if (signals.hasContactForm) score += 1;
  if (signals.hasClearCta) score += 2;
  if (signals.hasSocialLinks) score += 1;
  if (signals.hasPhoneVisible) score += 1;

  return Math.max(1, Math.min(score, 10));
}

function buildHeuristicSummary(property, martechSignals, auditSignals, qualityScore, fetchSource) {
  const parts = [];
  parts.push(`${property.name} scored ${qualityScore}/10 in website audit readiness.`);
  parts.push(`Mobile performance is ${property.performance}/100 with LCP ${(property.lcp_ms / 1000).toFixed(1)}s.`);

  const stackSignals = [];
  if (martechSignals.ga4) stackSignals.push("GA/GTM detected");
  if (martechSignals.hubspot) stackSignals.push("HubSpot detected");
  if (auditSignals.hasFacebookPixel) stackSignals.push("Meta Pixel detected");
  if (martechSignals.oneTrust) stackSignals.push("consent tooling detected");
  if (stackSignals.length === 0) stackSignals.push("no clear marketing tracking detected");
  parts.push(stackSignals.join(", ") + ".");

  const uxSignals = [];
  uxSignals.push(auditSignals.hasClearCta ? "clear CTA present" : "CTA clarity needs work");
  uxSignals.push(auditSignals.hasContactForm ? "contact form present" : "no obvious contact form");
  uxSignals.push(auditSignals.hasSchemaMarkup ? "schema markup present" : "schema markup missing");
  uxSignals.push(auditSignals.hasSocialLinks ? "social links present" : "social links not obvious");
  parts.push(uxSignals.join("; ") + ".");

  if (fetchSource) {
    parts.push(`Audit source: ${fetchSource}.`);
  }

  return parts.join(" ");
}

async function maybeGenerateAnthropicSummary(anthropicApiKey, property, martechSignals, auditSignals, qualityScore, content) {
  if (!anthropicApiKey || !content) return null;

  try {
    const prompt = `Summarize this insurance intermediary website in 2 concise sentences for an executive dashboard.
Property: ${property.name}
Performance: ${property.performance}/100
LCP: ${(property.lcp_ms / 1000).toFixed(1)}s
Quality Score: ${qualityScore}/10
Platform: ${martechSignals.platform}
Signals:
- Analytics: ${auditSignals.hasAnalytics}
- HubSpot: ${martechSignals.hubspot}
- Meta Pixel: ${auditSignals.hasFacebookPixel}
- Schema: ${auditSignals.hasSchemaMarkup}
- Contact Form: ${auditSignals.hasContactForm}
- CTA: ${auditSignals.hasClearCta}
- Social Links: ${auditSignals.hasSocialLinks}
- Social Platforms: ${auditSignals.socialPlatforms.join(", ") || "none"}

Website content excerpt:
${content.substring(0, 9000)}
`;

    const response = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 180,
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
        }),
      },
      25_000
    );

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.content?.find?.((block) => block.type === "text")?.text;
    return typeof text === "string" ? text.trim() : null;
  } catch {
    return null;
  }
}

async function main() {
  const pageSpeedApiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_API_KEY || "";
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
  const current = JSON.parse(await fs.readFile(platformDataPath, "utf8"));

  const martechFallbackByUrl = new Map(
    current.propertyMarTech.map((entry) => [entry.url, entry])
  );
  const auditFallbackByUrl = new Map(
    (current.websiteAudits || []).map((entry) => [entry.url, entry])
  );

  const refreshedWebProperties = [];
  const refreshedMartech = [];
  const refreshedWebsiteAudits = [];
  const lighthouseSummary = {};

  for (const property of current.webProperties) {
    const fallbackMartech = martechFallbackByUrl.get(property.url) || {
      name: property.name,
      url: property.url,
      division: property.division,
      platform: "Unknown",
      pageBuilder: "Unknown",
      hubspot: false,
      ga4: false,
      oneTrust: false,
    };
    const fallbackAudit = auditFallbackByUrl.get(property.url) || {
      name: property.name,
      url: property.url,
      division: property.division,
      hasWebsite: false,
      hasAnalytics: false,
      hasFacebookPixel: false,
      hasSchemaMarkup: false,
      hasContactForm: false,
      hasClearCta: false,
      hasPhoneVisible: false,
      hasSocialLinks: false,
      socialPlatforms: [],
      websitePlatform: fallbackMartech.platform,
      websiteQualityScore: 0,
      auditSummary: "No website audit summary available.",
      usedAnthropicSummary: false,
      fetchSource: null,
    };

    let metrics = null;
    try {
      metrics = await fetchPageSpeed(property.url, pageSpeedApiKey);
      console.log(`PageSpeed ok: ${property.url}`);
    } catch (error) {
      console.warn(`PageSpeed failed: ${property.url} (${error.message})`);
    }

    const refreshedProperty = {
      ...property,
      performance: metrics?.performance ?? property.performance,
      accessibility: metrics?.accessibility ?? property.accessibility,
      bestPractices: metrics?.bestPractices ?? property.bestPractices,
      seo: metrics?.seo ?? property.seo,
      lcp_ms: metrics?.lcp_ms ?? property.lcp_ms,
      cls: metrics?.cls ?? property.cls,
      tbt_ms: metrics?.tbt_ms ?? property.tbt_ms,
    };
    refreshedWebProperties.push(refreshedProperty);

    lighthouseSummary[slugify(property.url)] = {
      scores: {
        performance: refreshedProperty.performance,
        accessibility: refreshedProperty.accessibility,
        bestPractices: refreshedProperty.bestPractices,
        seo: refreshedProperty.seo,
      },
      vitals: {
        lcp_ms: refreshedProperty.lcp_ms,
        cls: refreshedProperty.cls,
        tbt_ms: refreshedProperty.tbt_ms,
      },
      url: `https://${property.url}`,
      fetchTime: metrics?.fetchTime || new Date().toISOString(),
    };

    let websiteFetch = { content: "", source: null };
    try {
      websiteFetch = await fetchWebsiteContent(property.url);
    } catch (error) {
      console.warn(`Website fetch failed: ${property.url} (${error.message})`);
    }

    const signals = websiteFetch.content
      ? detectMartech(websiteFetch.content, fallbackMartech)
      : {
          platform: fallbackMartech.platform,
          pageBuilder: fallbackMartech.pageBuilder,
          hubspot: fallbackMartech.hubspot,
          ga4: fallbackMartech.ga4,
          oneTrust: fallbackMartech.oneTrust,
        };

    refreshedMartech.push({
      ...fallbackMartech,
      platform: signals.platform,
      pageBuilder: signals.pageBuilder,
      hubspot: signals.hubspot,
      ga4: signals.ga4,
      oneTrust: signals.oneTrust,
    });

    const deepSignals = websiteFetch.content ? detectWebsiteSignals(websiteFetch.content) : null;
    const resolvedSignals = {
      hasAnalytics: deepSignals ? deepSignals.hasAnalytics || signals.ga4 : fallbackAudit.hasAnalytics || signals.ga4,
      hasFacebookPixel: deepSignals ? deepSignals.hasFacebookPixel : fallbackAudit.hasFacebookPixel,
      hasSchemaMarkup: deepSignals ? deepSignals.hasSchemaMarkup : fallbackAudit.hasSchemaMarkup,
      hasContactForm: deepSignals ? deepSignals.hasContactForm : fallbackAudit.hasContactForm,
      hasClearCta: deepSignals ? deepSignals.hasClearCta : fallbackAudit.hasClearCta,
      hasPhoneVisible: deepSignals ? deepSignals.hasPhoneVisible : fallbackAudit.hasPhoneVisible,
      hasSocialLinks: deepSignals ? deepSignals.hasSocialLinks : fallbackAudit.hasSocialLinks,
      socialPlatforms: deepSignals ? deepSignals.socialPlatforms : fallbackAudit.socialPlatforms || [],
    };

    const websiteQualityScore = websiteFetch.content
      ? computeWebsiteQualityScore(refreshedProperty, resolvedSignals)
      : fallbackAudit.websiteQualityScore;

    const anthropicSummary = await maybeGenerateAnthropicSummary(
      anthropicApiKey,
      refreshedProperty,
      signals,
      resolvedSignals,
      websiteQualityScore,
      websiteFetch.content
    );

    const heuristicSummary = buildHeuristicSummary(
      refreshedProperty,
      signals,
      resolvedSignals,
      websiteQualityScore,
      websiteFetch.source
    );

    refreshedWebsiteAudits.push({
      ...fallbackAudit,
      name: property.name,
      url: property.url,
      division: property.division,
      hasWebsite: !!websiteFetch.content || fallbackAudit.hasWebsite,
      hasAnalytics: resolvedSignals.hasAnalytics,
      hasFacebookPixel: resolvedSignals.hasFacebookPixel,
      hasSchemaMarkup: resolvedSignals.hasSchemaMarkup,
      hasContactForm: resolvedSignals.hasContactForm,
      hasClearCta: resolvedSignals.hasClearCta,
      hasPhoneVisible: resolvedSignals.hasPhoneVisible,
      hasSocialLinks: resolvedSignals.hasSocialLinks,
      socialPlatforms: resolvedSignals.socialPlatforms,
      websitePlatform: signals.platform,
      websiteQualityScore,
      auditSummary: anthropicSummary || heuristicSummary,
      usedAnthropicSummary: !!anthropicSummary,
      fetchSource: websiteFetch.source || fallbackAudit.fetchSource || null,
    });

    await sleep(250);
  }

  const nextData = {
    ...current,
    updatedAt: new Date().toISOString(),
    source: "Google PageSpeed API + live website signal analysis + heuristic website audit",
    webProperties: refreshedWebProperties,
    propertyMarTech: refreshedMartech,
    websiteAudits: refreshedWebsiteAudits,
  };

  await fs.writeFile(platformDataPath, `${JSON.stringify(nextData, null, 2)}\n`, "utf8");
  await fs.writeFile(lighthouseSummaryPath, `${JSON.stringify(lighthouseSummary, null, 2)}\n`, "utf8");

  console.log(`Refreshed ${refreshedWebProperties.length} properties`);
  console.log(`Wrote ${path.relative(repoRoot, platformDataPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, lighthouseSummaryPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
