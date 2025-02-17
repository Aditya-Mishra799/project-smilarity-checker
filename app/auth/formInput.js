import Input from "@/components/Input";

export const RegisterFormInputs = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      component: Input,
      fullWidth : true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      component: Input,
      fullWidth : true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      component: Input,
      fullWidth : true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      component: Input,
      fullWidth : true,
    },
  ];

  export const LoginFormInputs = [
    {
      name: "email",
      label: "Email",
      type: "email",
      component: Input,
      fullWidth : true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      component: Input,
      fullWidth : true,
    },
  ];