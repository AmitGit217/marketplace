import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface LoginData {
  userEmail: string;
  userPassword: string;
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    console.log(data);
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Field.Root invalid={!!errors.userEmail}>
          <Field.Label>Email</Field.Label>

          <Input
            type="email"
            autoComplete="new-email"
            spellCheck={false}
            {...register("userEmail", {
              required: "Email is required",
            })}
          />

          <Field.ErrorText>
            {errors.userEmail?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.userPassword}>
          <Field.Label>Password</Field.Label>

          <Input
            type="password"
            autoComplete="new-password"
            {...register("userPassword", {
              required: "Password is required",
            })}
          />

          <Field.ErrorText>
            {errors.userPassword?.message}
          </Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          size="lg"
          colorPalette="brand"
        >
          Login
        </Button>
      </Stack>
    </form>
  );
}