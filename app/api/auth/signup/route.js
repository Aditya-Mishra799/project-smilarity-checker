import connectToDB from "@/lib/mongodb";
import User from "@/models/user";
import { getVerificationLink } from "@/server-actions/accountVerificationActions";
import { sendEmail } from "@/server-actions/emailActions";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password, name } = await request.json();
  try {
    await connectToDB();
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Invalid Request Data" },
        { status: 400 }
      );
    }
    let userData = await User.findOne({ email: email });
    if (userData && userData.isVerified === true) {
      return NextResponse.json(
        { error: "User with same email is already registered" },
        { status: 409 }
      );
    }
    if (!userData) {
      userData = new User({ name, email, password });
      await userData.save();
    } else if (userData?.isVerified === false) {
      userData.password = password;
      await userData.save();
    }
    const verificationLink = await getVerificationLink(
      "verify-email",
      userData?._id
    );
    if (!verificationLink.success) {
      return NextResponse.json(
        { message: verificationLink.message },
        { status: 400 }
      );
    }
    const emailResp = await sendEmail(
      email,
      "Verify Your Email Address",
      `<p>Please verify your email address by clicking the following link:</p><a href="${verificationLink?.data.link}">Verify Email</a>`
    );
    if (!emailResp?.success) {
      return NextResponse.json({ message: emailResp.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "User registered successfully and verification email sent" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
