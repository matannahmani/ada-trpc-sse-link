/* eslint-disable @typescript-eslint/require-await */
import { type NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { env } from "@/env.mjs";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  const secret = request.nextUrl.searchParams.get("secret");
  if (env.NEXTAUTH_SECRET !== secret || !tag) {
    return NextResponse.error();
  }
  void revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
