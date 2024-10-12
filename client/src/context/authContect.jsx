// eslint-disable-next-line react/prop-types
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

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [logInFormData, setLogInFormData] = useState(initialLoginFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({ authenticate: false, user: null });

  // Helper function to update auth state
  const updateAuthState = (authenticate, user) => {
    setAuth({ authenticate, user });
  };

  //  function to handle the registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerService(signUpFormData);

    if (response.status === "success") {
      console.log("Registration successful!", response);
    }
  };

  //function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginService(logInFormData);

    if (response.status === "success") {
      // Extract the token from the response
      const accessToken = response.data;
      // Save token to sessionStorage
      sessionStorage.setItem("accessToken", accessToken);

      //auth update
      updateAuthState(true, response.data.user);
    } else {
      updateAuthState(false, null);
    }
    console.log("response", response);
  };

  //check auth user
  const checkAuthUser = async () => {
    const response = await checkAuthService();
    if (response.status === "success") {
      updateAuthState(true, response.data.user);
    } else {
      updateAuthState(false, null);
    }
    console.log("auth response", response);
  };
  // // useEffect to check auth user when app loads
  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logInFormData,
        setLogInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegister,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
