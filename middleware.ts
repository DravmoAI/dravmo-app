import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { get } from "@vercel/edge-config";

export async function middleware(req: NextRequest) {
	if (!process.env.EDGE_CONFIG) {
		console.warn("EDGE_CONFIG not set. Skipping Edge Config fetch.");
		return NextResponse.next();
	}

	const maintenance = await get("maintenance_mode");
	if (!maintenance) {
		console.warn("maintenance_mode not set. Skipping maintenance mode check.");
		return NextResponse.next();
	}

	// Skip assets, API, and maintenance page itself
	const pathname = req.nextUrl.pathname;
	const isAsset = pathname.startsWith("/_next") || pathname.includes(".");
	const isApi = pathname.startsWith("/api");
	const isMaintenancePage = pathname === "/maintenance";

	if (maintenance && !isMaintenancePage && !isAsset && !isApi) {
		return NextResponse.redirect(new URL("/maintenance", req.url));
	}

	return NextResponse.next();
}

// Apply middleware to all pages
export const config = {
	matcher: "/:path*",
};
