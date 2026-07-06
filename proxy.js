import { auth } from "@/_lib/auth";

export const proxy = auth;

export const config = {
	matcher: ["/account"],
};
