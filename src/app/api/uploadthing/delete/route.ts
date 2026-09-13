import { NextResponse } from "next/server";
import { deleteUploadThingFile } from "../core";
import { getServerSession } from "@/lib/auth-session";

export async function POST(req: Request) {
  const session = await getServerSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keys } = await req.json();

  if (!keys) {
    return NextResponse.json(
      { error: "Missing file key(s)" },
      { status: 400 }
    );
  }

  await deleteUploadThingFile(keys);

  return NextResponse.json({ success: true });
}
