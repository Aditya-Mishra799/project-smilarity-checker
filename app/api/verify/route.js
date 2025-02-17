import { getRedirectUrl } from "@/server-actions/accountVerificationActions";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const redirectResp = await getRedirectUrl(token);
    if (!redirectResp?.success) {
      NextResponse.json({ message: redirectResp.message }, { status: 400 });
    }
    return NextResponse.redirect(redirectResp.data.redirectUrl);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "some error occured please try again" },
      { status: 500 }
    );
  }
};
