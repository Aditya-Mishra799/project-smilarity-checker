"use server";
import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import { getServerSession } from "next-auth";
import connectToDB from "@/lib/mongodb.js";
import { ClientError } from "./clientError";
import Session from "@/models/session";

export const createSession = async ({
  name,
  description,
  threshold,
  autoReject,
  projectIds,
  coAdmins,
}) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user || !user.id) {
      throw new ClientError("Unauthorized. Please log in and try again.");
    }

    await connectToDB();
    const session = await Session.create({
      name,
      description,
      threshold,
      autoReject,
      creator: user.id,
      projectIds: projectIds || [],
      coAdmins: coAdmins || [],
      status: "active",
    });
    await session.save();
    return {
      success: true,
      message: "Session created successfully.",
      error: null,
      data: { sessionId: session._id.toString() },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message || "Some error occurred while creating the session.",
        error: error.message,
        data: {},
      };
    } else {
      console.error(error);
      return {
        success: false,
        message:
          "An unexpected error occurred while creating the session. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};

export const updateSession = async (sessionId, updates) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user || !user.id) {
      throw new ClientError("Unauthorized. Please log in and try again.");
    }

    await connectToDB();
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ClientError("Session not found.");
    }

    if (session.creator.toString() !== user.id) {
      throw new ClientError("You are not authorized to update this session.");
    }

    Object.assign(session, updates);
    await session.save();

    return {
      success: true,
      message: "Session updated successfully.",
      error: null,
      data: { sessionId: session._id.toString() },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message || "Some error occurred while updating the session.",
        error: error.message,
        data: {},
      };
    } else {
      console.error(error);
      return {
        success: false,
        message:
          "An unexpected error occurred while updating the session. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};

export const getSessionById = async (sessionId) => {
  try {
    //   const { user } = await getServerSession(authOptions);
    //   if (!user || !user.id) {
    //     throw new ClientError("Unauthorized. Please log in and try again.");
    //   }

    await connectToDB();
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ClientError("Session not found.");
    }

    // Convert ObjectIds to strings
    const sessionData = {
      ...session.toObject(),
      _id: session._id.toString(),
      creator: session.creator.toString(),
      projectIds: session.projectIds.map((id) => id.toString()),
      coAdmins: session.coAdmins.map((id) => id.toString()),
    };

    return {
      success: true,
      message: "Session data fetched successfully.",
      error: null,
      data: sessionData,
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message:
          error.message || "Some error occurred while fetching the session.",
        error: error.message,
        data: {},
      };
    } else {
      console.error(error);
      return {
        success: false,
        message:
          "An unexpected error occurred while fetching the session. Please try again later.",
        error: null,
        data: {},
      };
    }
  }
};

export const getAllSessions = async (
  page = 1,
  limit = 10,
  filters = {}
) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user || !user.id) {
      throw new ClientError("Unauthorized. Please log in and try again.");
    }

    await connectToDB();
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query = {};
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    const sessions = await Session.find(
      query,
      {
        creator: 1,
        name: 1,
        description: 1,
        threshold: 1,
        status: 1,
        createdAt: 1,
      }
    )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalSessions = await Session.countDocuments(query);

    const sessionData = sessions.map((session) => ({
      ...session.toObject(),
      _id: session._id.toString(),
      creator: session.creator.toString(),
    }));

    return {
      success: true,
      message: "Sessions fetched successfully.",
      error: null,
      data: {
        sessions: sessionData,
        totalSessions,
        totalPages: Math.ceil(totalSessions / limit),
        currentPage: page,
        limit: limit,
      },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message: error.message || "Some error occurred while fetching sessions.",
        error: error.message,
        data: {
          sessions: [],
          totalSessions: 0,
          totalPages: 0,
          currentPage: page,
          limit: limit,
        },
      };
    } else {
      console.error(error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching sessions. Please try again later.",
        error: null,
        data: {
          sessions: [],
          totalSessions: 0,
          totalPages: 0,
          currentPage: page,
          limit: limit,
        },
      };
    }
  }
};