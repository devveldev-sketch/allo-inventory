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

export default function ProductsPage() {

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  // Fetch products
  const fetchProducts =
    async () => {

      const res =
        await fetch(
          "/api/products"
        );

      const data =
        await res.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    };

  useEffect(() => {

    fetchProducts();

    const interval =
      setInterval(() => {

        fetchProducts();

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="main-content">

      <h1 className="page-title">
        Inventory
      </h1>

      {products.length ===
      0 ? (

        <p>
          No products found
        </p>

      ) : (

        products.map(
          (product) => (

            <div
              key={product.id}
              className="product-card"
            >

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
                        Available Stock:{" "}
                        {
                          inventory.stock
                        }
                      </p>

                      <p>
                        Reserved Stock:{" "}
                        {
                          inventory.reservedStock
                        }
                      </p>

                      {/* STATUS */}

                      <p
                        className={

                          inventory.stock === 0

                            ? "out-stock"

                            : inventory.stock <= 5

                            ? "low-stock"

                            : "in-stock"
                        }
                      >

                        {
                          inventory.stock === 0

                            ? "Out Of Stock"

                            : inventory.stock <= 5

                            ? "Low Stock Alert"

                            : "In Stock"
                        }

                      </p>

                    </div>
                  )
                )}

              </div>

            </div>
          )
        )
      )}

    </div>
  );
}