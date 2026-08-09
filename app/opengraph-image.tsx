import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ORT — Entertainment, Media & Culture";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background: "#ffffff",
          color: "#111111",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          ORT
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
            }}
          >
            Entertainment,
            <br />
            Media & Culture.
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              opacity: 0.55,
            }}
          >
            Programs · Reels · News · Music · Original Productions
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 18,
            opacity: 0.4,
          }}
        >
          ortcompany.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
