import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ 
      isLoggedIn: !!session, 
      user: session ? { id: session.userId, role: session.role } : null 
    });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, user: null }, { status: 500 });
  }
}
