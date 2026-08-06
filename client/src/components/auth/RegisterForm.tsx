import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = (data: RegisterData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Field.Root invalid={!!errors.name}>
          <Field.Label>Name</Field.Label>

          <Input
            {...register("name", {
              required: "Name is required",
            })}
          />

          <Field.ErrorText>
            {errors.name?.message}
          </Field.ErrorText>
        </Field.Root>

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
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
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
          Register
        </Button>
      </Stack>
    </form>
  );
}