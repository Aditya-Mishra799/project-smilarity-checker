import Button from "@/components/Button";
import { useToast } from "@/components/toast/ToastProvider";
import useApiHandler from "@/hooks/useApiHandler";
import { deleteSavedForm } from "@/server-actions/savedFormAction";
import { CircleCheckBig, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

const FormCard = ({ title, _id, expiresAt, createdAt, onDelete}) => {
  const creationDate = new Date(createdAt);
  const expiryDate = new Date(expiresAt);
  const { addToast } = useToast();

  const formattedCreationDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(creationDate);

  const now = Date.now();
  const timeRemaining = expiryDate - now;

  let timeText = "";
  if (timeRemaining <= 0) {
    timeText = "Expired";
  } else if (timeRemaining < 60 * 1000) {
    timeText = `Expires in ${Math.floor(timeRemaining / 1000)} seconds`;
  } else if (timeRemaining < 60 * 60 * 1000) {
    timeText = `Expires in ${Math.floor(timeRemaining / (60 * 1000))} minutes`;
  } else if (timeRemaining < 24 * 60 * 60 * 1000) {
    timeText = `Expires in ${Math.floor(
      timeRemaining / (60 * 60 * 1000)
    )} hours`;
  } else {
    timeText = `Expires in ${Math.floor(
      timeRemaining / (24 * 60 * 60 * 1000)
    )} days`;
  }
  const handleDeleteForm = useApiHandler(async () => {
    try {
      const deleteResponse = await deleteSavedForm(_id);
      if (!deleteResponse?.success) {
        throw new Error(deleteResponse?.message || "Some error occurred");
      }
      addToast(
        "info",
        deleteResponse?.message || "Operation performed successfully."
      );
      onDelete(_id)
    } catch (error) {
      addToast("error", error?.message || "Some error occurred");
    }
  });
  return (
    <div className="bg-slate-50 text-black shadow-lg rounded-lg p-4 max-w-xs ">
      <h3 className="font-base text-lg  mb-2 truncate">{title}</h3>
      <p className="text-xs mb-2">Created: {formattedCreationDate}</p>
      <p className="text-sm mb-4">{timeText}</p>
      <div className="flex gap-2">
        <Link
          href={`/add-listing/${_id}`}
          className="flex gap-2 items-center justify-between  text-xs  tracking-wide font-semibold text-center bg-slate-800 text-white py-1 px-2 rounded-md hover:bg-slate-900 transition-all duration-300"
        >
          <CircleCheckBig size={14} /> Complete Form
        </Link>
        <Button
          className=" px-2 py-1 text-sm"
          loadingText=""
          loading={handleDeleteForm?.apiState.loading}
          onClick={handleDeleteForm.execute}
        >
          <Trash size={14} />
        </Button>
      </div>
    </div>
  );
};

export default FormCard;
