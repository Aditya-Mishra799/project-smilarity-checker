"use server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import connectToDB from "@/lib/mongodb";
import { ClientError } from "./clientError";
import Project from "@/models/project";
import Session from "@/models/session";
import User from "@/models/user";

export const getUserProfile = async (userId) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    // Get all projects by the user
    const projects = await Project.find({ creator: userId });
    
    // Get unique session IDs from projects
    const sessionIds = [...new Set(projects.map(project => project.sessionId))];
    
    // Get active sessions count
    const activeSessions = await Session.countDocuments({
      _id: { $in: sessionIds },
      status: 'active'
    });

    // Count projects by status
    const projectStats = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        totalProjects: projects.length,
        activeSessions,
        acceptedProjects: projectStats.accepted || 0,
        pendingProjects: projectStats.pending || 0,
        rejectedProjects: projectStats.rejected || 0,
        profileImageKey: session.user.image
      }
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message: error.message,
        data: {}
      };
    }
    return {
      success: false,
      message: "Failed to fetch user profile",
      data: {}
    };
  }
};

export const updateProfileImage = async (imageKey) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    await User.findByIdAndUpdate(session.user.id, {
      image: imageKey
    });

    return {
      success: true,
      message: "Profile image updated successfully"
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: "Failed to update profile image"
    };
  }
};