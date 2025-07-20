// 📁 src/components/Column2DDashboard.jsx
import { useRef } from "react";
import Column2D from "./Column2D";

export default function Column2DDashboard({ config }) {
  const { dashboard = {}, charts = [] } = config;
  const containerRef = useRef(null);

  const {
    title,
    subtitle,
    layout = "2x2",
    gap = 24,
    padding = 20,
    background = "#f8f8f8",
    showExportButton = false,
    exportFileName = "dashboard",
  } = dashboard;

  const getGridTemplate = () => {
    const [cols] = layout.split("x").map(Number);
    return `repeat(${cols || 2}, minmax(0, 1fr))`;
  };

  const handleExport = () => {
    const svgElements = containerRef.current.querySelectorAll("svg");
    if (!svgElements.length) return;

    const combinedWidth = svgElements[0].clientWidth;
    const combinedHeight =
      [...svgElements].reduce((acc, el) => acc + el.clientHeight, 0) +
      (title ? 40 : 0);

    const svgWrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgWrapper.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgWrapper.setAttribute("width", combinedWidth);
    svgWrapper.setAttribute("height", combinedHeight);

    let yOffset = title ? 40 : 0;

    if (title) {
      const titleElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
      titleElem.setAttribute("x", combinedWidth / 2);
      titleElem.setAttribute("y", 30);
      titleElem.setAttribute("font-size", "20");
      titleElem.setAttribute("text-anchor", "middle");
      titleElem.setAttribute("fill", "#000");
      titleElem.textContent = title;
      svgWrapper.appendChild(titleElem);
    }

    svgElements.forEach((svg) => {
      const cloned = svg.cloneNode(true);
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(0, ${yOffset})`);
      g.appendChild(cloned);
      svgWrapper.appendChild(g);
      yOffset += svg.clientHeight + gap;
    });

    const svgString = new XMLSerializer().serializeToString(svgWrapper);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = combinedWidth;
      canvas.height = combinedHeight;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = `${exportFileName}.jpg`;
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    };
    img.src = url;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding,
        background,
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {showExportButton && (
        <button
          onClick={handleExport}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            background: "#eee",
            border: "1px solid #ccc",
            borderRadius: 4,
            fontSize: "18px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
          title="Export as JPG"
        >
          📤
        </button>
      )}

      {title && (
        <h2 style={{ marginBottom: 4, fontSize: "24px", fontWeight: "600", color: "#333" }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{ marginBottom: 24, fontSize: "14px", color: "#666" }}>{subtitle}</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: getGridTemplate(),
          gap,
        }}
      >
        {charts.map((chart, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              height: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Column2D
              data={chart.data}
              config={{
                ...chart.chart,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
