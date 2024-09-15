import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postCreateOrder } from "../../api/orderApi";
import {
  ToastContainer,
  toast,
  ToastOptions,
  ToastPosition,
} from "react-toastify";
import "./order.css";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
  description?: string;
  ingredients?: string;
}

interface CustomerInfo {
  name: string;
  address: string;
  contact: string;
}

interface OrderPreviewProps {
  cart: CartItem[];
  customerInfo: CustomerInfo;
}

const Order: React.FC <OrderPreviewProps> = ({ cart, customerInfo }) => {
  const location = useLocation();

  const navigate = useNavigate();

 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = cart
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const notify = (message: string) => {
    toast.success(message, {
      position: "top-right" as ToastPosition,
      autoClose: 3000,
    });
  };

  const handleConfirmOrder = async () => {
    setLoading(true);

    const orderData = {
      customerName: customerInfo.name,
      customerAddress: customerInfo.address,
      customerContact: customerInfo.contact,
      items: cart.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        description: item.description,
        ingredients: item.ingredients,
      })),
      totalPrice,
    };

    try {
      const orderResponse = await postCreateOrder(orderData);
      notify(`Order placed successfully!`);
      const orderId = orderResponse.id;

      localStorage.setItem('orderId', orderId);
  
      navigate(`/confirmOrder`);

    } catch (error) {
      console.error("Error placing order", error);
      setError("Failed to place the order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="order-preview-container">
      <h1>Order Preview</h1>

      <h2>Customer Information</h2>
      <p>
        <strong>Name:</strong> {customerInfo.name}
      </p>
      <p>
        <strong>Address:</strong> {customerInfo.address}
      </p>
      <p>
        <strong>Contact:</strong> {customerInfo.contact}
      </p>

      <h2>Cart Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Description</th>
            <th>Ingredients</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category || "-"}</td>
              <td>{item.description || "-"}</td>
              <td>{item.ingredients || "-"}</td>
              <td>{item.quantity}</td>
              <td>Rs {item.price.toFixed(2)}</td>
              <td>Rs {(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="total-price">
        <strong>Total: Rs {totalPrice.toFixed(2)}</strong>
      </p>

      <button className="confirm-button" onClick={handleConfirmOrder}>
        Confirm Order
      </button>
      <ToastContainer />
    </div>
  );
};

export default Order;
