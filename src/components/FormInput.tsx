import { Field } from "formik";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

interface FormInputProps {
  name: string;
  label?: string;
  type: string;
  error?: string;
  touched?: boolean;
  leftElement?: string | React.ReactNode;
}

const FormInput = ({
  name,
  label,
  type,
  error,
  touched,
  leftElement,
}: FormInputProps) => {
  return (
    <FormControl mb="10px" isInvalid={touched && !!error}>
      {label && <FormLabel fontWeight={300}>{label}</FormLabel>}
      <InputGroup>
        {leftElement && (
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
            w="32px"
            h="32px"
            children={leftElement}
          />
        )}
        <Input
          as={Field}
          size="sm"
          type={type}
          name={name}
          bg="white"
          fontWeight={300}
          shadow="sm"
          focusBorderColor="teal.400"
          borderRadius={5}
          pl={leftElement ? "30px" : ""}
        />
      </InputGroup>
      {touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormInput;
