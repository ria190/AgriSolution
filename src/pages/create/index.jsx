import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getSoilCardApiData } from "../../api/getSoilCardApiData";
import { createFarmApi } from "../../api/createFarmApi";
import { useUser } from "@clerk/clerk-react";

const CreatePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const clerkUserId = user?.id || "";

  const [image, setImage] = useState(null);
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [fertilizerNeeded, setFertilizerNeeded] = useState([]);

  const [formData, setFormData] = useState({
    soilHealthCard: {
      SoilHealthCardNo: "",
      ValidityFrom: "",
      ValidityTo: "",
    },
    farmersDetails: {
      Name: "",
      Address: "",
      Village: "",
      SubDistrict: "",
      District: "",
      PIN: "",
    },
    soilSampleDetails: {
      SoilSampleNumber: "",
      SurveyNo: "",
      FarmSizeInHector: "",
      GeoPositionLatitude: "",
      GeoPositionLongitude: "",
    },
    soilTestResults: {
      pH: "",
      EC: "",
      OrganicCarbonOC: "",
      AvailableNitrogenN: "",
      AvailablePhosphorusP: "",
      AvailablePotassiumK: "",
      AvailableSulphurS: "",
      AvailableZincZn: "",
      AvailableBoronB: "",
      AvailableIronFe: "",
      AvailableManganeseMn: "",
      AvailableCopperCu: "",
    },
    currentCrop: "",
    fertilizerNeeded: [],
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await processImage(file);
    }
  };

  const processImage = async (file) => {
    const imageFormData = new FormData();
    imageFormData.append("soilcard", file);
    try {
      const data = await getSoilCardApiData(imageFormData);
      setFormData((prev) => ({ ...prev, ...data, currentCrop: "" }));
      setCropRecommendations(data.cropRecommendations || []);
      setFertilizerNeeded([]);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split(".");
    let updatedData = { ...formData };
    let obj = updatedData;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setFormData(updatedData);

    if (name === "currentCrop") {
      const currentCrop = cropRecommendations.find(
        (crop) => crop.cropName === value
      );
      setFertilizerNeeded(currentCrop ? currentCrop.fertilizerNeeded : []);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalData = {
      ...formData,
      fertilizerNeeded,
    };

    try {
      await createFarmApi(clerkUserId, finalData);
      console.log("Farm Created Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Back to Home
          </button>

          {/* Create Farm Title */}
          <div className="flex-1 text-center text-lg font-semibold">Create Farm</div>

          {/* Delete Soil Card Image Button */}
          {image && (
            <button
              onClick={handleDeleteImage}
              className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition mx-2"
            >
              Delete Soil Card Image
            </button>
          )}

          {/* Upload Soil Card Image Button */}
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 font-bold rounded-lg shadow-md hover:bg-blue-700 transition">
            Upload Soil Card Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Display Uploaded Image */}
        {image && (
          <div className="flex justify-center">
            <img src={image} alt="Uploaded" className="max-w-xs rounded-lg shadow-lg" />
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          {/* Soil Health Card */}
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Soil Health Card</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(formData.soilHealthCard).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field === "ValidityFrom" || field === "ValidityTo" ? "date" : "text"}
                    name={`soilHealthCard.${field}`}
                    value={formData.soilHealthCard[field] || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:bg-green-100"
                    required={field === "ValidityFrom" || field === "ValidityTo"}
                    min={field === "ValidityTo" ? formData.soilHealthCard.ValidityFrom : ""}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Farmers Details */}
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Farmers Details</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(formData.farmersDetails).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={`farmersDetails.${field}`}
                    value={formData.farmersDetails[field] || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:bg-green-100"
                    required={["Address", "Village", "District", "PIN"].includes(field)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Soil Sample Details */}
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Soil Sample Details</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(formData.soilSampleDetails).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={`soilSampleDetails.${field}`}
                    value={formData.soilSampleDetails[field] || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:bg-green-100"
                    required={field === "FarmSizeInHector"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Soil Test Results */}
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Soil Test Results</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(formData.soilTestResults).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={`soilTestResults.${field}`}
                    value={formData.soilTestResults[field] || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:bg-green-100"
                    required={["pH", "EC", "OrganicCarbonOC", "AvailableNitrogenN", "AvailablePhosphorusP", "AvailablePotassiumK"].includes(field)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Crop Recommendations */}
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Crop Recommendations</h2>
            <label className="block text-sm font-medium mb-1">Select a Crop</label>
            <select
              name="currentCrop"
              value={formData.currentCrop}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-green-200 dark:bg-green-700 focus:border-green-400 focus:ring-1 focus:ring-green-400"
              required
            >
              <option value="">Select a Crop</option>
              {cropRecommendations.map((crop, index) => (
                <option key={index} value={crop.cropName}>
                  {crop.cropName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="col-span-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
