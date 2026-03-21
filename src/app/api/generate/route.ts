import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const MAX_TOPIC_LENGTH = 240;
const ipWindow = new Map<string, { count: number; resetAt: number }>();

const CONTENT_TYPE_PROMPTS: Record<string, string> = {
  linkedin: `Write a LinkedIn post for an insurance industry professional. The post should:
- Be 150-250 words
- Start with a compelling industry observation or trend
- Include 2-3 actionable insights for agents, brokers, or risk managers
- End with a question to encourage engagement
- Include 3-4 relevant hashtags (insurance industry)
- Sound like a knowledgeable insurance professional, not a marketer
- Be professional but personable
- Avoid making promises about coverage or claims outcomes`,

  article: `Write a blog post/market update for an insurance industry audience. The post should:
- Include a clear headline
- Have an executive summary (2-3 sentences)
- Be structured with 3-4 main sections using ## headers
- Include actionable insights for agents and brokers
- Be 300-400 words
- Sound authoritative and helpful, not salesy
- Include appropriate disclaimers about coverage varying by state/carrier`,

  speaking: `Create 2-3 speaking topic proposals for an insurance industry conference or webinar. Each should include:
- A compelling title
- Suggested format (keynote, panel, workshop)
- Target audience (agents, brokers, underwriters, risk managers)
- 3-4 key takeaways attendees will gain
- Why this topic is timely/relevant in the current insurance market`,

  newsletter: `Write an email newsletter segment for an insurance intermediary's agent/broker outreach. The newsletter should:
- Have a clear, engaging subject line suggestion
- Open with a brief, relevant market hook (1-2 sentences)
- Cover 1-2 key developments or insights in the line of business
- Include practical implications for agents and their clients
- End with a soft call-to-action (contact your Apex representative, etc.)
- Be 200-300 words total
- Sound helpful and informative, avoiding coverage promises`,
};

type ContentType = keyof typeof CONTENT_TYPE_PROMPTS;

type GeneratePayload = {
  practiceArea: string;
  contentType: ContentType;
  topic?: string;
};

function getRequestKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(requestKey: string): boolean {
  const now = Date.now();
  const windowState = ipWindow.get(requestKey);

  if (!windowState || windowState.resetAt <= now) {
    ipWindow.set(requestKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (windowState.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  windowState.count += 1;
  return false;
}

function parsePayload(value: unknown): { payload?: GeneratePayload; error?: string } {
  if (typeof value !== "object" || value === null) {
    return { error: "Invalid request payload" };
  }

  const obj = value as Record<string, unknown>;
  const practiceArea = typeof obj.practiceArea === "string" ? obj.practiceArea.trim() : "";
  const contentTypeRaw = typeof obj.contentType === "string" ? obj.contentType : "";
  const topicRaw = obj.topic;

  if (!practiceArea) {
    return { error: "Line of business is required" };
  }

  if (!(contentTypeRaw in CONTENT_TYPE_PROMPTS)) {
    return { error: "Invalid content type" };
  }

  if (topicRaw !== undefined && typeof topicRaw !== "string") {
    return { error: "Topic must be a string when provided" };
  }

  const topic = topicRaw?.trim();

  return {
    payload: {
      practiceArea,
      contentType: contentTypeRaw as ContentType,
      topic: topic ? topic.slice(0, MAX_TOPIC_LENGTH) : undefined,
    },
  };
}

export async function POST(request: NextRequest) {
  const requestKey = getRequestKey(request);
  if (isRateLimited(requestKey)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait and try again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { payload, error } = parsePayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: error || "Invalid request payload" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Content generation is not configured on this deployment." },
      { status: 503 }
    );
  }

  const client = new Anthropic({ apiKey });
  const contentTypePrompt = CONTENT_TYPE_PROMPTS[payload.contentType];
  const topicContext = payload.topic
    ? `The specific topic to focus on is: "${payload.topic}"`
    : "Choose a timely, relevant topic based on current trends in this line of business.";

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a thought leadership content creator for Apex Intermediaries, one of the largest insurance intermediaries globally. Apex has three divisions: Apex Programs (MGA/MGU with 190 programs across 400+ carrier relationships), Atlas Specialty Group (wholesale brokerage with 230+ markets), and Apex Wholesale (affinity, captives, reinsurance, travel, warranty, benefits). They serve retail agents, brokers, and carrier partners — NOT consumers.

Line of Business: ${payload.practiceArea}
${topicContext}

${contentTypePrompt}

Write the content now. Do not include any preamble or explanation - just the content itself.`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock?.text) {
      return NextResponse.json(
        { error: "Unexpected response format" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: textBlock.text.trim() });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
