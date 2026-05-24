import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    // FIX
    const { id } =
      await context.params;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id,
        },
      });

    if (!reservation) {

      return NextResponse.json(
        {
          message:
            "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    // Already handled
    if (
      reservation.status ===
        "CONFIRMED" ||

      reservation.status ===
        "EXPIRED" ||

      reservation.status ===
        "CANCELLED"
    ) {

      return NextResponse.json(
        {
          message:
            "Reservation already processed",
        },
        {
          status: 400,
        }
      );
    }

    // Update reservation
    await prisma.reservation.update({
      where: {
        id,
      },

      data: {
        status: "CANCELLED",
      },
    });

    // Restore inventory
    await prisma.inventory.update({
      where: {
        productId_warehouseId: {
          productId:
            reservation.productId,

          warehouseId:
            reservation.warehouseId,
        },
      },

      data: {

        stock: {
          increment:
            reservation.quantity,
        },

        reservedStock: {
          decrement:
            reservation.quantity,
        },
      },
    });

    return NextResponse.json({
      success: true,

      message:
        "Reservation cancelled successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to cancel reservation",
      },
      {
        status: 500,
      }
    );
  }
}