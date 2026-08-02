import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";

import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Labs from "./pages/Labs";
import Commands from "./pages/Commands";
import Lesson from "./pages/Lesson";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";

function App() {
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
            element={<Course />}
          />

          <Route
            path="/lesson/:id"
            element={<Lesson />}
          />

          <Route path="/labs" element={<Labs />} />

          <Route path="/commands" element={<Commands />} />

          <Route
  path="/achievements"
  element={<Achievements />}
/>

          <Route path="/profile" element={<Profile />} />
 </Routes>
      </main>
    </div>
  );
}

export default App;
