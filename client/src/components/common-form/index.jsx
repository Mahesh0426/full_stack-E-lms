import React from "react";
import { Button } from "../ui/button";

const CommonForm = (props) => {
  const { handleOnsubmit, buttonText } = props;
  return (
    <form onSubmit={handleOnsubmit}>
      {/* form controls here */}
      <Button type="submit">{buttonText || "submit"}</Button>
    </form>
  );
};

export default CommonForm;
