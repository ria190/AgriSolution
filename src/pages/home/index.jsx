import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import FarmCard from "./components/FarmCard";
import { getUserFarmsApi } from "../../api/getUserFarmsApi";
import Chatbot from "../../Chatbot";

const HomePage = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [farmsData, setFarmsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await getUserFarmsApi(user.id);
        setUserData(response.user);
        setFarmsData(response.farms);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Image Section */}
        {/* <div className="w-full">
          <img 
            src="/img/agri.jpg" 
            alt="Farm Landscape" 
            className="w-full h-90 object-cover rounded-xl shadow-md"
          />
        </div> */}
        
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="text-lg font-semibold">
            👤 {user?.firstName} {user?.lastName}'s Profile
          </div>
          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            + Create New Farm
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          {loading ? (
            <div>Loading user data...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : userData ? (
            <div>
              <h2 className="text-xl font-bold mb-4">User Information</h2>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
            </div>
          ) : (
            <div>No user data available.</div>
          )}
        </div>

        {/* User's Farms Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Your Farms</h2>
          {loading ? (
            <div>Loading farms...</div>
          ) : farmsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmsData.map((farm) => (
                <FarmCard key={farm._id} farm={farm} />
              ))}
            </div>
          ) : (
            <div>No farms found. Create a new one!</div>
          )}
        </div>
      </div>
      {/* 🗨️ Chatbot Integration */}
      <Chatbot />
    </div>
  );
};

export default HomePage;
