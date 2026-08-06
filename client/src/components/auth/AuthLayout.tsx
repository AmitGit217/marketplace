import { Box, Center } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <Center
      minH="100vh"
      bg="surface"
      px={4}
    >
      <Box w="100%" maxW="450px">
        {children}
      </Box>
    </Center>
  );
}