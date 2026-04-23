import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DemoPage from "./pages/DemoPage";
import GetStartedPage from "./pages/GetStartedPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DemoPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
      </Route>
    </Routes>
  );
}
