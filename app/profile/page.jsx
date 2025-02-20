import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/nextAuthOptions";
import ProfilePage from "./ProfilePage";
import { getUserProfile } from "@/server-actions/userProfileActions";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const profileData = await getUserProfile(session?.user?.id);

  return <ProfilePage initialData={profileData.data} />;
};

export default Page;