import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { LuPalette } from "react-icons/lu";

export function parseRgbColor(color: string) {
  const match = color.match(
    /\(?\s*(\d+)\s*[,.]\s*(\d+)\s*[,.]\s*(\d+)\s*\)?/
  );

  if (!match) return null;

  const [, r, g, b] = match;

  return `rgb(${r}, ${g}, ${b})`;
}
interface ColorSpecificationProps {
  color: string;
}

function ColorSpecification({
  color,
}: ColorSpecificationProps) {
  const cssColor = parseRgbColor(color);

  return (
    <HStack align="start" gap={3}>
      <Flex
        w="36px"
        h="36px"
        align="center"
        justify="center"
        borderRadius="lg"
        bg="colorPalette.subtle"
        color="colorPalette.fg"
        flexShrink={0}
      >
        <LuPalette />
      </Flex>

      <Box>
        <Text
          fontSize="xs"
          color="fg.muted"
          mb={0.5}
        >
          Color
        </Text>

        {cssColor && (
          <Box
            w="32px"
            h="32px"
            borderRadius="full"
            bg={cssColor}
            borderWidth="1px"
            borderColor="border"
          />
        )}
      </Box>
    </HStack>
  );
}

export { ColorSpecification };

