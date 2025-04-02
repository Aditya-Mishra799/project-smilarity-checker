import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import AttachSessionDetails from "@/components/AttachSessionDetails";
import { getSessionById } from "@/server-actions/sessionAction";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import UpsertSession from "./UpsertSession";

const page = async ({ searchParams }) => {
  const id = (await searchParams).id;
  let defaultValue = {};
  const { user } = await getServerSession(authOptions);
  const validRoles = ["admin", "super-admin"];
  if (!validRoles.includes(user?.role)) {
    return notFound();
  }
  if (id && id != "") {
    const response = await getSessionById(id);
    if (!response.success) {
      return notFound();
    }
    const { name, description, threshold, autoReject, status } = response.data;
    defaultValue = {
      name,
      description,
      threshold,
      autoReject,
      status,
    };
  }
  return (
    <div>
      <AttachSessionDetails
        id={id}
        Component={UpsertSession}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default page;
