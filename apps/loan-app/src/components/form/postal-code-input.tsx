import type React from "react";
import { useEffect, useState } from "react";
import type { PostalCodeNumberInputProps } from "@bitovi/react-numerics";
import { PostalCodeNumberInput } from "@bitovi/react-numerics";

export function PostalCodeInput({ value, ...props }: PostalCodeInputProps) {
  const [numericValue, setNumericValue] = useState<string>("");

  useEffect(() => {
    setNumericValue(`${value ?? ""}`);
  }, [value]);

  const handleNumericChange: PostalCodeNumberInputProps["onNumericChange"] =
    e => {
      setNumericValue(e);
    };

  return (
    <PostalCodeNumberInput
      {...props}
      numericValue={numericValue}
      onNumericChange={handleNumericChange}
    />
  );
}

export interface PostalCodeInputProps
  extends Omit<
    PostalCodeNumberInputProps,
    "numericValue" | "onNumericChange" | "type"
  > {
  value?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["value"];
}
