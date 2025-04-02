import { appConfig } from "@/config/appConfig";
import { getAllSessions } from "@/server-actions/sessionAction";
import React from "react";
import SessionPage from "./SessionPage";

const page = async () => {
  const formsResponse = await getAllSessions(1, appConfig.paginationItemsPerPage);
  return <div>
    <SessionPage success = {formsResponse?.success}  {...formsResponse?.data}/>
  </div>;
};

export default page;
