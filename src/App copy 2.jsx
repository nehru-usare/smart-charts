import Column2DDashboard from "./components/Column2DDashboard";
import dashboardConfig from "./data/dashboardConfig.json";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Column2DDashboard config={dashboardConfig} />
    </div>
  );
}
