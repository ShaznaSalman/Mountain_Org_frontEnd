import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<
    {
      id: number;
      name: string;
      quantity: number;
      price: number;
      category: string;
    }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <h1>
        <center>Our Products</center>
      </h1>

      <div className="product-categories">
        {/* Fruit Salads */}
        <section>
          <h2>Fruit Salads</h2>
          <div className="product-list">
            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="product-list">
                {products
                .filter(product => product.category === 'fruit salad')
                .map((product) => (
                  <div key={product.id} className="product-item">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Rs {product.price.toFixed(2)}</p>
                    <button onClick={() => onAddToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
           
          </div>
        </section>

        {/* Fruit Juices */}
        <section>
          <h2>Fruit Juices</h2>
          <div className="product-list">
            {products
            .filter(product => product.category === 'fruit juice')
            .map((product) => (
              <div key={product.id} className="product-item">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Rs {product.price.toFixed(2)}</p>
                <button onClick={() => onAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Ice Creams */}
        <section>
          <h2>Ice Creams</h2>
          <div className="product-list">
            {products
            .filter(product => product.category === 'ice cream')
            .map((product) => (
              <div key={product.id} className="product-item">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Rs {product.price.toFixed(2)}</p>
                <button onClick={() => onAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}{" "}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductCatalog;
