import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  const tileStyle = {
    width: 11,
    height: 11,
    borderRadius: 2,
  };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: 6,
        background: "#14213d",
        padding: 4,
      }}
    >
      <div style={{ display: "flex", gap: 2 }}>
        <div style={{ ...tileStyle, background: "#f7f4ed" }} />
        <div style={{ ...tileStyle, background: "#147d79" }} />
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        <div style={{ ...tileStyle, background: "#b94f35" }} />
        <div style={{ ...tileStyle, background: "#f7f4ed" }} />
      </div>
    </div>,
    size,
  );
}
