import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import CreatePage from "./pages/create/index";
import HomePage from "./pages/home/index";
import FarmPage from "./pages/farm/index";
import FarmForm from "./pages/farm/FarmForm"; 
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import LoginWarning from "./pages/LoginWarning";
import "./App.css";

function App() {
  return (
    <div className="bg-gray-300 dark:bg-gray-700 min-h-screen transition-colors duration-300">
      <Router>
        <Navbar />
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
            path="/farm"
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

          <Route
            path="/farm-form"
            element={
              <PrivateRoute>
                <FarmForm />
              </PrivateRoute>
            }
          />

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
