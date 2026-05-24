"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
}

export default function CreateReservationPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [warehouses, setWarehouses] =
    useState<Warehouse[]>([]);

  const [productId, setProductId] =
    useState("");

  const [warehouseId, setWarehouseId] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsRes =
        await fetch("/api/products");

      const warehousesRes =
        await fetch("/api/warehouses");

      const productsData =
        await productsRes.json();

      const warehousesData =
        await warehousesRes.json();

      if (
        Array.isArray(productsData)
      ) {
        setProducts(productsData);
      } else {
        console.error(
          "Products API error:",
          productsData
        );

        setProducts([]);
      }

      if (
        Array.isArray(
          warehousesData
        )
      ) {
        setWarehouses(
          warehousesData
        );
      } else {
        console.error(
          "Warehouses API error:",
          warehousesData
        );

        setWarehouses([]);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load data"
      );

      setProducts([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const createReservation =
    async () => {
      try {
        const response =
          await fetch(
            "/api/reservations",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                productId,
                warehouseId,
                quantity,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          toast.error(
            data.message ||
              "Reservation failed"
          );

          return;
        }

        toast.success(
          "Reservation created successfully"
        );

        setProductId("");
        setWarehouseId("");
        setQuantity(1);
      } catch (error) {
        console.error(error);

        toast.error(
          "Something went wrong"
        );
      }
    };

  return (
    <div className="main-content">
      <h1 className="page-title">
        Create Reservation
      </h1>

      <div className="form-card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <label>
              Product
            </label>

            <select
              value={productId}
              onChange={(e) =>
                setProductId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Product
              </option>

              {products.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name}
                </option>
              ))}
            </select>

            <label>
              Warehouse
            </label>

            <select
              value={warehouseId}
              onChange={(e) =>
                setWarehouseId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Warehouse
              </option>

              {warehouses.map(
                (w) => (
                  <option
                    key={w.id}
                    value={w.id}
                  >
                    {w.name}
                  </option>
                )
              )}
            </select>

            <label>
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(
                    e.target.value
                  )
                )
              }
            />

            <button
              onClick={
                createReservation
              }
            >
              Reserve Product
            </button>
          </>
        )}
      </div>
    </div>
  );
}