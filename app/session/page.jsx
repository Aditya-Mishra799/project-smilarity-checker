import { appConfig } from "@/config/appConfig";
import { getAllSessions } from "@/server-actions/sessionAction";
import React from "react";
import SavedSesssionPage from "./SavedSessionPage";

const page = async () => {
  const formsResponse = await getAllSessions(1, appConfig.paginationItemsPerPage);
  return <div>
    <SavedSesssionPage success = {formsResponse?.success}  sessions = {formsResponse?.data?.sessions}/>
  </div>;
};

export default page;
