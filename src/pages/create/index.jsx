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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, soilCard: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("userId", user.id);
    formDataToSend.append("landArea", formData.landArea);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("soilCard", formData.soilCard);

    try {
      const response = await fetch("http://localhost:5000/api/land", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Land details added successfully!");
        navigate("/");
      } else {
        alert("Failed to add land details.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold">Add New Land Details</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 w-full max-w-md bg-white p-6 rounded shadow-md"
      >
        <label className="block mb-2">Land Area (in acres):</label>
        <input
          type="number"
          name="landArea"
          step="0.01"
          value={formData.landArea}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <label className="block mt-4 mb-2">Location (City/Village):</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <label className="block mt-4 mb-2">State:</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <label className="block mt-4 mb-2">Upload Soil Card:</label>
        <input
          type="file"
          name="soilCard"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Submit
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
