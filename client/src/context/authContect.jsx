// eslint-disable-next-line react/prop-types
import { Skeleton } from "@/components/ui/skeleton";
import {
  initialLoginFormData,
  initialSignUpFormData,
} from "@/config/signUpFormControls";
import {
  checkAuthService,
  loginService,
  registerService,
} from "@/services/registerService";
import { createContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  //toast hook
  const { toast } = useToast();
  const [logInFormData, setLogInFormData] = useState(initialLoginFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({ authenticate: false, user: null });

  const [isLoading, setIsLoading] = useState(true);

  // Helper function to update auth state
  const updateAuthState = (authenticate, user) => {
    setAuth({ authenticate, user });
  };

  //  function to handle the registration
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await registerService(signUpFormData);

      if (response.status === "success") {
        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
      } else {
        // Show error toast if the response status is not success
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Catch any error that occurs during the API call
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong during registration.",
        variant: "destructive",
      });
    }
  };

  //function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await loginService(logInFormData);

    if (response.status === "success") {
      // Extract token and user data
      const { token, user } = response.data;

      // Save token to sessionStorage
      sessionStorage.setItem("accessToken", token);

      // Update auth state with user information
      updateAuthState(true, user);

      // Show success toast
      toast({
        title: "Success",
        description: response.message || "Login successful!",
        variant: "success",
      });
    } else {
      // Show error toast
      toast({
        title: "Error",
        description: response.message || "Login failed.",
        variant: "destructive",
      });
      updateAuthState(false, null);
    }
  };

  //check auth user
  // const checkAuthUser = async () => {
  //   const response = await checkAuthService();
  //   console.log("checkAuthService response", response);
  //   if (response.status === "success") {
  //     updateAuthState(true, response.data);
  //   } else {
  //     updateAuthState(false, null);
  //   }
  // };

  // Check authenticated user
  const checkAuthUser = async () => {
    try {
      const response = await checkAuthService();
      // console.log("checkAuthService response", response);

      if (response.status === "success") {
        // Assuming response.data contains user details
        const userData = {
          email: response.data.email,
          role: response.data.role || "user",
        };
        updateAuthState(true, userData);
        setIsLoading(false);
      } else {
        updateAuthState(false, null);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.status === "error") {
        updateAuthState(false, null);
        setIsLoading(false);
      }
    }
  };

  // function to reset credentials
  const handleResetCredentials = () => {
    updateAuthState(false, null);
  };

  // useEffect to check auth user when app loads
  useEffect(() => {
    checkAuthUser();
  }, []);

  // console.log("auth", auth);

  return (
    <AuthContext.Provider
      value={{
        logInFormData,
        setLogInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegister,
        handleLogin,
        auth,
        handleResetCredentials,
      }}
    >
      {isLoading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
