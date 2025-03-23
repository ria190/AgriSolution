import axios from "axios";
import { API_BASE_URL } from "./apiConstants";

const getPestAndDiseaseData = async (formData, farmData) => {
  try {
    // Append farmData to formData if needed
    if (farmData) {
      formData.append("farmData", JSON.stringify(farmData)); // Convert object to string
    }

    const response = await axios.post(
      `${API_BASE_URL}/pestanddiseasedetection`,
      formData
    );

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response from API");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching warning:", error);
    return { error: "Failed to get warning." };
  }
};

export { getPestAndDiseaseData };
