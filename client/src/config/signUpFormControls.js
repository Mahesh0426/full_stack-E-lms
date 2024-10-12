export const signUpFormControls = [
  {
    name: "userName",
    label: "User Name",
    type: "text",
    placeholder: "Enter your full Name",
    componentType: "input",
    required: true,
  },
  {
    name: "userEmail",
    label: "Email Address",
    type: "email",
    placeholder: "Enter  your email address",
    componentType: "input",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter  your password",
    componentType: "input",
    required: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: " Enter confirm password",
    componentType: "input",
    required: true,
  },
];

export const LogInFormControls = [
  {
    name: "userEmail",
    label: "Email Address",
    type: "email",
    placeholder: "Enter  your email address",
    componentType: "input",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter  your password",
    componentType: "input",
    required: true,
  },
];

export const initialLoginFormData = {
  userEmail: "",
  password: "",
};

export const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
  confirmPassword: "",
};
