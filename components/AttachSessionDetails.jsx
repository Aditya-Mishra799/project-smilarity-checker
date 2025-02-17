import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import { getServerSession } from "next-auth";
import React from "react";

const AttachSessionDetails = async ({ Component, ...props }) => {
  const session = await getServerSession(authOptions);

  // Pass session and any other props to the wrapped component
  return <Component {...props} user={session?.user} />;
};

export default AttachSessionDetails;
