import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendar,
  LuMail,
  LuPencil,
  LuUser,
} from "react-icons/lu";

import type { User } from "@/types/user";
import { usersApi } from "@/api/users";

export default function PersonnelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadPerson = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data =
          await usersApi.getById(
            Number(id)
          );

        setPerson(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadPerson();
  }, [id]);

  if (isLoading) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
      >
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (!person) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Heading size="md">
          Personnel member not found
        </Heading>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/personnel")
          }
        >
          <LuArrowLeft />
          Back to personnel
        </Button>
      </Flex>
    );
  }

  const sales = person.sales ?? [];

  return (
    <Box maxW="1200px" mx="auto">
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate("/personnel")
          }
        >
          <LuArrowLeft />
          Back to personnel
        </Button>

        <Button
          colorPalette="brand"
          onClick={() => {
            // Edit later
          }}
        >
          <LuPencil />
          Edit personnel
        </Button>
      </Flex>

      {/* Personnel overview */}
      <Card.Root
        borderRadius="2xl"
        shadow="sm"
      >
        <Card.Body p={{ base: 5, md: 8 }}>
          <HStack
            align="start"
            gap={4}
          >
            <Flex
              w="56px"
              h="56px"
              align="center"
              justify="center"
              borderRadius="xl"
              bg="colorPalette.subtle"
              color="colorPalette.fg"
              flexShrink={0}
            >
              <LuUser size={26} />
            </Flex>

            <Box>
              <Heading
                size={{
                  base: "xl",
                  md: "2xl",
                }}
              >
                {person.name}
              </Heading>

              <HStack mt={2} gap={2}>
                <Badge
                  colorPalette="brand"
                  variant="subtle"
                >
                  {person.role}
                </Badge>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Employee #{person.id}
                </Text>
              </HStack>
            </Box>
          </HStack>

          <Separator my={6} />

          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
            }}
            gap={6}
          >
            <PersonnelField
              icon={<LuMail />}
              label="Email"
              value={person.email}
            />

            <PersonnelField
              icon={<LuCalendar />}
              label="Sales handled"
              value={String(sales.length)}
            />
          </SimpleGrid>

          {person.preferences && (
            <>
              <Separator my={6} />

              <Box>
                <Text
                  fontSize="sm"
                  color="fg.muted"
                  mb={2}
                >
                  Preferences
                </Text>

                <Text fontSize="sm">
                  {person.preferences}
                </Text>
              </Box>
            </>
          )}
        </Card.Body>
      </Card.Root>

      {/* Sales history */}
      <Card.Root
        mt={6}
        borderRadius="2xl"
        shadow="sm"
      >
        <Card.Body p={{ base: 5, md: 8 }}>
          <Flex
            justify="space-between"
            align="center"
            mb={5}
          >
            <Box>
              <Heading size="md">
                Sales handled
              </Heading>

              <Text
                fontSize="sm"
                color="fg.muted"
                mt={1}
              >
                Sales created by this employee
              </Text>
            </Box>

            <Badge
              colorPalette="brand"
              variant="subtle"
            >
              {sales.length}{" "}
              {sales.length === 1
                ? "sale"
                : "sales"}
            </Badge>
          </Flex>

          {sales.length === 0 ? (
            <Flex
              minH="120px"
              align="center"
              justify="center"
            >
              <Text color="fg.muted">
                No sales yet.
              </Text>
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table.Root
                variant="outline"
                size="sm"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>
                      Sale ID
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Vehicle
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Client
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Sale date
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Payment
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {sales.map((sale) => (
                    <Table.Row
                      key={sale.id}
                      cursor="pointer"
                      onClick={() =>
                        navigate(
                          `/sales/${sale.id}`
                        )
                      }
                      _hover={{
                        bg: "blackAlpha.50",
                        _dark: {
                          bg: "whiteAlpha.50",
                        },
                      }}
                    >
                      <Table.Cell>
                        #{sale.id}
                      </Table.Cell>

                      <Table.Cell>
                        <Text fontWeight="600">
                          {sale.vehicle
                            ? `${sale.vehicle.brand} ${sale.vehicle.model}`
                            : sale.vehicleId}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        {sale.client?.name ??
                          `Client #${sale.clientId}`}
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(
                          sale.saleDate
                        ).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell>
                        {sale.paymentMethod}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

interface PersonnelFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function PersonnelField({
  icon,
  label,
  value,
}: PersonnelFieldProps) {
  return (
    <HStack
      align="start"
      gap={3}
    >
      <Flex
        w="36px"
        h="36px"
        align="center"
        justify="center"
        borderRadius="lg"
        bg="colorPalette.subtle"
        color="colorPalette.fg"
      >
        {icon}
      </Flex>

      <Box>
        <Text
          fontSize="xs"
          color="fg.muted"
        >
          {label}
        </Text>

        <Text
          fontSize="sm"
          fontWeight="600"
        >
          {value}
        </Text>
      </Box>
    </HStack>
  );
}