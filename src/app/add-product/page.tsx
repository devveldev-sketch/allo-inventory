"use client";

import { useState } from "react";

export default function AddProductPage() {
  const [name, setName] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [price, setPrice] =
    useState("");

  const addProduct =
    async () => {
      const response =
        await fetch(
          "/api/products",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              description,
              price:
                Number(price),
            }),
          }
        );

      if (response.ok) {
        alert(
          "Product added successfully"
        );

        setName("");
        setDescription("");
        setPrice("");
      } else {
        alert(
          "Failed to add product"
        );
      }
    };

  return (
    <div className="main-content">
      <h1 className="page-title">
        Add Product
      </h1>

      <div className="form-card">
        <label>
          Product Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <label>
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <label>Price</label>

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
        />

        <button
          onClick={addProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
}