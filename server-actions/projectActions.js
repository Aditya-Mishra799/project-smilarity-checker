'use server';
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import connectToDB from "@/lib/mongodb.js";
import { ClientError } from "./clientError";
import Project from "@/models/project";
import Session from "@/models/session";

export const getProjectDetails = async (projectId) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    const project = await Project.findById(projectId)
      .populate('creator', 'name email')
      .lean();

    if (!project) {
      throw new ClientError("Project not found");
    }

    const session = await Session.findById(project.sessionId);
    if (!session) {
      throw new ClientError("Associated session not found");
    }

    const isCreator = project?.creator ? project.creator._id.toString() === user.id : false;
    const isSessionAdmin = 
      session.creator.toString() === user.id || 
      session.coAdmins.includes(user.id);
    const hasAdminAccess = isSessionAdmin;
    const canEdit = isCreator || hasAdminAccess;

    return {
      success: true,
      data: {
        project: {
          ...project,
          _id: project._id.toString(),
          sessionId: project.sessionId.toString(),
          creator: project.creator ? {
            ...project.creator,
            _id: project.creator._id.toString()
          }: {}
        },
        userAccess: {
          isCreator,
          isSessionAdmin,
          hasAdminAccess,
          canEdit
        }
      }
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: "Failed to fetch project details"
    };
  }
};

export const updateProjectStatus = async (projectId, newStatus) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user?.id) {
      throw new ClientError("Unauthorized");
    }

    await connectToDB();

    const project = await Project.findById(projectId);
    if (!project) {
      throw new ClientError("Project not found");
    }

    const session = await Session.findById(project.sessionId);
    if (!session) {
      throw new ClientError("Associated session not found");
    }

    const isSessionAdmin = 
      session.creator.toString() === user.id || 
      session.coAdmins.includes(user.id);

    if (!isSessionAdmin) {
      throw new ClientError("Only session admins can update project status");
    }

    if (!['accepted', 'rejected', 'pending'].includes(newStatus)) {
      throw new ClientError("Invalid status");
    }

    project.status = newStatus;
    await project.save();

    return {
      success: true,
      message: `Project status updated to ${newStatus}`
    };
  } catch (error) {
    if (error instanceof ClientError) {
      return {
        success: false,
        error: error.message
      };
    }
    return {
      success: false,
      error: "Failed to update project status"
    };
  }
};