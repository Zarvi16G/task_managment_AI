import LoginView from "./components/LoginView";

import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import TaskGUI from "./components/TaskGUI";
import SignUpPage from "./components/SignUp";
import UserSettings from "./components/UserSettings";

function App() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="bg-[#000C19] w-full h-full">
      <Routes>
        {/* RUTA DE LOGIN */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/tasks" /> : <LoginView />}
        />
        <Route
          path="/tasks"
          element={!isLoggedIn ? <Navigate to="/login" /> : <TaskGUI />}
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/tasks" : "/login"} />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/tasks" /> : <SignUpPage />}
        />
        <Route
          path="/personal-information"
          element={isLoggedIn ? <UserSettings /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
