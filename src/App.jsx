import { Routes, Route } from "react-router-dom";

import { useGame } from "./context/GameContext";

import Sidebar from "./components/Sidebar/Sidebar";

import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Labs from "./pages/Labs";
import Commands from "./pages/Commands";
import Lesson from "./pages/Lesson";
import Achievements from "./pages/Achievements";

import lessons from "./data/lessons";

function App() {
  const {
    completedLessons,
    setCompletedLessons,
    unlockedLessons,
    setUnlockedLessons,
  } = useGame();

  const progress = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  return (
    <div className="flex h-screen bg-fedora-bg">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 font-body">
        <Routes>
          <Route
  path="/"
  element={<Dashboard />}
/>

          <Route
            path="/course"
            element={
              <Course
                unlockedLessons={unlockedLessons}
                completedLessons={completedLessons}
              />
            }
          />

          <Route
            path="/lesson/:id"
            element={
              <Lesson
                completedLessons={completedLessons}
                setCompletedLessons={setCompletedLessons}
                setUnlockedLessons={setUnlockedLessons}
              />
            }
          />

          <Route path="/labs" element={<Labs />} />

          <Route path="/commands" element={<Commands />} />

          <Route
  path="/achievements"
  element={<Achievements />}
/>
 </Routes>
      </main>
    </div>
  );
}

export default App;
