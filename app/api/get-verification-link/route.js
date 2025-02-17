import { getVerificationLink } from "@/server-actions/accountVerificationActions";
import { sendEmail } from "@/server-actions/emailActions";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    const verifiacationLinkResp = await getVerificationLink("verify-email");
    const emailResp = await sendEmail(
      "adityamishra9124@gmail.com",
      "Verify Your Email Address",
      `<p>Please verify your email address by clicking the following link:</p><a href="${verifiacationLinkResp?.data.link}">Verify Email</a>`
    );
    return NextResponse.json(verifiacationLinkResp, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
};
