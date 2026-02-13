import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { data, transformations, format } = await request.json();

    // Generate short ID (8 characters)
    const id = nanoid(8);

    // Save to database
    await sql`
      INSERT INTO sessions (id, data, transformations, format)
      VALUES (${id}, ${JSON.stringify(data)}, ${JSON.stringify(transformations)}, ${format})
    `;

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Error saving session:", error);
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 }
    );
  }
}
