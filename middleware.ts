import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dash/farm")) {
    if (!request.cookies.has("name")) {
      return NextResponse.rewrite(new URL("/", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/dash/admin")) {
    if (!request.cookies.has("admin")) {
      return NextResponse.rewrite(new URL("/", request.url));
    }
  }
}
