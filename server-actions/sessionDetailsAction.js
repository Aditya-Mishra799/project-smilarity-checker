"use server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import connectToDB from "@/lib/mongodb.js";
import { ClientError } from "./clientError";
import Session from "@/models/session";
import Project from "@/models/project";
import User from "@/models/user";

export const getSessionDetails = async (sessionId) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    const session = await Session.findById(sessionId)
      .select("-projectIds")
      .populate("creator", "name email")
      .populate("coAdmins", "name email")
      .lean();
    if (!session) {
      throw new ClientError("Session not found");
    }

    const isCreator = session.creator._id.toString() === user.id;
    const isCoAdmin = session.coAdmins.some(
      (admin) => admin._id.toString() === user.id
    );
    const hasAdminAccess = isCreator || isCoAdmin;
    return {
      success: true,
      data: {
        session: {
          ...session,
          _id: session._id.toString(),
          creator: {
            ...session.creator,
            _id: session.creator._id.toString(),
          },
          coAdmins: session.coAdmins.map((admin) => ({
            ...admin,
            _id: admin._id.toString(),
          })),
        },
        userAccess: {
          isCreator,
          isCoAdmin,
          hasAdminAccess,
        },
      },
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to fetch session details",
    };
  }
};

export const getSessionProjects = async (
  sessionId,
  page = 1,
  limit = 10,
  filters = {}
) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();
    const skip = (page - 1) * limit;

    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ClientError("Session not found");
    }

    let query = { sessionId };

    // Add search filter
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { abstract: { $regex: filters.search, $options: "i" } },
      ];
    }

    // Add status filter
    if (filters.status && filters.status !== "all") {
      query.status = filters.status;
    }

    const projects = await Project.find(query)
      .select("-embedding")
      .populate("creator", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Project.countDocuments(query);

    return {
      success: true,
      data: {
        projects: projects.map((project) => ({
          ...project,
          _id: project._id.toString(),
          creator: project?.creator
            ? {
                ...project.creator,
                _id: project.creator._id.toString(),
              }
            : {},
          sessionId: project.sessionId.toString(),
        })),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
    };
  } catch (error) {
    console.error("Error while fetching projects:", error);
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to fetch session projects",
    };
  }
};

export const exportProjectsCSV = async (sessionId) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    const projects = await Project.find({
      sessionId,
      creator: { $exists: true, $ne: null },
    })
      .populate("creator", "name email")
      .select("title abstract status creator createdAt")
      .lean();

    const csvData = projects.map((project) => ({
      Title: project.title,
      Abstract: project.abstract,
      Status: project.status,
      "Creator Name": project.creator?.name || "",
      "Creator Email": project.creator?.email || "",
      "Created At": new Date(project.createdAt).toLocaleDateString(),
    }));

    return {
      success: true,
      data: csvData,
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to export projects",
    };
  }
};

export const getSessionUsers = async (sessionId, page = 1, limit = 10) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();
    const skip = (page - 1) * limit;
    const result = await Project.find(
      {
        sessionId,
        creator: { $ne: null },
      },
      {
        creator: 1,
        _id: 0,
      }
    )
      .populate("creator", "name email")
      .sort({ "creator.email": 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const uniqueUsers = result.map((entry) => ({
      ...entry.creator,
      _id: entry.creator._id.toString(),
    }));
    const total = await Project.distinct("creator", {
      sessionId,
      creator: { $ne: null },
    }).then((creators) => creators.length);

    return {
      success: true,
      data: {
        users: uniqueUsers,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
    };
  } catch (error) {
    console.error("Error while fetching user data", error);
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to fetch session users",
    };
  }
};

export const updateSessionCoAdmin = async (sessionId, userId, action) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ClientError("Session not found");
    }

    if (session.creator.toString() !== user.id) {
      throw new ClientError("Only the session creator can manage co-admins");
    }

    if (action === "add") {
      if (!session.coAdmins.includes(userId)) {
        session.coAdmins.push(userId);
      }
    } else {
      session.coAdmins = session.coAdmins.filter(
        (adminId) => adminId.toString() !== userId
      );
    }

    await session.save();

    return {
      success: true,
      message: `Co-admin ${
        action === "add" ? "added" : "removed"
      } successfully`,
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: `Failed to ${action} co-admin`,
    };
  }
};

export const removeProject = async (projectId, sessionId) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ClientError("Session not found");
    }

    const hasAccess =
      session.creator.toString() === user.id ||
      session.coAdmins.includes(user.id);

    if (!hasAccess) {
      throw new ClientError("Only session admins can remove projects");
    }

    await Project.findByIdAndDelete(projectId);

    return {
      success: true,
      message: "Project removed successfully",
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to remove project",
    };
  }
};
