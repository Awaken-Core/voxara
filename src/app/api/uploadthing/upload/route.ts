import { NextResponse } from "next/server";
import { uploadUploadThingFile } from "../core";
import { getServerSession } from "@/lib/auth-session";

export async function POST(req: Request) {
    const session = await getServerSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { file } = await req.json();

    if (!file) {
        return NextResponse.json(
            { error: "Missing file" },
            { status: 400 }
        );
    }

    const res = await uploadUploadThingFile(file);

    return NextResponse.json({ success: true, key: res?.key || "" });
}
