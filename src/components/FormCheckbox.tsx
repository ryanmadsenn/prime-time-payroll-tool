import { Field } from "formik";
import { Checkbox } from "@chakra-ui/react";

interface FormCheckboxProps {
  label: string;
  name: string;
  value: string;
}

const FormCheckbox = ({ label, name, value }: FormCheckboxProps) => {
  return (
    <Field
      as={Checkbox}
      name={name}
      value={value}
      type="checkbox"
      colorScheme="teal"
      size="sm"
    >
      {label}
    </Field>
  );
};

export default FormCheckbox;
