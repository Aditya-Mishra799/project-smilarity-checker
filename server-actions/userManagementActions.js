"use server";
import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import connectToDB from "@/lib/mongodb";
import User from "@/models/user";
import { escapeRegExp } from "@/utils/basicUtils";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { ClientError } from "./clientError";

export const getUsers = async (page, limit, query, type) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user || !user.id) {
      throw new ClientError("Unauthorized. Please log in and try again.");
    }
    if(user.role !== "super-admin"){
        throw new ClientError("This fetaure is not available to your privilege level !!!")
    }
    const skip = (page - 1) * limit;
    const exclude = ["admin", "super-admin"];
    const typeToFilter = {
      grant: { role: { $nin: exclude } },
      revoke: { role: "admin" },
    };
    const filter = {
      ...typeToFilter[type],
      isVerified: true,
      ...(query && query.trim()
        ? {
            $or: [
              { name: { $regex: escapeRegExp(query.trim()), $options: "i" } },
              { email: { $regex: escapeRegExp(query.trim()), $options: "i" } },
            ],
          }
        : {}),
    };
    await connectToDB();
    const users = await User.find(filter, { email: 1, name: 1, role: 1 })
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });
    const totalDocuments = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      success: true,
      message: "Fetched users successfully",
      data: {
        users: users.map((user) => ({ ...user, _id: user._id.toString() })),
        totalDocuments,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message || "Some error occurred while fetching the users data.",
        error: error.message,
        data: {},
      };
    } else {
      console.error("Error in Users", error);
      return {
        success: false,
        message:
          "An unexpected error occurred while fetching the user data. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};

export const changeUserRole = async (userId, role) => {
  try {
    const { user:loggedInUser  } = await getServerSession(authOptions);
    if (!loggedInUser || !loggedInUser.id) {
      throw new ClientError("Unauthorized. Please log in and try again.");
    }
    if(loggedInUser?.role !== "super-admin"){
        throw new ClientError("You don't have privilege to perform this action.")
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new ClientError("Invalid user id.");
    }
    await connectToDB();
    const user = await User.findById(userId, { name: 1, email: 1, role: 1 });
    if (!user) {
      throw new ClientError("User does not exists.");
    }
    if (user.role === role) {
      throw new ClientError("User already belongs to smame role !!!");
    }
    user.role = role;
    await user.save();
    return {
      success: true,
      message: "User role changed successfully.",
      error: null,
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          _id: user._id.toString(),
        },
      },
    };
  } catch (error) {
    console.error("Error while changing role: ", error);
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message || "Some error occurred while updating user role",
        error: error.message,
        data: {},
      };
    } else {
      console.error(error);
      return {
        success: false,
        message:
          "An unexpected error occurred while updating user role. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};
