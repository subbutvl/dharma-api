import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DeityDetail from "./pages/DeityDetail";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deities/:slug" element={<DeityDetail />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
