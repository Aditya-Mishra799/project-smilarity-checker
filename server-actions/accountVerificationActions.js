import jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";
import { ClientError } from "./clientError";
import connectToDB from "@/lib/mongodb";
import User from "@/models/user";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import { appConfig } from "@/config/appConfig";
const puposeRouteMappiing = appConfig.purposeRouteMapping;

const generateToken = async (purpose, userId, expiryInMinutes) => {
  try {
    if (!purpose || !(purpose in puposeRouteMappiing)) {
      throw new ClientError("Please send a valid purpose of vertification");
    }
    if (!userId || !expiryInMinutes) {
      throw new ClientError("User Id and expiry time are required");
    }
    const tokenPayload = {
      userId,
      purpose,
      uuid: uuid4(),
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: `${expiryInMinutes}m`,
    });
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ClientError("Invalid User ID");
    }
    await connectToDB();
    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        verificationToken: tokenPayload.uuid,
        isUsed: false,
      },
    });
    if (!user) {
      throw new ClientError("User not found");
    }
    return {
      success: true,
      message: "Token generated successfully",
      data: { token },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message ||
          "Some error occurred while generating verification link, try again",
        error: error.message,
        data: {},
      };
    } else {
      console.error("server error: ", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};

export const getVerificationLink = async (purpose, userId) => {
  try {
    const expiryTime = appConfig.emailVerificationLinkExpiry;
    const tokenResponse = await generateToken(purpose, userId, expiryTime);
    if (!tokenResponse.success) {
      throw new ClientError(tokenResponse.message || "Some error occurred");
    }
    const redirectEndpoint = puposeRouteMappiing[purpose];
    const verificationLink = new URL(
      redirectEndpoint,
      process.env.NEXT_PUBLIC_URL
    );
    verificationLink.searchParams.append("token", tokenResponse.data.token);
    return {
      success: true,
      message: "verifiacation link generated successfully",
      data: { link: verificationLink.toString() },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message ||
          "Some error occurred while generating verification link, try again",
        error: error.message,
        data: {},
      };
    } else {
      console.error("server error: ", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};

export const verfiyToken = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      throw new ClientError("Invalid token or expired");
    }
    await connectToDB();
    const userData = await User.findById(payload?.userId, {
      verificationToken: 1,
      isUsed: 1,
    });
    if (!userData) {
      throw new ClientError("User not found");
    }
    if (userData?.isUsed) {
      throw new ClientError(
        "Verification already completed, regenerate verification link."
      );
    }
    if (payload?.uuid !== userData?.verificationToken) {
      throw new ClientError("Verification link is not valid");
    }
    return {
      success: true,
      message: "Token is valid",
      data: { payload },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message: error.message || "Not a valid token",
        error: error.message,
        data: {},
      };
    } else {
      console.error("server error: ", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};
export const consumeToken = async (token) => {
  try {
    const tokenResp = await verfiyToken(token);
    if (!tokenResp.success) {
      throw new ClientError(tokenResp.message);
    }
    const payload = tokenResp.data.payload;
    await User.findByIdAndUpdate(payload?.userId, {
      verificationToken: null,
      isUsed: true,
    });
    return {
      success: true,
      message: "Token consumed",
      data: {},
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message || "Some error occurred while consume token, try again",
        error: error.message,
        data: {},
      };
    } else {
      console.error("server error: ", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};
export const getRedirectUrl = async (token) => {
  try {
    const tokenResp = await verfiyToken(token);
    if (!tokenResp.success) {
      throw new ClientError(tokenResp.message);
    }
    const payload = tokenResp.data.payload;
    const redirectEndpoint = puposeRouteMappiing[payload?.purpose];
    const redirectUrl = new URL(redirectEndpoint, process.env.NEXT_PUBLIC_URL);
    redirectUrl.append("token", token);

    return {
      success: true,
      message: "Redirection link got successfully",
      data: { redirectUrl: redirectUrl.toString() },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message || "Some error occurred while verification, try again",
        error: error.message,
        data: {},
      };
    } else {
      console.error("server error: ", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};
