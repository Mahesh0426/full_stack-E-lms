import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";

const FormControl = (props) => {
  const { formControls = [], formData, setFormData } = props;

  // Function to render different form control types
  function renderComponentByType(getControlItem) {
    let element = null;

    if (getControlItem.componentType === "input") {
      element = (
        <Input
          id={getControlItem.name}
          name={getControlItem.name}
          placeholder={getControlItem.placeholder}
          type={getControlItem.type}
        />
      );
    } else if (getControlItem.componentType === "select") {
      element = (
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={getControlItem.label} />
          </SelectTrigger>
          <SelectContent>
            {getControlItem.options && getControlItem.options.length > 0
              ? getControlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.id}>
                    {optionItem.label}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      );
    } else if (getControlItem.componentType === "textarea") {
      element = (
        <Textarea
          id={getControlItem.name}
          name={getControlItem.name}
          placeholder={getControlItem.placeholder}
        />
      );
    } else {
      // Default case if none of the above match
      element = (
        <Input
          id={getControlItem.name}
          name={getControlItem.name}
          placeholder={getControlItem.placeholder}
          type={getControlItem.type}
        />
      );
    }
    // Return the rendered element
    return element;
  }

  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controleItem) => (
        <div key={controleItem.name}>
          <Label htmlFor={controleItem.name}>{controleItem.label}</Label>
          {renderComponentByType(controleItem)}
        </div>
      ))}
    </div>
  );
};

export default FormControl;
