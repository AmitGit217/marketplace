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

import type { Client } from "@/types/client";
import { clientsApi } from "@/api/clients";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] =
    useState<Client | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data =
          await clientsApi.getById(
            Number(id)
          );

        setClient(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
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

  if (!client) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Heading size="md">
          Client not found
        </Heading>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/clients")
          }
        >
          <LuArrowLeft />
          Back to clients
        </Button>
      </Flex>
    );
  }

  const sales = client.sales ?? [];

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
            navigate("/clients")
          }
        >
          <LuArrowLeft />
          Back to clients
        </Button>

        <Button
          colorPalette="brand"
          onClick={() =>
    navigate(`/clients/${client.id}/edit`)
}
        >
          <LuPencil />
          Edit client
        </Button>
      </Flex>

      {/* Client overview */}
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
                {client.name}
              </Heading>

              <Text
                mt={1}
                color="fg.muted"
              >
                Client #{client.id}
              </Text>
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
            <ClientField
              icon={<LuMail />}
              label="Email"
              value={
                client.email ??
                "No email"
              }
            />

            <ClientField
              icon={<LuCalendar />}
              label="Purchases"
              value={`${sales.length}`}
            />
          </SimpleGrid>

          {client.preferences && (
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
                  {client.preferences}
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
                Sales history
              </Heading>

              <Text
                fontSize="sm"
                color="fg.muted"
                mt={1}
              >
                Vehicles purchased by this
                client
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
                No purchases yet.
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
                      Vehicle
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Sale date
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Payment
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Delivery
                    </Table.ColumnHeader>

                    <Table.ColumnHeader>
                      Price
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
                        <Text fontWeight="600">
                          {sale.vehicle
                            ? `${sale.vehicle.brand} ${sale.vehicle.model}`
                            : sale.vehicleId}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(
                          sale.saleDate
                        ).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell>
                        {sale.paymentMethod}
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(
                          sale.deliveryDate
                        ).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell>
                        €
                        {sale.vehicle
                          ? Number(
                              sale.vehicle
                                .price
                            ).toLocaleString()
                          : "-"}
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

interface ClientFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ClientField({
  icon,
  label,
  value,
}: ClientFieldProps) {
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