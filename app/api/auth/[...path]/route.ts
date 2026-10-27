import { auth } from "@/utils/auth/server";

export const { GET, POST, PUT, DELETE, PATCH } = auth.handler();
