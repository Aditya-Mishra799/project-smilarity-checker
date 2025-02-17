import { appConfig } from "@/config/appConfig";
import { getSavedForms } from "@/server-actions/savedFormAction";
import React from "react";
import SavedFormPage from "./SavedFormPage";

const page = async () => {
  const formsResponse = await getSavedForms(1, appConfig.paginationItemsPerPage);
  return <div>
    <SavedFormPage success = {formsResponse?.success}  forms = {formsResponse?.data?.forms}/>
  </div>;
};

export default page;
