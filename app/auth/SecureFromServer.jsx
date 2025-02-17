// A server comonent to secure loginn and register page
// redirects logged in user to home page
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import authOptions from "../api/auth/[...nextauth]/nextAuthOptions";

const SecureFromServer = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return <>{children}</>;
};

export default SecureFromServer;
