import Column2D from "./Column2D";
import chartConfigs from "../data/columnCharts.json";

export default function Dashboard() {
  return (
    <div
      style={{
        padding: 20,
        background: "#f8f8f8",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>📊 Column2D Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // Always 2 columns
          gridTemplateRows: "repeat(2, 1fr)",    // 2 rows
          gap: "24px",
        }}
      >
        {chartConfigs.map((chart, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 16,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              height: 400, // Fixed height for charts
              width: "100%", // Ensure full width inside grid cell
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Column2D
              data={chart.data}
              config={{
                ...chart.chart,
                height: "100%", // Stretch to container
                width: "100%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
