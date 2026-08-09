import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const siteName =
      String(body.title || "");

    const description =
      String(body.description || "");

    const eyebrow =
      String(body.subtitle || "");

    const { data: existing } =
      await supabase
        .from("site_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

    const values = {
      hero_title: siteName,
      hero_description: description,
      hero_eyebrow: eyebrow,
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("site_settings")
        .update(values)
        .eq("id", existing.id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert(values);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Save failed" },
      { status: 500 }
    );
  }
}
