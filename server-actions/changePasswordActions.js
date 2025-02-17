import { ResetPasswordSchema } from "@/FormValidationSchema/ResetPassword";

export const changePassword = async (currentState, formData) => {
  try {
    const input = Object.fromEntries(formData.entries());
    const result = ResetPasswordSchema.safeParse(input);
    if (!result.success) {
      const errors = {};
      result.error.errors.forEach((err) => (errors[err.path] = err.message));
      return {
        success: false,
        data: {},
        message: "Invalid inputs",
        error: errors,
      };
    }

    return {
      success: true,
      data: {},
      message: "Password was changed successfully",
      error: errors,
    };
  } catch (error) {
    console.error(error)
  }
};
