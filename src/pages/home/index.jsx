import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
    

      <div className="w-full flex justify-center mt-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => navigate("/create")}
        >
          New
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName} 👋</h1>
        <p className="text-lg mt-2">This is a private home page.</p>

        <SignOutButton>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </SignOutButton>
      </div>
    </div>
  );
};

export default HomePage;
