import { useRef } from "react";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { scaleLinear } from "../utils/scale";

const defaultConfig = {
  width: "100%",
  height: "100%",
  backgroundColor: "#ffffff",
  caption: "",
  subCaption: "",
  captionFont: "16px sans-serif",
  subCaptionFont: "12px sans-serif",
  xAxisName: "",
  yAxisName: "",
  lineThickness: 2,
  showValues: true,
  showTrendlines: true,
  numberPrefix: "",
  colors: {
    line: "#3498db",
    trendline: "#1aaf5d",
  },
  axis: {
    yTicks: 5,
    formatY: (v) => v,
    labelFont: "12px sans-serif",
    yAxisLabelOffset: 45,
  },
  trendlines: [],
};

export default function Line2D({ data, config = {} }) {
  const cfg = { ...defaultConfig, ...config };
  const ref = useRef(null);
  const svgRef = useRef(null);

  const { width, height } = useResizeObserver(ref);
  const svgWidth = typeof cfg.width === "number" ? cfg.width : width || 600;
  const svgHeight = typeof cfg.height === "number" ? cfg.height : height || 400;

  const padding = {
    top: 40,
    right: 40,
    bottom: 40,
    left: cfg.axis.yAxisLabelOffset + 40,
  };

  if (!data || data.length === 0) {
    return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
  }

  const values = data.map((d) => parseFloat(d.value));
  const maxValue = Math.max(...values);
  const xScale = (i) =>
    padding.left +
    (i / (data.length - 1)) * (svgWidth - padding.left - padding.right);
  const yScale = scaleLinear([0, maxValue], [
    svgHeight - padding.bottom,
    padding.top,
  ]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: cfg.backgroundColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={svgWidth}
        height={svgHeight}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Caption */}
        {cfg.caption && (
          <text
            x={svgWidth / 2}
            y={24}
            fontSize={cfg.captionFont}
            textAnchor="middle"
          >
            {cfg.caption}
          </text>
        )}

        {/* Subcaption */}
        {cfg.subCaption && (
          <text
            x={svgWidth / 2}
            y={42}
            fontSize={cfg.subCaptionFont}
            textAnchor="middle"
            fill="#666"
          >
            {cfg.subCaption}
          </text>
        )}

        {/* Y-Axis */}
        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={svgHeight - padding.bottom}
          stroke="#ccc"
        />

        {/* X-Axis */}
        <line
          x1={padding.left}
          x2={svgWidth - padding.right}
          y1={svgHeight - padding.bottom}
          y2={svgHeight - padding.bottom}
          stroke="#ccc"
        />

        {/* Y-Axis Labels */}
        {Array.from({ length: cfg.axis.yTicks }).map((_, i) => {
          const v = (maxValue / (cfg.axis.yTicks - 1)) * i;
          const y = yScale(v);
          return (
            <text
              key={`ytick-${i}`}
              x={padding.left - 8}
              y={y + 4}
              fontSize={cfg.axis.labelFont}
              textAnchor="end"
            >
              {cfg.numberPrefix + cfg.axis.formatY(v)}
            </text>
          );
        })}

        {/* X Labels */}
        {data.map((d, i) => (
          <text
            key={`xlabel-${i}`}
            x={xScale(i)}
            y={svgHeight - padding.bottom + 16}
            fontSize={cfg.axis.labelFont}
            textAnchor="middle"
          >
            {d.label}
          </text>
        ))}

        {/* Line Path with animation */}
        <polyline
          fill="none"
          stroke={cfg.colors.line}
          strokeWidth={cfg.lineThickness}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={data.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(" ")}
        >
          <animate
            attributeName="stroke-dasharray"
            from="0,1000"
            to="1000,0"
            dur="0.8s"
            fill="freeze"
          />
        </polyline>

        {/* Points with animation */}
        {data.map((d, i) => {
          const cx = xScale(i);
          const cy = yScale(d.value);
          return (
            <circle
              key={`point-${i}`}
              cx={cx}
              cy={cy}
              r={3}
              fill={cfg.colors.line}
              opacity={0}
            >
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="0.5s"
                begin={`${i * 0.1}s`}
                fill="freeze"
              />
              <animate
                attributeName="r"
                from="0"
                to="3"
                dur="0.4s"
                begin={`${i * 0.1}s`}
                fill="freeze"
              />
            </circle>
          );
        })}

        {/* Value Labels */}
        {cfg.showValues &&
          data.map((d, i) => (
            <text
              key={`val-${i}`}
              x={xScale(i)}
              y={yScale(d.value) - 6}
              fontSize="10px"
              textAnchor="middle"
              fill="#000"
            >
              {cfg.numberPrefix + d.value}
            </text>
          ))}

        {/* Trendlines */}
        {cfg.showTrendlines &&
          cfg.trendlines.flatMap((t, ti) =>
            t.line.map((line, li) => {
              const y = yScale(parseFloat(line.startvalue));
              return (
                <g key={`trend-${ti}-${li}`}>
                  <line
                    x1={padding.left}
                    x2={svgWidth - padding.right}
                    y1={y}
                    y2={y}
                    stroke={line.color || cfg.colors.trendline}
                    strokeDasharray="4 2"
                    strokeWidth={line.thickness || 1}
                  />
                  <text
                    x={
                      line.valueOnRight === "1" || line.valueOnRight === true
                        ? svgWidth - padding.right
                        : padding.left
                    }
                    y={y - 4}
                    fontSize="10"
                    textAnchor={
                      line.valueOnRight === "1" || line.valueOnRight === true
                        ? "end"
                        : "start"
                    }
                    fill={line.color || cfg.colors.trendline}
                  >
                    {(line.displayvalue || "").replace(/{br}/g, " ")}
                  </text>
                </g>
              );
            })
          )}

        {/* Axis Titles */}
        {cfg.xAxisName && (
          <text
            x={svgWidth / 2}
            y={svgHeight - 8}
            fontSize="11px"
            textAnchor="middle"
          >
            {cfg.xAxisName}
          </text>
        )}
        {cfg.yAxisName && (
          <text
            x={padding.left - 35}
            y={svgHeight / 2}
            fontSize="11px"
            textAnchor="middle"
            transform={`rotate(-90, ${padding.left - 35}, ${svgHeight / 2})`}
            style={{ dominantBaseline: "middle", fill: "#666" }}
          >
            {cfg.yAxisName}
          </text>
        )}
      </svg>
    </div>
  );
}
