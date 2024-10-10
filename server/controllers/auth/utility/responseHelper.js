export const buildSuccessResponse = (res, data, message = "") => {
  return res.json({
    status: "success",
    data,
    message,
  });
};

export const buildErrorResponse = (res, message = "", statusCode = 400) => {
  return res.status(statusCode).json({
    status: "error",
    message: message || "Something went wrong!",
  });
};
