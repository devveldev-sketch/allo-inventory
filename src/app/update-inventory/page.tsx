"use client";

import { useEffect, useState } from "react";

interface Inventory {
  id: string;
  stock: number;
  reservedStock: number;

  warehouse: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventories: Inventory[];
}

export default function UpdateInventoryPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const fetchProducts =
    async () => {
      try {
        const res = await fetch(
          "/api/products"
        );

        const data =
          await res.json();

        setProducts(
          data.products || data
        );
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
      }
    };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock =
    async (
      inventoryId: string,
      stock: number
    ) => {
      try {
        await fetch(
          "/api/inventory/update",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              inventoryId,
              stock,
            }),
          }
        );

        fetchProducts();
      } catch (error) {
        console.error(
          "Update failed:",
          error
        );
      }
    };

  const deleteProduct =
    async (
      productId: string
    ) => {
      const ok = confirm(
        "Delete this product?"
      );

      if (!ok) return;

      try {
        await fetch(
          "/api/products/delete",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              productId,
            }),
          }
        );

        fetchProducts();
      } catch (error) {
        console.error(
          "Delete failed:",
          error
        );
      }
    };

  return (
    <div className="main-content">
      <h1 className="page-title">
        Update Inventory
      </h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="product-card"
          >
            <div className="update-header">
              <div>
                <h2>
                  {product.name}
                </h2>

                <p>
                  {
                    product.description
                  }
                </p>

                <h3>
                  ₹{product.price}
                </h3>
              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteProduct(
                    product.id
                  )
                }
              >
                Delete Product
              </button>
            </div>

            <div className="inventory-grid">
              {product.inventories.map(
                (inventory) => (
                  <div
                    key={inventory.id}
                    className="inventory-box"
                  >
                    <h3>
                      {
                        inventory
                          .warehouse
                          .name
                      }
                    </h3>

                    <p>
                      Available Stock
                    </p>

                    <input
                      type="number"
                      defaultValue={
                        inventory.stock
                      }
                      className="stock-input"
                      onBlur={(e) =>
                        updateStock(
                          inventory.id,
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                    />

                    <p>
                      Reserved
                      Stock:{" "}
                      {
                        inventory
                          .reservedStock
                      }
                    </p>

                    <p
                      className={
                        inventory.stock <=
                        5
                          ? "low-stock"
                          : "in-stock"
                      }
                    >
                      {inventory.stock <=
                      5
                        ? "Low Stock Alert"
                        : "In Stock"}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}