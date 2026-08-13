import { authApi } from "@/api/authApi";
import { useAuth } from "@/context/authContext";
import type { RegisterDto } from "@/types/auth";
import {
  Button,
  Field,
  IconButton,
  Input,
  InputGroup,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  fullName: string;
  userEmail: string;
  userPassword: string;
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    const registerData: RegisterDto = {
      name: data.fullName,
      email: data.userEmail,
      password: data.userPassword,
    };

    setIsLoading(true);

    try {
      const response = await authApi.register(registerData);

     await login();
      console.log(response.user);

      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      setError("root", {
        type: "server",
        message,
      });
    } finally {
      setIsLoading(false);
    }
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

          <InputGroup
            endElement={
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </IconButton>
            }
          >
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("userPassword", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
              })}
            />
          </InputGroup>

          <Field.ErrorText>
            {errors.userPassword?.message}
          </Field.ErrorText>
        </Field.Root>

        {errors.root?.message && (
          <Field.Root invalid>
            <Field.ErrorText>
              {errors.root.message}
            </Field.ErrorText>
          </Field.Root>
        )}

        <Button
          colorPalette="brand"
          type="submit"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Register"}
        </Button>
      </Stack>
    </form>
  );
}