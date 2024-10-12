import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const FormControl = (props) => {
  const { formControls = [], formData, setFormData } = props;

  // Function to update formData
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Function to render the appropriate component based on the componentType
  const renderComponent = ({
    componentType,
    name,
    placeholder,
    type,
    label,
    options = [],
  }) => {
    // Get the current value from formData
    const value = formData[name] || "";

    switch (componentType) {
      case "input":
        return (
          <Input
            id={name}
            name={name}
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
          />
        );
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleInputChange(name, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ id, label }) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
          />
        );
      default:
        return (
          <Input
            id={name}
            name={name}
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}>
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>

          {/* Render the appropriate form control (input/select/textarea) */}
          {renderComponent(controlItem)}
        </div>
      ))}
    </div>
  );
};

export default FormControl;
