import connectToDB from "@/lib/mongodb";
import FormData from "@/models/formData";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await connectToDB()
    const formData = await req.json();
    let { currentPage, pageData, title, type, id, userId } = formData;
    currentPage = parseInt(currentPage)
    // Validate required fields
    if ( isNaN(currentPage) || currentPage < 0 || !pageData) {
      return NextResponse.json(
        { error: "Invalid input: 'currentPage' and 'pageData' are required." },
        { status: 400 }
      );
    }

    // If `id` is provided, update the existing form
    if (id &&  id !== "new") {
      const form = await FormData.findById(id);
      if (!form) {
        return NextResponse.json(
          { error: `Form with ID ${id} not found.` },
          { status: 404 }
        );
      }

      form.data = form.data || {};
      form.data = pageData; 
      if(title){
        form.title = title
      }
      form.currentPage = Math.max(currentPage, form.currentPage)
      await form.save();

      return NextResponse.json(
        {
          message: "Form currentPage data updated successfully.",
          formId: form._id,
        },
        { status: 200 }
      );
    }
    // If `id` is not provided, create a new form
    if (!title || !type) {
      return NextResponse.json(
        { error: "Invalid input: 'title' and 'type' are required for new forms." },
        { status: 400 }
      );
    }

    const newForm = new FormData({
      userId: userId || null,
      title,
      type,
      data: {  ...pageData },
      currentPage: 0,
    });

    await newForm.save();
    return NextResponse.json(
      { message: "Form created successfully", redirectUrl: `/add-listing/${newForm._id}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { error: "An internal server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
