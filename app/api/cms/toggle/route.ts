import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedTables = [
  "brands",
  "projects",
  "team_members",
  "bts",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const table = String(body.table || "");
    const id = String(body.id || "");

    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { error: "Invalid table" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const update: Record<string, boolean> = {};

    if (typeof body.published === "boolean") {
      update.published = body.published;
    }

    if (typeof body.featured === "boolean") {
      update.featured = body.featured;
    }

    if (!Object.keys(update).length) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from(table)
      .update(update)
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}
