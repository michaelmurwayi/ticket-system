import type { FormEvent, FormHTMLAttributes, ReactNode } from "react";
import Stack from "@mui/material/Stack";
import type { SxProps, Theme } from "@mui/material/styles";

interface FormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> {
  children: ReactNode;
  spacing?: number;
  sx?: SxProps<Theme>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function Form({
  children,
  spacing = 2,
  sx,
  onSubmit,
  ...rest
}: FormProps) {
  return (
    <Stack
      component="form"
      spacing={spacing}
      sx={sx}
      onSubmit={onSubmit}
      noValidate
      {...rest}
    >
      {children}
    </Stack>
  );
}
