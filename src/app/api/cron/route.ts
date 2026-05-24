import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {

  try {

    // Get only expired pending reservations
    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          status: "PENDING",

          expiresAt: {
            lte: new Date(),
          },
        },
      });

    for (const reservation of expiredReservations) {

      // Get inventory first
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

      // Prevent negative values
      if (!inventory) continue;

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

          // restore stock
          stock: {
            increment:
              reservation.quantity,
          },

          // decrease reserved stock safely
          reservedStock:
            Math.max(
              inventory.reservedStock -
                reservation.quantity,
              0
            ),
        },
      });

      // Update reservation status
      await prisma.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status: "EXPIRED",
        },
      });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}