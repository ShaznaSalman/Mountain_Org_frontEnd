import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  ToastContainer,
  toast,
  ToastOptions,
  ToastPosition,
} from "react-toastify";
import "./dashboard.css";
import ProductCatalog from "../Product/ProductCatalog";
import ShoppingCart from "../Shopping/ShoppingCart";
import CustomProduct from "../CustomProduct/CustomProduct";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  const [cart, setCart] = useState<
    {
      id: number;
      name: string;
      quantity: number;
      price: number;
      category: string;
    }[]
  >([]);

  const handleClearCart = () => {
    setCart([]);
  };

  const [customItems, setCustomItems] = useState<
    { name: string; quantity: number; price: number }[]
  >([]);

  const [activeSection, setActiveSection] = useState<
    "products" | "cart" | "custom" | "orders"
  >("products");

  const handleSectionChange = (
    section: "products" | "cart" | "custom" | "orders"
  ) => {
    setActiveSection(section);
  };

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const notify = (message: string) => {
    toast.success(message, {
      position: "top-right" as ToastPosition,
      autoClose: 3000,
    });
  };

  // add to cart from custom Product
  const addToCart = (item: {
    name: string;
    description: string;
    quantity: number;
    totalPrice: number;
    ingredients: string;
    category: string;
  }) => {
    setCart([
      ...cart,
      {
        ...item,
        price: item.totalPrice,
        id: cart.length + 1,
        category: item.category,
      },
    ]);
    notify(`${item.name} has been added to the cart!`);
  };

  //add to cart from productCatalog
  const handleAddToCart = (product: {
    id: number;
    name: string;
    price: number;
    category: string;
  }) => {

    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          category: product.category,
        },
      ]);
    }
    notify(`${product.name} has been added to the cart!`);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    navigate("/Checkout", { state: { cart } });
  };

  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      <header className="navbar">
        <nav className="navbar-menu">
          <img
            src="src/assets/logo-no-background.png"
            alt="Juices INC"
            className="navbar-logo"
          />

          <h3 className="navbar-heading">Juices_Inc</h3>

          <ul className="navbar-links">
            <li>
              <button onClick={() => handleSectionChange("products")}>
                Products
              </button>
            </li>
            <li>
              <button onClick={() => handleSectionChange("custom")}>
                Custom
              </button>
            </li>
            <li>
              <button
                onClick={openCartModal}
                className="cart-button"
                data-count={cart.reduce((acc, item) => acc + item.quantity, 0)}
              >
                Cart
              </button>{" "}
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        {activeSection === "products" && (
          <section className="content-section">
            <ProductCatalog onAddToCart={handleAddToCart} />
          </section>
        )}
        {activeSection === "custom" && (
          <section className="content-section">
            <CustomProduct addToCart={addToCart} />
          </section>
        )}

        {isCartModalOpen && (
          <div className="modal-overlay" onClick={closeCartModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Shopping Cart</h2>
              <button className="closeButton" onClick={closeCartModal}>Close</button>
              <ShoppingCart
                cart={cart}
                onCheckout={handleCheckout}
                onQuantityChange={handleQuantityChange}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
              />
            </div>
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
