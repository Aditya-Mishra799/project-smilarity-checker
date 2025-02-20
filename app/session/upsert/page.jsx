import AttachSessionDetails from "@/components/AttachSessionDetails";
import { getSessionById } from "@/server-actions/sessionAction";
import { notFound } from "next/navigation";
import React from "react";
import UpsertSession from "./UpsertSession";

const page = async ({ searchParams }) => {
  const id = (await searchParams).id;
  let defaultValue = {};
  if (id && id != "") {
    const response = await getSessionById(id);
    if (!response.success) {
      return notFound();
    }
    const { name, description, threshold, autoReject } = response.data;
    defaultValue = {
      name,
      description,
      threshold,
      autoReject,
    };
  }
  return (
    <div>
      <AttachSessionDetails id={id} Component={UpsertSession} defaultValue = {defaultValue}/>
    </div>
  );
};

export default page;
