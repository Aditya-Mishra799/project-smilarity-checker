"use client";
import Tabs from "@/components/Tabs";
import { User2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import React from "react";
import UserTableSkeleton from "../UserTableSkeleton";
import UserTable from "./UserTable";
const tabOptions = [
  {
    label: "Admins",
    key: "revoke",
    Icon: User2Icon,
    component: <UserTable type="revoke" />,
  },
  {
    label: "Make Admin",
    key: "grant",
    Icon: User2Icon,
    component: <UserTable type="grant" />,
  },
];
export default function UserMangement({ params }) {
  const { tab } = React.use(params);
  const { data, status } = useSession();
  if (status !== "loading" && data?.user?.role !== "super-admin") {
    return notFound();
  }
  if (status === "loading") {
    return (
      <div className="w-full flex justify-center">
        <UserTableSkeleton />
      </div>
    );
  }
  return (
    <div>
      <Tabs tabs={tabOptions} currentTab={tab} />
    </div>
  );
}
