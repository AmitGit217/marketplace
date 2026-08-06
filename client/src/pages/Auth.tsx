import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout>
      <AuthCard
        title={isLogin ? "Welcome back" : "Create account"}
        subtitle={
          isLogin
            ? "Login to manage your dealership."
            : "Create an account to start managing your vehicles."
        }
      >
        {isLogin ? <LoginForm /> : <RegisterForm />}

        <Button
          mt={6}
          variant="ghost"
          width="full"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </AuthCard>
    </AuthLayout>
  );
}