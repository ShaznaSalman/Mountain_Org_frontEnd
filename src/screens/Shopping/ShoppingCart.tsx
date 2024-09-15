import React, { useState } from "react";
import {
  ToastContainer,
  toast,
  ToastOptions,
  ToastPosition,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  items?: Record<string, number>;
  totalPrice?: number;
  ingredients?: string;
  category: string;
}

interface ShoppingCartProps {
  cart: CartItem[];
  onCheckout: (cart: CartItem[]) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemoveFromCart: (id: number) => void;
  onClearCart: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cart,
  onCheckout,
  onQuantityChange,
  onRemoveFromCart,
  onClearCart,
}) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navigate = useNavigate();

  const handleCheckout = () => {
    // Trigger the checkout process
    onCheckout(cart);
    onClearCart();

    toast.success("Checkout successful! Thank you for your order.", {
      position: "top-right" as ToastPosition,
      autoClose: 3000,
    });
  };

  return (
    <div className="shopping-cart">
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((cartItem) => (
            <div key={cartItem.id} className="cart-item">
              <h3>{cartItem.name}</h3>
              <p>Category: {cartItem.category}</p>
              {cartItem.description && (
                <p>Description: {cartItem.description}</p>
              )}
              {cartItem.ingredients && (
                <p>Ingredients:{cartItem.ingredients}</p>
              )}
              <p>Quantity: {cartItem.quantity}</p>
              <input
                type="number"
                className="cart-item-quantity"
                value={cartItem.quantity}
                onChange={(e) =>
                  onQuantityChange(cartItem.id, parseInt(e.target.value))
                }
                min="1"
              />
              <button
                className="cart-item-remove"
                onClick={() => onRemoveFromCart(cartItem.id)}
              >
                Remove
              </button>
              <p>Price: Rs{(cartItem.price * cartItem.quantity).toFixed(2)}</p>
            </div>
          ))}

          <div className="cart-footer">
            <p className="totalText">
              <b>Total Price: Rs {totalPrice.toFixed(2)}</b>
            </p>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
