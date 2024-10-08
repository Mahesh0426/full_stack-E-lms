import React from "react";
import { Button } from "../ui/button";
import FormControl from "./form-control";

const CommonForm = (props) => {
  const {
    handleOnSubmit,
    buttonText,
    formControls = [],
    formData,
    setFormData,
  } = props;

  return (
    <form onSubmit={handleOnSubmit}>
      {/* form controls here */}
      <FormControl
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />

      <Button type="submit" className="mt-5 w-full">
        {buttonText || "submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
