"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Reservation {
  id: string;
  quantity: number;
  status: string;

  product: {
    name: string;
  };

  warehouse: {
    name: string;
  };
}

export default function DashboardPage() {

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    reservations,
    setReservations,
  ] = useState<Reservation[]>([]);

  useEffect(() => {

    fetchProducts();
    fetchReservations();

  }, []);

  // Fetch Products
  const fetchProducts =
    async () => {

      try {

        const res =
          await fetch(
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

  // Fetch Reservations
  const fetchReservations =
    async () => {

      try {

        const res =
          await fetch(
            "/api/reservations"
          );

        const data =
          await res.json();

        setReservations(
          data.reservations ||
            data
        );

      } catch (error) {

        console.error(
          "Error fetching reservations:",
          error
        );
      }
    };

  // Pending Count
  const pendingReservations =
    reservations.filter(
      (r) =>
        r.status ===
        "PENDING"
    ).length;

  return (

    <div className="main-content">

      <h1 className="page-title">
        Dashboard Overview
      </h1>

      {/* Stats */}

      <div className="stats-grid">

        <div className="stats-card">

          <h3>
            Total Products
          </h3>

          <h2>
            {products.length}
          </h2>

        </div>

        <div className="stats-card">

          <h3>
            Total Reservations
          </h3>

          <h2>
            {reservations.length}
          </h2>

        </div>

        <div className="stats-card">

          <h3>
            Pending Reservations
          </h3>

          <h2>
            {
              pendingReservations
            }
          </h2>

        </div>

      </div>

      {/* Dashboard Grid */}

      <div className="dashboard-grid">

        {/* Products */}

        <div className="dashboard-box">

          <h2>
            Recent Products
          </h2>

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
                  className="item-card"
                >

                  <h3>
                    {
                      product.name
                    }
                  </h3>

                  <p>
                    {
                      product.description
                    }
                  </p>

                  <h4>
                    ₹
                    {
                      product.price
                    }
                  </h4>

                </div>
              )
            )
          )}

        </div>

        {/* Reservations */}

        <div className="dashboard-box">

          <h2>
            Recent Reservations
          </h2>

          {reservations.length ===
          0 ? (

            <p>
              No reservations found
            </p>

          ) : (

            reservations.map(
              (
                reservation
              ) => (

                <div
                  key={
                    reservation.id
                  }
                  className="item-card"
                >

                  <h3>
                    {
                      reservation
                        .product.name
                    }
                  </h3>

                  <p>
                    Warehouse:{" "}
                    {
                      reservation
                        .warehouse.name
                    }
                  </p>

                  <p>
                    Quantity:{" "}
                    {
                      reservation.quantity
                    }
                  </p>

                  {/* STATUS */}

                  <p>
                    Status:

                    <span
                      className={
                        reservation.status ===
                        "CONFIRMED"

                          ? "confirmed"

                          : reservation.status ===
                            "PENDING"

                          ? "pending"

                          : reservation.status ===
                            "EXPIRED"

                          ? "expired"

                          : reservation.status ===
                            "CANCELLED"

                          ? "cancelled"

                          : ""
                      }
                    >
                      {" "}
                      {
                        reservation.status
                      }
                    </span>

                  </p>

                </div>
              )
            )
          )}

        </div>

      </div>

    </div>
  );
}