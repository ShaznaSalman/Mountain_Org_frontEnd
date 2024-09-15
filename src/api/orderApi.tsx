import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/api", // Base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const postCreateOrder = async (orderData: any) => {
  try {
    const response = await apiClient.post("/orders",orderData);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart for checkout:", error);
    throw error;
  }
};

export const getOrderById = async (id: any) => {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order for confirmation:", error);
    throw error;
  }
};
