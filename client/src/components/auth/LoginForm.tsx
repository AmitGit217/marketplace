import { authApi } from "@/api/authApi";
import { useAuth } from "@/context/authContext";
import type { LoginDto } from "@/types/auth";
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


export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginDto>();

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true);

    try {
      const response = await authApi.login(data);
      await login();

      console.log(response.user);
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";

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
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>

          <Input
            type="email"
            autoComplete="new-email"
            spellCheck={false}
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

          <InputGroup
            endElement={
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </IconButton>
            }
          >
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </InputGroup>

          <Field.ErrorText>
            {errors.password?.message}
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
          type="submit"
          size="lg"
          colorPalette="brand"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Login"}
        </Button>
      </Stack>
    </form>
  );
}