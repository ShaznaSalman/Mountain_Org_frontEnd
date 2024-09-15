import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../api/orderApi";
import "./confirmOrder.css";

interface OrderItem {
  productName: string;
  category?: string;
  description?: string;
  ingredients?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  items: OrderItem[];
  totalPrice: number;
}

const ConfirmOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const id = localStorage.getItem("orderId");

      if (id) {
        try {
          const response = await getOrderById(id);
          setOrder(response);
        } catch (error) {
          console.error('Error fetching order details', error);
          setError('Failed to fetch order details. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Order ID is missing.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

    if (error) {
      return <p style={{ color: "red" }}>{error}</p>;
    }

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-message">
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been placed successfully.</p>
        {order ? (
          <div className="order-details">
            <hr />
            <br />
            <h2>Order Details</h2>

            <p>
              <strong>Customer Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Address:</strong> {order.customerAddress}
            </p>
            <p>
              <strong>Contact:</strong> {order.customerContact}
            </p>

            <h2>Items Ordered</h2>
            <table className="order-items-table">
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
                {order.items.map((item: OrderItem, index: number) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
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
              <strong>Total: Rs {order.totalPrice.toFixed(2)}</strong>
            </p>
          </div>
        ) : (
          <p>No order details available.</p>
        )}
        <hr />
        <br />
        <button className="home-button" onClick={() => navigate("/dashboard")}>
          Back to Home
        </button>
      </div>
    </div>

  );
};

export default ConfirmOrder;
