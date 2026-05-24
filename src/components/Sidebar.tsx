"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },

    {
      name: "Inventory",
      href: "/products",
    },

    {
      name: "Reservations",
      href: "/reservations",
    },

    {
      name: "Create Reservation",
      href: "/create-reservation",
    },

    {
      name: "Add Product",
      href: "/add-product",
    },

    {
      name: "Update Inventory",
      href: "/update-inventory",
    },
  ];

  return (
    <div className="sidebar">
      <h1 className="logo">
        Inventory
      </h1>

      <p className="subtitle">
        Management System
      </p>

      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname ===
              link.href
                ? "active"
                : ""
            }
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="system-status">
        <p>System Status</p>

        <span>Online</span>
      </div>
    </div>
  );
}