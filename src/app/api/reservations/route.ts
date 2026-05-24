import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {

  const reservations =
    await prisma.reservation.findMany({

      include: {
        product: true,
        warehouse: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return NextResponse.json(
    reservations
  );
}

export async function POST(
  req: NextRequest
) {

  try {

    const body =
      await req.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    // Find inventory
    const inventory =
      await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
      });

    // Inventory missing
    if (!inventory) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Inventory not found",
        },
        {
          status: 404,
        }
      );
    }

    // OUT OF STOCK CHECK
    if (
      inventory.stock <
      quantity
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Out of stock",
        },
        {
          status: 400,
        }
      );
    }

    // Update inventory
    await prisma.inventory.update({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },

      data: {

        stock: {
          decrement: quantity,
        },

        reservedStock: {
          increment: quantity,
        },
      },
    });

    // Create reservation
    const reservation =
      await prisma.reservation.create({

        data: {

          productId,
          warehouseId,
          quantity,

          status: "PENDING",

          expiresAt:
            new Date(
              Date.now() +
              60 * 1000
            ),
        },
      });

    return NextResponse.json({
      success: true,

      message:
        "Reservation created successfully",

      reservation,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create reservation",
      },
      {
        status: 500,
      }
    );
  }
}