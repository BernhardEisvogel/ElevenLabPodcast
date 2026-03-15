import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(255,122,48,1) 0%, rgba(23,109,105,1) 100%)",
          borderRadius: 18,
          color: "#08111f",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.08em",
        }}
      >
        SW
      </div>
    ),
    size,
  );
}
