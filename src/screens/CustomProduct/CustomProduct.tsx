import React, { useEffect, useState } from "react";
import {
  getRawMaterials,
  postCustomProducts,
  CustomProducts,
} from "../../api/customProductApi";

interface RawMaterial {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface CustomProductProps {
  addToCart: (product: any) => void;
}

const CustomProduct: React.FC<CustomProductProps> = ({ addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Fruit Salad");
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {}
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [productName, setProductName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const materials = await getRawMaterials();
        setRawMaterials(materials);
      } catch (error) {
        console.error("Error fetching raw materials:", error);
      }
    };

    fetchRawMaterials();
  }, []);

  useEffect(() => {
    let total = 0;
    for (const item in selectedItems) {
      const rawMaterial = rawMaterials.find((mat) => mat.name === item);
      if (rawMaterial) {
        total += rawMaterial.price * selectedItems[item];
      }
    }
    setTotalPrice(total);
  }, [selectedItems, rawMaterials]);

  const handleQuantityChange = (item: string, quantity: number) => {
    setSelectedItems((prev) => ({ ...prev, [item]: quantity }));
  };

  const handleAdd = (item: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item]: (prev[item] || 0) + 1,
    }));
  };

  const handleRemove = (item: string) => {
    setSelectedItems((prev) => {
      const newQuantity = Math.max((prev[item] || 0) - 1, 0);
      if (newQuantity === 0) {
        const { [item]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item]: newQuantity };
    });
  };

  async function handleSubmit() {
    let finalTotal = 0;
    for (const item in selectedItems) {
      const rawMaterial = rawMaterials.find((mat) => mat.name === item);
      if (rawMaterial) {
        finalTotal += rawMaterial.price * selectedItems[item];
      }
    }

    const consolidatedIngredients = Object.entries(selectedItems)
      .map(([name, quantity]) => `${name} x${quantity}`)
      .join(", ");

    const newProduct: CustomProducts = {
      id: Date.now(),
      name: productName,
      category: selectedCategory,
      description: description,
      ingredients: consolidatedIngredients,
      totalPrice: finalTotal,
      quantity: quantity,
    };


    try {
      await postCustomProducts(newProduct);

      addToCart(newProduct);

      // Reset form and state
      setSelectedItems({});
      setProductName("");
      setDescription("");
      setQuantity(1);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  }

  const renderTable = (category: string) => (
    <table>
      <thead>
        <tr>
          <th>Ingredients</th>
          <th>Price</th>
          <th> </th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {rawMaterials
          .filter((material) => material.category === category)
          .map((material) => (
            <tr key={material.name}>
              <td>{material.name}</td>
              <td>Rs {material.price.toFixed(2)}</td>

              <td>
                <div
                  className="buttonAdd"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAdd(material.name)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Add
                </div>
                <div
                className="buttonRemove"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRemove(material.name)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Remove
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  const renderOrderSummary = () => {
    const selectedMaterialList = Object.keys(selectedItems)
      .map((item) => {
        const rawMaterial = rawMaterials.find((mat) => mat.name === item);
        return rawMaterial
          ? {
              name: rawMaterial.name,
              quantity: selectedItems[item],
              price: rawMaterial.price * selectedItems[item],
            }
          : null;
      })
      .filter((item) => item !== null);

    return (
      <div>
        <h3>
          <center>Order Summary</center>
        </h3>
        {productName && selectedCategory && (
          <p>
            <b>Product Name:</b> {productName} <br />
            <b>Category:</b> {selectedCategory}
            <br />
            <b>Description:</b> {description}
          </p>
        )}
        {selectedMaterialList.length === 0 ? (
          <p>No items selected.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedMaterialList.map(
                (item) =>
                  item && (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>Rs {item.price.toFixed(2)}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderIceCreamTable = () => {
    const iceCreams = rawMaterials.filter(
      (material) => material.category === "ice cream"
    );
    console.log("Ice Cream Materials:", iceCreams);

    return (
      <table>
        <thead>
          <tr>
            <th>Ice Cream</th>
            <th>Price</th>
            <th> </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {iceCreams.map((material) => (
            <tr key={material.name}>
              <td>{material.name}</td>
              <td>Rs {material.price.toFixed(2)}</td>

              <td>
                <div
                className="buttonAdd"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAdd(material.name)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Add
                </div>
                <div
                className="buttonRemove"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRemove(material.name)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Remove
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>
        <center>Custom Order</center>
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <textarea
          placeholder="Add a Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label>
            <input
              type="radio"
              value="Fruit Salad"
              checked={selectedCategory === "fruit salad"}
              onChange={() => {
                setSelectedCategory("fruit salad");
                setSelectedItems({});
              }}
            />
            Fruit Salad
          </label>
          <label>
            <input
              type="radio"
              value="Juice"
              checked={selectedCategory === "juice"}
              onChange={() => {
                setSelectedCategory("juice");
                setSelectedItems({});
              }}
            />
            Juice
          </label>
        </div>

        <section>
          <h3>{selectedCategory} Ingredients</h3>
          {renderTable(selectedCategory)}
        </section>

        <section>
          <h3>Ice Cream Ingredients</h3>
          {renderIceCreamTable()}
          <p style={{ color: "red" }}>(*Charged per scoop)</p>
        </section>

        {renderOrderSummary()}

        <p>
          <b>Total Price for Custom Products: Rs {totalPrice.toFixed(2)}</b>
        </p>
        <button type="submit">Add Custom Product</button>
      </form>
    </div>
  );
};

export default CustomProduct;
