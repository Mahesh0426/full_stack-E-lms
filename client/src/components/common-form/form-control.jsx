import React from "react";
import { Label } from "../ui/label";

const FormControl = (props) => {
  const { formControls = [], formData, setFormData } = props;

  function renderComponentByType(getControlItem) {
    switch (key) {
      case value:
        break;

      default:
        break;
    }
  }
  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controleItem) => (
        <div key={controleItem.name}>
          <Label htmlFor={controleItem.name}>{controleItem.label}</Label>
          renderComponentByType(controleItem)
        </div>
      ))}
    </div>
  );
};

export default FormControl;
