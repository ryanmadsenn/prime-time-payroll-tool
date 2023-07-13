import { Field } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";

interface FormSelectProps {
  name: string;
  label?: string;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}

const FormSelect = ({
  name,
  label,
  error,
  touched,
  children,
}: FormSelectProps) => {
  return (
    <FormControl mb="10px" isInvalid={touched && !!error}>
      {label && <FormLabel fontWeight={300}>{label}</FormLabel>}
      <Field
        as={Select}
        size="sm"
        type="text"
        name={name}
        bg="white"
        shadow="sm"
        focusBorderColor="teal.400"
        borderRadius="5px"
        style={{
          fontWeight: 300,
        }}
      >
        {children}
      </Field>
      {touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormSelect;
