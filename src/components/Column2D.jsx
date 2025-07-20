// 📁 src/components/Column2D.jsx
import { useRef } from "react";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { scaleLinear } from "../utils/scale";
import Axis from "./Axis";
import Grid from "./Grid";

const defaultConfig = {
  width: "100%",
  height: "100%",
  paddingLeft: 60,
  paddingRight: 40,
  paddingTop: 40,
  paddingBottom: 40,
  backgroundColor: "#ffffff",
  title: "",
  subtitle: "",
  captionFont: "16px sans-serif",
  subCaptionFont: "12px sans-serif",
  axisNames: {
    x: "",
    y: "",
  },
  showXAxisLine: true,
  showYAxisLine: true,
  showExportButton: false,
  exportFileName: "chart",
  orientation: "vertical",
  showDescription: true,
  showTrendlines: true,
  showValues: true,
  numberPrefix: "",
  colors: {
    bar: "#4e79a7",
    hover: "#7aa1d2",
  },
  bar: {
    radius: 4,
    spacing: 8,
    width: null,
  },
  axis: {
    yTicks: 5,
    formatY: (v) => v,
    xLabelFont: "12px sans-serif",
    yLabelFont: "10px sans-serif",
    yAxisLabelOffset: 45,
    yAxisTitlePadding: 10,
  },
  trendlines: [],
  events: {
    onBarClick: () => {},
    onBarHover: () => {},
  },
};

function measureTextWidth(text, font = "11px sans-serif") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}

export default function Column2D({ data, config = {} }) {
  const cfg = { ...defaultConfig, ...config };
  cfg.axis = { ...defaultConfig.axis, ...config.axis };

  const yLabelOffset = cfg.axis.yAxisLabelOffset || 45;
  const yTitlePadding = cfg.axis.yAxisTitlePadding || 10;
  const yAxisTitleWidth = measureTextWidth(
    cfg.axisNames.y || "",
    "11px sans-serif"
  );
  cfg.paddingLeft = Math.max(
    cfg.paddingLeft,
    yAxisTitleWidth + yLabelOffset + yTitlePadding
  );

  const ref = useRef(null);
  const svgRef = useRef(null);
  const { width, height } = useResizeObserver(ref);
  const svgWidth =
    typeof cfg.width === "number" ? cfg.width : width || window.innerWidth;
  const svgHeight =
    typeof cfg.height === "number" ? cfg.height : height || window.innerHeight;
  const isVertical = cfg.orientation !== "horizontal";

  const handleExport = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const clonedSvg = svgElement.cloneNode(true);
    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const canvas = document.createElement("canvas");
    canvas.width = svgElement.clientWidth || svgWidth;
    canvas.height = svgElement.clientHeight || svgHeight;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      ctx.fillStyle = cfg.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `${cfg.exportFileName || "chart"}.jpg`;
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    };
    image.src = url;
  };

  if (data.length === 0) {
    return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
  }

  const values = data.map((d) => parseFloat(d.value));
  const trendValues = cfg.showTrendlines
    ? cfg.trendlines.flatMap((t) => t.line.map((l) => parseFloat(l.startvalue)))
    : [];
  const maxValue = Math.max(...values, ...trendValues);

  const range = isVertical
    ? [svgHeight - cfg.paddingBottom, cfg.paddingTop]
    : [cfg.paddingLeft, svgWidth - cfg.paddingRight];
  const scale = scaleLinear([0, maxValue], range);

  const fullBand =
    (isVertical
      ? svgWidth - cfg.paddingLeft - cfg.paddingRight
      : svgHeight - cfg.paddingTop - cfg.paddingBottom) / data.length;
  const barThickness = cfg.bar.width || fullBand - cfg.bar.spacing;

  const getTicks = (max, count) => {
    const step = max / (count - 1);
    return Array.from({ length: count }, (_, i) => Math.round(i * step));
  };
  const yTicks = getTicks(maxValue, cfg.axis.yTicks);

  return (
    <div
      ref={ref}
      style={{
        width: typeof cfg.width === "string" ? cfg.width : "100%",
        height: typeof cfg.height === "string" ? cfg.height : "100%",
        backgroundColor: cfg.backgroundColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {cfg.showExportButton && (
       <button
  onClick={handleExport}
  title="Export JPG"
  style={{
    position: "absolute",
    top: 10,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease",
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#27ae60")}
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2ecc71")}
>
  📤
</button>

      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={svgWidth}
        height={svgHeight}
        xmlns="http://www.w3.org/2000/svg"
      >
        {cfg.title && (
          <text
            x={svgWidth / 2}
            y={24}
            fontSize={cfg.captionFont}
            textAnchor="middle"
          >
            {cfg.title}
          </text>
        )}
        {cfg.subtitle && cfg.showDescription && (
          <text
            x={svgWidth / 2}
            y={42}
            fontSize={cfg.subCaptionFont}
            textAnchor="middle"
          >
            {cfg.subtitle}
          </text>
        )}

        {cfg.showYAxisLine && (
          <line
            x1={cfg.paddingLeft}
            x2={cfg.paddingLeft}
            y1={cfg.paddingTop}
            y2={svgHeight - cfg.paddingBottom}
            stroke="#ccc"
          />
        )}
        {cfg.showXAxisLine && (
          <line
            x1={cfg.paddingLeft}
            x2={svgWidth - cfg.paddingRight}
            y1={svgHeight - cfg.paddingBottom}
            y2={svgHeight - cfg.paddingBottom}
            stroke="#ccc"
          />
        )}

        <Grid
          width={svgWidth}
          height={svgHeight}
          xTicks={[]}
          yTicks={yTicks}
          xScale={() => 0}
          yScale={scale}
        />

        {cfg.showTrendlines &&
          isVertical &&
          cfg.trendlines.map((t, i) =>
            t.line.map((line, j) => {
              const y = scale(parseFloat(line.startvalue));
              return (
                <g key={`trend-${i}-${j}`}>
                  <line
                    x1={cfg.paddingLeft}
                    x2={svgWidth - cfg.paddingRight}
                    y1={y}
                    y2={y}
                    stroke="red"
                    strokeDasharray="4 2"
                  />
                  <text
                    x={
                      line.valueOnRight === "1"
                        ? svgWidth - cfg.paddingRight
                        : cfg.paddingLeft
                    }
                    y={y - 4}
                    fontSize="10"
                    textAnchor={line.valueOnRight === "1" ? "end" : "start"}
                    fill="red"
                  >
                    {line.displayvalue}
                  </text>
                </g>
              );
            })
          )}

        {data.map((d, i) => {
          const value = parseFloat(d.value);
          const pos = scale(value);
          const color = d.color || cfg.colors.bar;

          if (isVertical) {
            const x =
              cfg.paddingLeft +
              i * fullBand +
              (cfg.bar.width
                ? (fullBand - cfg.bar.width) / 2
                : cfg.bar.spacing / 2);
            const y = pos;
            const height = svgHeight - cfg.paddingBottom - y;

            return (
              <g key={i}>
                <title>{d.description || ""}</title>
                <rect
                  x={x}
                  y={y}
                  width={barThickness}
                  height={height}
                  rx={cfg.bar.radius}
                  fill={color}
                  onClick={() => cfg.events.onBarClick(d)}
                  onMouseEnter={() => cfg.events.onBarHover(d)}
                  style={{ cursor: "pointer" }}
                />
                {cfg.showValues && (
                  <text
                    x={x + barThickness / 2}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize="10"
                  >
                    {cfg.numberPrefix}
                    {value}
                  </text>
                )}
              </g>
            );
          } else {
            const y =
              cfg.paddingTop +
              i * fullBand +
              (cfg.bar.width
                ? (fullBand - cfg.bar.width) / 2
                : cfg.bar.spacing / 2);
            const x = cfg.paddingLeft;
            const width = pos - cfg.paddingLeft;

            return (
              <g key={i}>
                <title>{d.description || ""}</title>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={barThickness}
                  rx={cfg.bar.radius}
                  fill={color}
                  onClick={() => cfg.events.onBarClick(d)}
                  onMouseEnter={() => cfg.events.onBarHover(d)}
                  style={{ cursor: "pointer" }}
                />
                {cfg.showValues && (
                  <text
                    x={x + width + 5}
                    y={y + barThickness / 2 + 3}
                    fontSize="10"
                  >
                    {cfg.numberPrefix}
                    {value}
                  </text>
                )}
              </g>
            );
          }
        })}

        {isVertical && (
          <g transform={`translate(${cfg.paddingLeft}, 0)`}>
            <Axis
              scale={scale}
              ticks={yTicks}
              isVertical={true}
              size={svgHeight - cfg.paddingBottom}
              font={cfg.axis.yLabelFont}
              format={(v) => `${cfg.numberPrefix}${cfg.axis.formatY(v)}`}
            />
          </g>
        )}

        {data.map((d, i) => {
          if (isVertical) {
            const x = cfg.paddingLeft + i * fullBand + fullBand / 2;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={svgHeight - cfg.paddingBottom + 15}
                fontSize={cfg.axis.xLabelFont}
                textAnchor="middle"
              >
                {d.label}
              </text>
            );
          } else {
            const y = cfg.paddingTop + i * fullBand + fullBand / 2;
            return (
              <text
                key={`label-${i}`}
                x={cfg.paddingLeft - 8}
                y={y + 4}
                fontSize={cfg.axis.xLabelFont}
                textAnchor="end"
              >
                {d.label}
              </text>
            );
          }
        })}

        {cfg.axisNames.x && isVertical && (
          <text
            x={svgWidth / 2}
            y={svgHeight - 5}
            fontSize="11px"
            textAnchor="middle"
          >
            {cfg.axisNames.x}
          </text>
        )}
        {cfg.axisNames.y && isVertical && (
          <text
            x={cfg.paddingLeft - yLabelOffset - yTitlePadding}
            y={svgHeight / 2}
            fontSize="11px"
            textAnchor="middle"
            transform={`rotate(-90, ${
              cfg.paddingLeft - yLabelOffset - yTitlePadding
            }, ${svgHeight / 2})`}
            style={{ dominantBaseline: "middle", fill: "#666" }}
          >
            {cfg.axisNames.y}
          </text>
        )}
      </svg>
    </div>
  );
}
