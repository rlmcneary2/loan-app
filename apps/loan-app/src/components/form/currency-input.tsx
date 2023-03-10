import type React from "react";
import { useEffect, useState } from "react";
import type { CurrencyNumberInputProps } from "@bitovi/react-numerics";
import { CurrencyNumberInput } from "@bitovi/react-numerics";

export function CurrencyInput({ value, ...props }: CurrencyInputProps) {
  const [numericValue, setNumericValue] = useState<string>("");

  useEffect(() => {
    setNumericValue(`${value ?? ""}`);
  }, [value]);

  const handleNumericChange: CurrencyNumberInputProps["onNumericChange"] =
    e => {
      setNumericValue(e);
    };

  return (
    <CurrencyNumberInput
      {...props}
      numericValue={numericValue}
      onNumericChange={handleNumericChange}
    />
  );
}

export interface CurrencyInputProps
  extends Omit<
    CurrencyNumberInputProps,
    "numericValue" | "onNumericChange" | "type"
  > {
  value?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["value"];
}
