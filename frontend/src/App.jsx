import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ExploreList from "./pages/ExploreList";
import DeityDetail from "./pages/DeityDetail";
import MythicalDetail from "./pages/MythicalDetail";
import RecordDetail from "./pages/RecordDetail";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/deities" replace />} />
        <Route path="/deities/:slug" element={<DeityDetail />} />
        <Route path="/mythical-beings/:slug" element={<MythicalDetail />} />
        <Route path="/:resource/:param" element={<RecordDetail />} />
        <Route path="/:kind" element={<ExploreList />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
