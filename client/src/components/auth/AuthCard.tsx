import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <Box
      bg="white"
      p={8}
      rounded="xl"
      shadow="card"
      borderWidth="1px"
      borderColor="border"
    >
      <VStack align="stretch" gap={6}>
        <Box>
          <Heading size="lg">{title}</Heading>

          <Text mt={2} color="gray.500">
            {subtitle}
          </Text>
        </Box>

        {children}
      </VStack>
    </Box>
  );
}