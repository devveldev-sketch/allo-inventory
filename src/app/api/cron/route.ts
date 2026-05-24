import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {

  try {

    return NextResponse.json({
      success: true,
      message: "Cron route working",
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