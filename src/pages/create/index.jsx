import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    landArea: "",
    location: "",
    state: "",
    soilCard: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, soilCard: file });

    // Preview Image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedLandArea = parseFloat(formData.landArea);
    if (isNaN(parsedLandArea) || parsedLandArea <= 0) {
      setError("Please enter a valid land area.");
      setLoading(false);
      return;
    }

    if (!formData.location.trim() || !formData.state.trim()) {
      setError("Location and State cannot be empty.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userId", user.id);
    formDataToSend.append("landArea", parsedLandArea);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("state", formData.state);

    if (formData.soilCard) {
      formDataToSend.append("soilCard", formData.soilCard);
    }

    try {
      const response = await fetch("http://localhost:5000/api/land", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Land details added successfully!");
        navigate("/");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to add land details.");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Add New Land Details</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Land Area (in acres):</label>
          <input
            type="number"
            name="landArea"
            step="0.01"
            value={formData.landArea}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Location (City/Village):</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Upload Soil Card:</label>
          <input
            type="file"
            name="soilCard"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Soil Card Preview"
              className="mt-2 w-full h-32 object-cover rounded shadow-md"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Back to Home
      </button>
    </div>
  );
};

export default CreatePage;
