import { getSessionDetails } from "@/server-actions/sessionDetailsAction";
import SessionDetailsPage from "./SessionDetailsPage";
import { notFound } from "next/navigation";

export default async function SessionDetails({ 
  params 
}) {
const  id = (await params).id
  const response = await getSessionDetails(id);

  if (!response.success) {
    return notFound();
  }

  return <SessionDetailsPage id = {id} {...response.data} />;
}