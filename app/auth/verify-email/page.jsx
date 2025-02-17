import { verifyEmail } from "@/server-actions/verifyEmailAction"
import MessageCard from "./MessageCard"

const page = async ({searchParams}) => {
  const token = (await searchParams).token
  const props = {success : false, message : "Invalid verification link please try again !!!"}
  if(token){
    const emailVerificationResp = await verifyEmail(token)
    props.success = emailVerificationResp.success
    props.message = emailVerificationResp.message
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <MessageCard {...props}/>
    </div>
  )
}

export default page
