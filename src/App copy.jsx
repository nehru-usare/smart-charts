// 📁 App.jsx
import Column2D from "./components/Column2D";

// Chart configuration and data
const chartData = {
  chart: {
    // ✨ Chart Titles
    title: "Monthly Revenue - 2024",         // Main chart title
    subtitle: "Harry's SuperMart",           // Optional subtitle
    showDescription: true,                   // Show subtitle below title

    // 💾 Export Settings
    showExportButton: true,                  // Shows a JPG export button at top-right
    exportFileName: "my-chart",              // Exported file name without extension

    // 🎨 Chart Appearance
    width: "100%",                           // SVG width (can be % or fixed px)
    height: "100%",                          // SVG height (can be % or fixed px)
    backgroundColor: "#f0f0f0",              // Background color of chart container
    orientation: "vertical",                 // 'vertical' or 'horizontal' bars

    // 🔢 Values & Labels
    showValues: true,                        // Show numbers above bars
    numberPrefix: "",                        // e.g., "$", "₹", etc.

    // 🏷️ Axis Labels
    axisNames: {
      x: "Month",                            // X-axis title
      y: "Revenue (USD)",                    // Y-axis title
    },

    // 🖋️ Fonts
    captionFont: "20px sans-serif",          // Main title font
    subCaptionFont: "14px sans-serif",       // Subtitle font

    // 🌈 Bar Colors
    colors: {
      bar: "#2ecc71",                        // Default bar color
      hover: "#27ae60",                      // On-hover color (optional)
    },

    // 📦 Bar Styling
    bar: {
      width: 30,                             // Fixed bar width in px
      spacing: 15,                           // Space between bars
      radius: 6,                             // Rounded corners
    },

    // 📊 Axis Configuration
    axis: {
      yTicks: 6,                             // Number of Y-axis ticks
      xLabelFont: "12px sans-serif",         // Font for X-axis labels
      yLabelFont: "11px sans-serif",         // Font for Y-axis labels

      // Custom Y-axis formatting (adds $K or $M)
      formatY: (val) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
        return `$${val}`;
      },

      yAxisLabelOffset: 45,                 // Space between Y tick labels and axis line
      yAxisTitlePadding: 10,                // Space between Y-axis labels and title
    },

    // ➕ Grid Lines
    showXAxisLine: true,
    showYAxisLine: true,

    // 📉 Trendlines
    showTrendlines: true,
    trendlines: [
      {
        line: [
          {
            startvalue: "700000",           // Value where trendline appears
            displayvalue: "Target",         // Label for the trendline
            valueOnRight: "1",              // Show label on right side
          },
        ],
      },
    ],

    // 🧠 Events
    events: {
      onBarClick: (d) => alert(`Clicked: ${d.label}`),
      onBarHover: (d) => console.log("Hovered:", d),
    },
  },

  // 📈 Chart Data (bars)
  data: [
    { label: "Jan", value: 420000, color: "#f39c12", description: "Post-holiday dip" },
    { label: "Feb", value: 810000, color: "#e74c3c", description: "Valentine's spike" },
    { label: "Mar", value: 720000, description: "Strong marketing campaign" },
    { label: "Apr", value: 550000 },
    { label: "May", value: 910000 },
    { label: "Jun", value: 510000 },
    { label: "Jul", value: 680000 },
    { label: "Aug", value: 620000 },
    { label: "Sep", value: 610000 },
    { label: "Oct", value: 490000 },
    { label: "Nov", value: 900000 },
    { label: "Dec", value: 730000 },
  ],
};

// ✅ Main App Component
export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Pass chart data and configuration to Column2D */}
      <Column2D data={chartData.data} config={chartData.chart} />
    </div>
  );
}
