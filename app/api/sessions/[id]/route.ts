import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch session from database
    const result = await sql`
      SELECT id, data, transformations, format, created_at
      FROM sessions
      WHERE id = ${id} AND expires_at > NOW()
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Session not found or expired" },
        { status: 404 }
      );
    }

    const session = result[0];

    return NextResponse.json({
      id: session.id,
      data: session.data,
      transformations: session.transformations,
      format: session.format,
      createdAt: session.created_at,
    });
  } catch (error) {
    console.error("Error loading session:", error);
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 }
    );
  }
}
