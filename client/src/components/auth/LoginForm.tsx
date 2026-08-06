import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface LoginData {
  email: string;
  password: string;
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>

          <Input
            {...register("email", {
              required: "Email is required",
            })}
          />

          <Field.ErrorText>
            {errors.email?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>

          <Input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />

          <Field.ErrorText>
            {errors.password?.message}
          </Field.ErrorText>
        </Field.Root>

        <Button
          colorPalette="brand"
          type="submit"
          size="lg"
        >
          Login
        </Button>
      </Stack>
    </form>
  );
}