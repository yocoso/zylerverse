import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./screens/Home";
import RandomEntry from "./screens/RandomEntry";
import QuestionView from "./screens/QuestionView";
import Browse from "./screens/Browse";
import Completion from "./screens/Completion";
import Favorites from "./screens/Favorites";
import Settings from "./screens/Settings";

export default function App() {
  return (
    <div className="mx-auto min-h-full w-full max-w-app bg-paper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c/:collectionId" element={<RandomEntry />} />
        <Route path="/c/:collectionId/browse" element={<Browse />} />
        <Route path="/c/:collectionId/done" element={<Completion />} />
        <Route path="/c/:collectionId/q/:questionId" element={<QuestionView />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
