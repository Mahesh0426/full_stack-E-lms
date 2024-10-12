import axiosInstance from "@/axios/axiosInstance";

// register user
export const registerService = async (formData) => {
  const data = await axiosInstance.post("/api/user", {
    ...formData,
  });
  return data.data;
};

// login user
export const loginService = async (formData) => {
  const data = await axiosInstance.post("/api/user/login", formData);
  return data.data;
};

//check auth user
export const checkAuthService = async () => {
  const data = await axiosInstance.get("/api/user/check-auth");
  return data.data;
};

// export const checkAuthService = async () => {
//   const accessToken = sessionStorage.getItem("accessToken");
//   console.log("Token being sent:", accessToken);  // Ensure token is being retrieved correctly
//   try {
//     const response = await axiosInstance.get("/api/user/check-auth");
//     console.log("Request headers: ", response.config.headers);  // Log request headers
//     return response.data;
//   } catch (error) {
//     console.error("Error in checkAuthService:", error);
//     throw error;
//   }
// };
