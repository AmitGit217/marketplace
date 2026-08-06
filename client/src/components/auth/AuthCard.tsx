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
      bg="surface"
      p={{ base: 6, md: 8 }}
      rounded="xl"
      borderWidth="1px"
      borderColor="border"
      shadow="card"
      backdropFilter="blur(12px)"
      w="full"
    >
      <VStack align="stretch" gap={6}>
        <Box>
          <Heading color="text" size="lg">
            {title}
          </Heading>

          <Text mt={2} color="fg.muted">
            {subtitle}
          </Text>
        </Box>

        {children}
      </VStack>
    </Box>
  );
}