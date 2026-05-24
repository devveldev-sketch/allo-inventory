import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.inventory.deleteMany({
      where: {
        productId: id,
      },
    })

    await prisma.product.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      {
        status: 500,
      }
    )
  }
}