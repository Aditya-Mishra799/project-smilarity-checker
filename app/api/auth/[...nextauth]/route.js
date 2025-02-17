import NextAuth from "next-auth";
import authOptions from "./nextAuthOptions";
export const handler =  NextAuth(authOptions)
export { handler as GET , handler as POST}