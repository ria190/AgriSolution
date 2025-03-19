import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const FarmForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    soilHealthCard: {
      soilHealthCardNo: "",
      nameOfFarmer: "",
      validityFrom: "",
      validityTo: "",
    },
    farmersDetails: {
      name: "",
      address: "",
      village: "",
      subDistrict: "",
      district: "",
      PIN: "",
    },
    soilSampleDetails: {
      soilSampleNumber: "",
      sampleCollectedOn: "",
      surveyNo: "",
      khasraNo_DagNo: "",
      farmSize: "",
      geoPositionLatitude: "",
      geoPositionLongitude: "",
      irrigatedRainfed: "",
    },
    soilTestResults: {
      pH: "",
      EC: "",
      organicCarbon_OC: "",
      availableNitrogen_N: "",
      availablePhosphorus_P: "",
      availablePotassium_K: "",
      availableSulphur_S: "",
      availableZinc_Zn: "",
      availableBoron_B: "",
      availableIron_Fe: "",
      availableManganese_Mn: "",
      availableCopper_Cu: "",
    },
    secondaryMicroNutrientsRecommendations: {
      sulphur_S: "",
      zinc_Zn: "",
      boron_B: "",
      iron_Fe: "",
      manganese_Mn: "",
      copper_Cu: "",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const farmData = {
      ownerId: user?.id,
      ...formData,
    };

    try {
      const response = await fetch("http://localhost:5000/api/farms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(farmData),
      });

      if (response.ok) {
        alert("Farm details saved successfully!");
        navigate("/");
      } else {
        const errorMessage = await response.text();
        alert("Error saving farm details: " + errorMessage);
        console.error("Error Response:", response.statusText);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error! Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-6">Add Farm Details</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
        {Object.entries(formData).map(([section, fields]) => (
          <div key={section} className="mb-4">
            <h2 className="text-lg font-semibold capitalize">{section.replace(/([A-Z])/g, ' $1')}</h2>
            {Object.keys(fields).map((field) => (
              <input
                key={field}
                type={typeof fields[field] === "number" ? "number" : "text"}
                step="0.01"
                placeholder={field.replace(/_/g, " ")}
                value={fields[field]}
                onChange={(e) => handleChange(section, field, e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />
            ))}
          </div>
        ))}
        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Save</button>
      </form>
    </div>
  );
};

export default FarmForm;
