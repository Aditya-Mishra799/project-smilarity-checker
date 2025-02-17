"use server";

import User from "@/models/user.js";
import { consumeToken, verfiyToken } from "./accountVerificationActions.js";
import { ClientError } from "./clientError";

export const verifyEmail = async (token) => {
  try {
    const verificationResp = await verfiyToken(token);
    if (!verificationResp.success) {
      throw new ClientError(verificationResp.message);
    }
    const updateUser = await User.findByIdAndUpdate(verificationResp.data.payload.userId, {
        $set : {
            isVerified : true,
        }
    })
    const invalidateToken = await consumeToken(token)
    if (!invalidateToken.success) {
        throw new ClientError(invalidateToken.message);
      }
    return {
        success : true,
        message : "Email verified successfully, you can now login."
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message ||
          "Some error occurred while verifying user, try again",
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
