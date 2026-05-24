"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  quantity: number;
  status: string;
  expiresAt: string;

  product: {
    name: string;
  };

  warehouse: {
    name: string;
  };
}

export default function ReservationsPage() {

  const [
    reservations,
    setReservations,
  ] = useState<Reservation[]>([]);

  const [
    notification,
    setNotification,
  ] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Toast Notification
  const showNotification = (
    message: string,
    type: "success" | "error"
  ) => {

    setNotification({
      message,
      type,
    });

    setTimeout(() => {

      setNotification(null);

    }, 3000);
  };

  // Countdown
  const getRemainingTime = (
    expiresAt: string
  ) => {

    const expiry =
      new Date(expiresAt).getTime();

    const now =
      new Date().getTime();

    const diff =
      Math.floor(
        (expiry - now) / 1000
      );

    return diff > 0
      ? diff
      : 0;
  };

  // Fetch Reservations
  const fetchReservations =
    async () => {

      // Run expiry cleanup
      await fetch("/api/cron");

      // Fetch reservations
      const res =
        await fetch(
          "/api/reservations"
        );

      const data =
        await res.json();

      setReservations(
        Array.isArray(data)
          ? data
          : []
      );
    };

  useEffect(() => {

    fetchReservations();

    const interval =
      setInterval(() => {

        fetchReservations();

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  // Confirm Reservation
  const confirmReservation =
    async (id: string) => {

      const res =
        await fetch(
          `/api/reservations/${id}/confirm`,
          {
            method: "POST",
          }
        );

      if (res.ok) {

        showNotification(
          "Reservation confirmed successfully",
          "success"
        );

      } else {

        showNotification(
          "Failed to confirm reservation",
          "error"
        );
      }

      fetchReservations();
    };

  // Cancel Reservation
  const cancelReservation =
    async (id: string) => {

      const res =
        await fetch(
          `/api/reservations/${id}/release`,
          {
            method: "POST",
          }
        );

      if (res.ok) {

        showNotification(
          "Reservation cancelled successfully",
          "success"
        );

      } else {

        showNotification(
          "Failed to cancel reservation",
          "error"
        );
      }

      fetchReservations();
    };

  return (
    <>

      {/* Toast Notification */}
      {notification && (

        <div
          className={`toast ${
            notification.type ===
            "success"

              ? "toast-success"

              : "toast-error"
          }`}
        >

          <span>
            {notification.type ===
            "success"
              ? "✔"
              : "✖"}
          </span>

          {notification.message}

        </div>
      )}

      <div className="main-content">

        <h1 className="page-title">
          Reservations Dashboard
        </h1>

        {reservations.length ===
        0 ? (

          <p>
            No reservations found
          </p>

        ) : (

          reservations.map(
            (reservation) => (

              <div
                key={reservation.id}
                className="reservation-card"
              >

                <h2>
                  {
                    reservation.product
                      .name
                  }
                </h2>

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

                {/* Countdown */}
                {reservation.status ===
                  "PENDING" && (

                  <p>
                    Expires In:{" "}

                    <span
                      className="pending"
                    >
                      {
                        getRemainingTime(
                          reservation.expiresAt
                        )
                      }{" "}
                      sec
                    </span>
                  </p>
                )}

                {/* Status */}
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

                {/* Buttons */}
                {reservation.status ===
                  "PENDING" && (

                  <div className="button-group">

                    <button
                      className="confirm-btn"
                      onClick={() =>
                        confirmReservation(
                          reservation.id
                        )
                      }
                    >
                      Confirm Purchase
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        cancelReservation(
                          reservation.id
                        )
                      }
                    >
                      Cancel Reservation
                    </button>

                  </div>
                )}

              </div>
            )
          )
        )}

      </div>
    </>
  );
}