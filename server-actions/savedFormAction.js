"use server";

import authOptions from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import { appConfig } from "@/config/appConfig";
import connectToDB from "@/lib/mongodb";
import FormData from "@/models/formData";
import { getServerSession } from "next-auth";

export const getSavedForms = async (
  page = 1,
  limit = appConfig.paginationItemsPerPage
) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user || !user?.id) {
      return {
        success: false,
        message: "Unauthorized, login and try again",
        error: null,
        data: {},
      };
    }
    await connectToDB();
    const skip = (page - 1) * limit;
    const forms = await FormData.find(
      { userId: user.id, isSubmitted: false },
      { title: 1, createdAt: 1, expiresAt: 1 }
    )
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const formsWithStringIds = forms.map((form) => ({
      ...form,
      _id: form._id.toString(),
    }));
    return {
      success: true,
      message: "Saved forms found",
      error: null,
      data: { forms: formsWithStringIds },
    };
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Some error occurred, please try again!!!",
      error: error.message,
      data: {},
    };
  }
};

export const deleteSavedForm = async (id) => {
  try {
    const { user } = await getServerSession(authOptions);
    if (!user || !user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in and try again.",
        error: null,
        data: {},
      };
    }
    await connectToDB();
    let form = await FormData.findById(id, { userId: 1, title: 1 }).lean();
    if (!form) {
      return {
        success: false,
        message: "Form not found, please try again !!!",
        error: null,
        data: {},
      };
    }
    form = {
      ...form,
      _id: form?._id.toString(),
      userId: form?.userId.toString(),
    };
    if (form?.userId !== user?.id) {
      return {
        success: false,
        message: "You are not authorized to delete this form.",
        error: null,
        data: {},
      };
    }
    await FormData.findByIdAndDelete(id);
    return {
      success: true,
      message: `Deleted form${form.title ? ` titled "${form.title}"` : ""}.`,
      error: null,
      data: { form },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while deleting the form. Please try again.",
      error: error.message,
      data: {},
    };
  }
};
