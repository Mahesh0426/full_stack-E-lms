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
import useLoading from "@/hooks/useLoading";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const { toast } = useToast();

  const [logInFormData, setLogInFormData] = useState(initialLoginFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const [auth, setAuth] = useState({ authenticate: false, user: null });

  const { isLoading, startLoading, stopLoading } = useLoading();

  // Helper function to update auth state
  const updateAuthState = (authenticate, user) => {
    setAuth({ authenticate, user });
  };

  //  function to handle the registration
  const handleRegister = async (e) => {
    e.preventDefault();
    startLoading();

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
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong during registration.",
        variant: "destructive",
      });
    } finally {
      stopLoading();
    }
  };

  //function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      const response = await loginService(logInFormData);
      console.log("response", response);

      // Assuming response.data contains user details
      if (response.status === "success") {
        const { accessToken: token, user } = response.data;
        console.log(token);
        console.log(user);

        // Save token to sessionStorage
        sessionStorage.setItem("accessToken", token);

        // Update auth state with user information
        updateAuthState(true, user);

        toast({
          title: "Success",
          description: response.message || "Login successful!",
          variant: "success",
        });
      } else {
        // Show error toast if the response status is not success
        toast({
          title: "Error",
          description: response.message || "Login failed.",
          variant: "destructive",
        });
        updateAuthState(false, null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Login failed.",
        variant: "destructive",
      });
    } finally {
      stopLoading();
    }
  };
  //check auth user
  const checkAuthUser = async () => {
    try {
      const response = await checkAuthService();

      if (response.status === "success") {
        const userData = {
          email: response.data.email,
          role: response.data.role || "user",
          userName: response.data.userName,
          _id: response.data._id,
        };
        updateAuthState(true, userData);
      } else {
        updateAuthState(false, null);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.status === "error") {
        updateAuthState(false, null);
      }
    }
  };

  const handleResetCredentials = () => {
    updateAuthState(false, null);
  };

  // useEffect to check auth user when app loads
  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log("auth", auth);
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
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
