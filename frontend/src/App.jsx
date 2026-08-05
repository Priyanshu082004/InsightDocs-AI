import AppRouter from "./router/AppRouter";
import AppBackground from "./components/common/AppBackground";

export default function App() {
  return (
    <div className="relative isolate min-h-screen">
      <AppBackground />

      <div className="relative z-10">
        <AppRouter />
      </div>
    </div>
  );
}