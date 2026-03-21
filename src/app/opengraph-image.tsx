import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Digital Marketing & MarTech Vision for Apex Intermediaries | Kyle Naughtrip";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#182A53",
          padding: "60px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* Top: Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#c5923a",
            }}
          />
          <span
            style={{
              color: "#c5923a",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Digital Marketing & MarTech Vision
          </span>
        </div>

        {/* Middle: Main Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            A Digital Marketing Vision for
            <br />
            Apex Intermediaries
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#94a3b8",
              margin: 0,
              maxWidth: "800px",
            }}
          >
            strategic roadmap, platform health dashboard, and content engine
          </p>
        </div>

        {/* Bottom: Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#c5923a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            K
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: 600,
              }}
            >
              Kyle Naughtrip
            </span>
            <span
              style={{
                color: "#64748b",
                fontSize: "18px",
              }}
            >
              kyle@naughtrip.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
