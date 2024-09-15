import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./checkout.css";
import Order from "../Order/Order";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
  description?: string;
  ingredients?: string;
}

interface CheckoutProps {
  cart: CartItem[];
}

const Checkout: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();


  const [isCartModalOpen, setIsCartModalOpen] = useState(false);


  const initialCart = (location.state?.cart as CartItem[]) || [];
  const initialCustomerInfo = (location.state?.customerInfo as {
    name: string;
    address: string;
    contact: string;
  }) || { name: "", address: "", contact: "" };

  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [customerInfo, setCustomerInfo] = useState({
    name: initialCustomerInfo.name,
    address: initialCustomerInfo.address,
    contact: initialCustomerInfo.contact,
  });

 

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

   
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const validateForm = () => {
    const { name, address, contact } = customerInfo;
    if (!name || !address || !contact) {
      setError("All fields are required.");
      return false;
    }
    if (!/^\d+$/.test(contact)) {
      setError("Contact number must be numeric.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    setIsCartModalOpen(true);


    setLoading(false);

    
  };

  
  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="checkout container">
      <div>
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>

      <div className="checkout-container">
        <h1><center>Checkout</center></h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>
          Name:
          <input
          required
            type="text"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, name: e.target.value })
            }
          />
        </label>
        <label>
          Address:
          <input
          required
            type="text"
            value={customerInfo.address}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, address: e.target.value })
            }
          />
        </label>
        <label>
          Contact:
          <input
          required
            type="text"
            value={customerInfo.contact}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, contact: e.target.value })
            }
          />
        </label>

        <h2>Cart Summary</h2>
        <table className="cart-summary-table">
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
          <b>
            Total: Rs 
            {cart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </b>
        </p>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>

      {isCartModalOpen && (
          <div className="modal-overlay" onClick={closeCartModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="closeButton" onClick={closeCartModal}>Close</button>
              <Order cart={cart} customerInfo={customerInfo}  />
            </div>
          </div>
        )}

    </div>
  );
};

export default Checkout;
