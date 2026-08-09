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
          justifyContent: "center",
          padding: "70px",
          background: "#111111",
          color: "#ffffff",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 38,
            fontWeight: 700,
            marginBottom: 35,
          }}
        >
          ORT
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
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
            marginTop: 35,
            fontSize: 24,
            opacity: 0.6,
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
