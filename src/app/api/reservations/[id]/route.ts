import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma }
  from "../../../../lib/prisma";

export async function POST(
  req: NextRequest,

  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id: reservationId } =
      await context.params;

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

    // Mark cancelled
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

    // Restore stock
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