import { useNavigate } from "react-router-dom";

const FarmPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Farm Dashboard</h1>
      
      <button
        onClick={() => navigate("/farm-form")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Farm Details
      </button>
    </div>
  );
};

export default FarmPage;
