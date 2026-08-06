import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface RegisterData {
  fullName: string;
  userEmail: string;
  userPassword: string;
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
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Field.Root invalid={!!errors.fullName}>
          <Field.Label>Name</Field.Label>

          <Input
            autoComplete="off"
            spellCheck={false}
            {...register("fullName", {
              required: "Name is required",
            })}
          />

          <Field.ErrorText>
            {errors.fullName?.message}
          </Field.ErrorText>
        </Field.Root>

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
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
          />

          <Field.ErrorText>
            {errors.userPassword?.message}
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