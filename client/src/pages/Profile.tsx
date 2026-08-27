import { useAuth } from "@/context/authContext";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
} from "@chakra-ui/react";
import {
  LuLogOut,
  LuMail,
  LuShield,
  LuUser,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <Flex
        minH="100%"
        align="center"
        justify="center"
        p={6}
      >
        <Text color="fg.muted">
          No user information available.
        </Text>
      </Flex>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      w="full"
      maxW="800px"
      mx="auto"
      p={{ base: 4, md: 8 }}
      minW="0"
    >
      <Card.Root
        w="full"
        borderRadius="2xl"
        shadow="sm"
        overflow="hidden"
      >
        <Card.Body p={{ base: 5, md: 8 }}>
          {/* Profile header */}
          <Flex
            align={{
              base: "flex-start",
              sm: "center",
            }}
            direction={{
              base: "column",
              sm: "row",
            }}
            gap={5}
          >
            <Avatar.Root size="2xl">
              <Avatar.Fallback>
                {initials || "U"}
              </Avatar.Fallback>
            </Avatar.Root>

            <Box minW="0">
              <Heading
                size="lg"
                wordBreak="break-word"
              >
                {user.name}
              </Heading>

              <Text
                mt={1}
                color="fg.muted"
                wordBreak="break-word"
              >
                {user.email}
              </Text>

              <Badge
                mt={3}
                colorPalette="blue"
              >
                {user.role}
              </Badge>
            </Box>
          </Flex>

          <Separator my={8} />

          {/* Account information */}
          <Heading size="md" mb={5}>
            Account information
          </Heading>

          <Flex direction="column" gap={5}>
            {/* Name */}
            <Flex align="center" gap={4}>
              <Box
                p={3}
                borderRadius="lg"
                bg="bg.muted"
                flexShrink={0}
              >
                <LuUser />
              </Box>

              <Box minW="0">
                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Name
                </Text>

                <Text
                  fontWeight="medium"
                  wordBreak="break-word"
                >
                  {user.name}
                </Text>
              </Box>
            </Flex>

            {/* Email */}
            <Flex align="center" gap={4}>
              <Box
                p={3}
                borderRadius="lg"
                bg="bg.muted"
                flexShrink={0}
              >
                <LuMail />
              </Box>

              <Box minW="0">
                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Email
                </Text>

                <Text
                  fontWeight="medium"
                  wordBreak="break-word"
                >
                  {user.email}
                </Text>
              </Box>
            </Flex>

            {/* Role */}
            <Flex align="center" gap={4}>
              <Box
                p={3}
                borderRadius="lg"
                bg="bg.muted"
                flexShrink={0}
              >
                <LuShield />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Role
                </Text>

                <Text fontWeight="medium">
                  {user.role}
                </Text>
              </Box>
            </Flex>
          </Flex>

          <Separator my={8} />

          {/* Actions */}
          <Flex justify="flex-end">
            <Button
              colorPalette="red"
              onClick={handleLogout}
            >
              <LuLogOut />
              Logout
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}