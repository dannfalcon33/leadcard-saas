import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth/server";
import { updateProject, createProjectForUser } from "@/utils/db-service";

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const project = await createProjectForUser(
      session.user.id,
      body.title || "Mi Nuevo Proyecto",
      body.description || "Edita esto en el dashboard"
    );
    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    console.error("Error creating project:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, description, theme_config } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const updated = await updateProject(id, session.user.id, {
      title,
      description,
      theme_config,
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    console.error("Error updating project:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
