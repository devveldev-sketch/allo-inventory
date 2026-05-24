import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { productId } = body;

    // delete inventories first
    await prisma.inventory.deleteMany({
      where: {
        productId,
      },
    });

    // delete reservations
    await prisma.reservation.deleteMany({
      where: {
        productId,
      },
    });

    // delete product
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}