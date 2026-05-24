import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      inventoryId,
      stock,
    } = body;

    await prisma.inventory.update({
      where: {
        id: inventoryId,
      },
      data: {
        stock: Number(stock),
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
          "Failed to update stock",
      },
      {
        status: 500,
      }
    );
  }
}