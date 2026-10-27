import { auth } from "@/utils/auth/server";

export default auth.middleware({ loginUrl: "/" });

export const config = {
  matcher: [
    /*
     * Match dashboard routes to protect them
     */
    "/dashboard/:path*",
  ],
};
