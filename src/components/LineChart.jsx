import { useRef } from "react";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { scaleLinear } from "../utils/scale";
import Axis from "./Axis";
import Grid from "./Grid";

export default function LineChart({ data }) {
  const containerRef = useRef(null);
  const { width, height } = useResizeObserver(containerRef);

  const padding = 40;
  if (width === 0 || height === 0 || data.length === 0) {
    return <div ref={containerRef} style={{ width: "100%", height: 300 }} />;
  }

  const xValues = data.map((d) => d.x);
  const yValues = data.map((d) => d.y);

  const xScale = scaleLinear(
    [Math.min(...xValues), Math.max(...xValues)],
    [padding, width - padding]
  );
  const yScale = scaleLinear(
    [Math.min(...yValues), Math.max(...yValues)],
    [height - padding, padding]
  );

  const points = data.map((d) => `${xScale(d.x)},${yScale(d.y)}`).join(" ");

  const getTicks = (min, max) => {
    const step = (max - min) / 4;
    return Array.from({ length: 5 }, (_, i) => Math.round(min + i * step));
  };

  const xTicks = getTicks(Math.min(...xValues), Math.max(...xValues));
  const yTicks = getTicks(Math.min(...yValues), Math.max(...yValues));

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: 300, // fixed height
        overflow: "hidden", // prevent overflow
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`} // make SVG scalable
        width="100%" // scale to parent
        height="100%"
      >
        <Grid
          width={width}
          height={height}
          xTicks={xTicks}
          yTicks={yTicks}
          xScale={xScale}
          yScale={yScale}
        />
        <polyline fill="none" stroke="blue" strokeWidth="2" points={points} />
        <g transform="translate(0, 0)">
          <Axis
            scale={yScale}
            ticks={yTicks}
            isVertical={true}
            size={height - padding}
          />
        </g>
        <g transform={`translate(0, ${height - padding})`}>
          <Axis
            scale={xScale}
            ticks={xTicks}
            isVertical={false}
            size={width - padding}
          />
        </g>
      </svg>
    </div>
  );
}
