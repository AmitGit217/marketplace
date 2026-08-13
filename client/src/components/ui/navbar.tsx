import { ColorModeButton } from "@/components/ui/color-mode";
import { useAuth } from "@/context/authContext";
import {
  Avatar,
  Box,
  Button,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import {
  LuCar,
  LuChevronDown,
  LuLayoutDashboard,
  LuLogOut,
  LuReceipt,
  LuShield,
  LuUser,
  LuUsers,
} from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const isAdmin = user?.role === "admin";

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      gap={2}
      px={{ base: 3, md: 6 }}
      py={3}
      borderBottom="1px solid"
      borderColor="blackAlpha.100"
      _dark={{
        borderColor: "whiteAlpha.100",
      }}
    >
      {isLoggedIn && user && (
        <Box
          display={{ base: "none", lg: "flex" }}
          alignItems="center"
          gap={1}
          mr="auto"
        >
          <NavButton to="/dashboard" icon={<LuLayoutDashboard />}>
            Dashboard
          </NavButton>

          <NavButton to="/vehicles" icon={<LuCar />}>
            Vehicles
          </NavButton>

          <NavButton to="/sales" icon={<LuReceipt />}>
            Sales
          </NavButton>

          <NavButton to="/clients" icon={<LuUsers />}>
            Clients
          </NavButton>

          {isAdmin && (
            <NavButton to="/personnel" icon={<LuShield />}>
              Personnel
            </NavButton>
          )}
        </Box>
      )}

      <ColorModeButton />

      {isLoggedIn && user && (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              px={2}
              borderRadius="xl"
              gap={2}
              transition="all 0.2s"
              _hover={{
                bg: "blackAlpha.50",
                _dark: {
                  bg: "whiteAlpha.100",
                },
              }}
            >
              <Avatar.Root size="xs">
                <Avatar.Fallback name={user.name} />
              </Avatar.Root>

              <Text
                fontSize="sm"
                fontWeight="500"
                display={{ base: "none", sm: "block" }}
              >
                {user.name}
              </Text>

              <LuChevronDown />
            </Button>
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content
                minW="240px"
                p={2}
                borderRadius="xl"
                boxShadow="lg"
              >
                {/* User information */}
                <Box
                  px={3}
                  py={3}
                  mb={1}
                  borderRadius="lg"
                  bg="blackAlpha.50"
                  _dark={{
                    bg: "whiteAlpha.50",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name={user.name} />
                    </Avatar.Root>

                    <Box minW={0}>
                      <Text fontSize="sm" fontWeight="600" truncate>
                        {user.name}
                      </Text>

                      <Text fontSize="xs" color="fg.muted" truncate>
                        {user.email}
                      </Text>
                    </Box>
                  </Box>
                </Box>

                {/* Mobile navigation */}
                <Box display={{ base: "block", lg: "none" }}>
                  <Menu.Item value="dashboard" asChild>
                    <Link to="/dashboard">
                      <LuLayoutDashboard />
                      Dashboard
                    </Link>
                  </Menu.Item>

                  <Menu.Item value="vehicles" asChild>
                    <Link to="/vehicles">
                      <LuCar />
                      Vehicles
                    </Link>
                  </Menu.Item>

                  <Menu.Item value="sales" asChild>
                    <Link to="/sales">
                      <LuReceipt />
                      Sales
                    </Link>
                  </Menu.Item>

                  <Menu.Item value="clients" asChild>
                    <Link to="/clients">
                      <LuUsers />
                      Clients
                    </Link>
                  </Menu.Item>

                  {isAdmin && (
                    <Menu.Item value="personnel" asChild>
                      <Link to="/personnel">
                        <LuShield />
                        Personnel
                      </Link>
                    </Menu.Item>
                  )}

                  <Menu.Separator my={2} />
                </Box>

                {/* Account */}
                <Menu.Item value="profile" asChild>
                  <Link to="/profile">
                    <LuUser />
                    Profile
                  </Link>
                </Menu.Item>

                <Menu.Separator my={2} />

                <Menu.Item
                  value="logout"
                  color="red.500"
                  onClick={handleLogout}
                >
                  <LuLogOut />
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )}
    </Box>
  );
}

interface NavButtonProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavButton({ to, icon, children }: NavButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      borderRadius="lg"
      gap={2}
      fontWeight="500"
      _hover={{
        bg: "blackAlpha.50",
        _dark: {
          bg: "whiteAlpha.100",
        },
      }}
    >
      <Link to={to}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}