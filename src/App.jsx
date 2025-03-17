import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/home/index";
import FarmPage from "./pages/farm/index";
import CreatePage from "./pages/create/index"; // Import the new Create Page
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import LoginWarning from "./pages/LoginWarning";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for authentication check
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-300 dark:bg-gray-700 min-h-screen transition-colors duration-300">
      <Router>
        <Navbar />
        {loading ? (
          <Skeleton />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SignedOut>
                    <LoginWarning />
                  </SignedOut>
                  <SignedIn>
                    <HomePage />
                  </SignedIn>
                </>
              }
            />

            <Route
              path="/:id"
              element={
                <PrivateRoute>
                  <FarmPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreatePage />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

const Skeleton = () => {
  return (
    <div className="flex justify-center items-center min-h-screen animate-pulse">
      <div className="w-full h-full max-w-md p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-lg">
        <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-md mb-6"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
      </div>
    </div>
  );
};

export default App;
