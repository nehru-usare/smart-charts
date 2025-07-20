import { useState } from "react";
import Column2D from "./Column2D";
import Line2D from "./Line2D";
import columnChartData from "../data/columnChart.json";
import lineChartData from "../data/lineChart.json";

const chartOptions = [
  { label: "Column2D", value: "column" },
  { label: "Line2D", value: "line" },
];

export default function ChartSwitcher() {
  const [selected, setSelected] = useState("column");

  const renderChart = () => {
    const chartProps = {
      width: "100%",
      height: "100%",
    };

    switch (selected) {
      case "line":
        return (
          <Line2D
            data={lineChartData.data}
            config={{ ...lineChartData.chart, ...chartProps }}
          />
        );
      case "column":
      default:
        return (
          <Column2D
            data={columnChartData.data}
            config={{ ...columnChartData.chart, ...chartProps }}
          />
        );
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          {chartOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          padding: 16,
          borderRadius: 8,
          height: 800,
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>{renderChart()}</div>
      </div>
    </div>
  );
}
