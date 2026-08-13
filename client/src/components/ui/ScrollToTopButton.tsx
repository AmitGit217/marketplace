import { useEffect, useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { LuArrowUp } from "react-icons/lu";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      right={{ base: 4, md: 6 }}
      bottom={{ base: 4, md: 6 }}
      zIndex={1000}
    >
      <IconButton
        aria-label="Scroll to top"
        onClick={scrollToTop}
        size="md"
        borderRadius="full"
        variant="solid"
        colorPalette="brand"
        boxShadow="lg"
        transition="all 0.2s"
        _hover={{
          transform: "translateY(-3px)",
          boxShadow: "xl",
        }}
        _active={{
          transform: "translateY(0)",
        }}
      >
        <LuArrowUp />
      </IconButton>
    </Box>
  );
}