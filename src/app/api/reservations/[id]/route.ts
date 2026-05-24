import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "../../../../lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  try {

    const reservationId =
      params.id;

    // Find reservation
    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    // Reservation not found
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

    // Only pending can be cancelled
    if (
      reservation.status !==
      "PENDING"
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

    // FIRST mark as cancelled
    // So cron won't mark expired
    await prisma.reservation.update({
      where: {
        id: reservationId,
      },

      data: {
        status: "CANCELLED",
      },
    });

    // Find inventory
    const inventory =
      await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId:
              reservation.productId,

            warehouseId:
              reservation.warehouseId,
          },
        },
      });

    if (!inventory) {

      return NextResponse.json(
        {
          message:
            "Inventory not found",
        },
        {
          status: 404,
        }
      );
    }

    // Restore stock correctly
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

        // Add stock back
        stock: {
          increment:
            reservation.quantity,
        },

        // Reduce reserved stock safely
        reservedStock:
          Math.max(
            inventory.reservedStock -
              reservation.quantity,
            0
          ),
      },
    });

    return NextResponse.json({
      message:
        "Reservation cancelled successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to cancel reservation",
      },
      {
        status: 500,
      }
    );
  }
}