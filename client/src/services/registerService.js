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

// export const checkAuthService = async () => {
//   const accessToken = sessionStorage.getItem("accessToken");
//   console.log("Token being sent:", accessToken);
//   try {
//     const response = await axiosInstance.get("/api/user/check-auth");
//     console.log("Request headers: ", response.config.headers);
//     return response.data;
//   } catch (error) {
//     console.error("Error in checkAuthService:", error);
//     throw error;
//   }
// };
//check auth user
export const checkAuthService = async () => {
  const data = await axiosInstance.get("/api/user/check-auth");
  return data.data;
};

//media uolpad
export const mediaUploadService = async (formData, onProgressCallBack) => {
  const data = await axiosInstance.post("/api/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallBack(percentCompleted);
    },
  });

  return data.data;
};
// bulk- media uolpad
export const mediaBulkUploadService = async (formData, onProgressCallBack) => {
  const data = await axiosInstance.post("/api/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallBack(percentCompleted);
    },
  });

  return data.data;
};

// media delete
export const mediaDeleteService = async (id) => {
  const data = await axiosInstance.delete(`/api/media/delete/${id}`);
  return data.data;
};

//GET | fetch  all courss
export const fetchInstructorCourseListService = async () => {
  const data = await axiosInstance.get("/api/course/get");
  return data.data;
};

//  POST | create  new course
export const addNewCourseService = async (formData) => {
  const data = await axiosInstance.post("/api/course/add", formData);
  return data.data;
};

//GET | fetch  course details
export const fetchInstructorCourseDetailsService = async (id) => {
  const data = await axiosInstance.get(`/api/course/get/details/${id}`);
  return data.data;
};
//  PUT | update course details
export const updateCourseByIdService = async (id, formData) => {
  const data = await axiosInstance.put(`/api/course/update/${id}`, formData);
  return data.data;
};

//GET | fetch  all  student courss
export const fetchStudentViewCourseListService = async (query) => {
  const data = await axiosInstance.get(`/api/student/get?${query}`);
  return data.data;
};

//GET | fetch  course details
export const tchStudentViewCourseListDetailsService = async (courseId) => {
  const data = await axiosInstance.get(`/api/student/get/details/${courseId}`);
  return data.data;
};
