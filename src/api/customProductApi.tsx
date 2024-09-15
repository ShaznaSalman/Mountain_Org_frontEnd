import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/api", // Base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CustomProducts {
  id: number;
  name: string;
  category: string;
  description: string;
  ingredients: string;
  totalPrice: number;
  quantity: number;
}

export const postCustomProducts = async (product: CustomProducts) => {
  try {
    const response = await apiClient.post("/customProducts", product);
    return response.data;
  } catch (error) {
    console.error("Error submitting custom product:", error);
    throw error;
  }
};

export const getRawMaterials = async () => {
  try {
    const response = await apiClient.get("/raw-materials");
    return response.data;
  } catch (error) {
    console.error("Error fetching raw materials:", error);
    throw error;
  }
};