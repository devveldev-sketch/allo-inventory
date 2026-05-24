import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const products =
      await prisma.product.findMany({
        include: {
          inventories: {
            include: {
              warehouse: true,
            },
          },
        },
      });

    return NextResponse.json(
      products
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      name,
      description,
      price,
    } = body;

    // VALIDATION
    if (
      !name ||
      !description ||
      !price
    ) {
      return NextResponse.json(
        {
          error:
            "All fields required",
        },
        {
          status: 400,
        }
      );
    }

    // CREATE PRODUCT
    const product =
      await prisma.product.create({
        data: {
          name,
          description,
          price:
            Number(price),
        },
      });

    // GET ALL WAREHOUSES
    const warehouses =
      await prisma.warehouse.findMany();

    // CREATE INVENTORY ROWS
    for (const warehouse of warehouses) {
      await prisma.inventory.create({
        data: {
          productId:
            product.id,

          warehouseId:
            warehouse.id,

          stock: 0,

          reservedStock: 0,
        },
      });
    }

    return NextResponse.json(
      product
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to add product",
      },
      {
        status: 500,
      }
    );
  }
}