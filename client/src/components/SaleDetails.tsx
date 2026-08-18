import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Image,
  Separator,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendar,
  LuCar,
  LuCreditCard,
  LuMail,
  LuUser,
} from "react-icons/lu";

import type { Sale } from "@/types/sale";
import { salesApi } from "@/api/sales";

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState<Sale | null>(
    null
  );

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadSale = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await salesApi.getById(
          Number(id)
        );

        setSale(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadSale();
  }, [id]);

  if (isLoading) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
      >
        <Spinner
          size="xl"
          colorPalette="brand"
        />
      </Flex>
    );
  }

  if (!sale) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Heading size="md">
          Sale not found
        </Heading>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/sales")
          }
        >
          <LuArrowLeft />
          Back to sales
        </Button>
      </Flex>
    );
  }

  const saleDate = new Date(
    sale.saleDate
  ).toLocaleDateString();

  const deliveryDate = new Date(
    sale.deliveryDate
  ).toLocaleDateString();

  const acquisitionDate = new Date(
    sale.vehicle.acquisitionDate
  ).toLocaleDateString();

  return (
    <Box maxW="1400px" mx="auto">
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
            navigate("/sales")
          }
        >
          <LuArrowLeft />
          Back to sales
        </Button>

        <Badge
          size="lg"
          colorPalette="green"
        >
          Completed sale
        </Badge>
      </Flex>

      {/* Main sale card */}
      <Card.Root
        overflow="hidden"
        borderRadius="2xl"
        shadow="sm"
      >
        <Flex
          direction={{
            base: "column",
            lg: "row",
          }}
        >
          {/* Vehicle image */}
          <Box
            position="relative"
            flex="1"
            minH={{
              base: "280px",
              md: "400px",
              lg: "500px",
            }}
            bg="gray.100"
            _dark={{
              bg: "gray.800",
            }}
          >
            <Image
              src={sale.vehicle.image}
              alt={`${sale.vehicle.brand} ${sale.vehicle.model}`}
              w="100%"
              h="100%"
              minH={{
                base: "280px",
                md: "400px",
                lg: "500px",
              }}
              objectFit="cover"
            />

            <Badge
              position="absolute"
              top={4}
              right={4}
              colorPalette="red"
              size="lg"
            >
              SOLD
            </Badge>
          </Box>

          {/* Sale information */}
          <Box
            flex="1"
            p={{ base: 5, md: 8 }}
          >
            <Text
              fontSize="sm"
              color="fg.muted"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Sale #{sale.id}
            </Text>

            <Heading
              mt={1}
              size={{
                base: "xl",
                md: "2xl",
              }}
            >
              {sale.vehicle.brand}{" "}
              {sale.vehicle.model}
            </Heading>

            <Text
              mt={2}
              color="fg.muted"
            >
              {sale.vehicle.manufactureYear} ·{" "}
              {sale.vehicle.type} ·{" "}
              {sale.vehicle.color}
            </Text>

            <Separator my={6} />

            {/* Price */}
            <Box>
              <Text
                fontSize="sm"
                color="fg.muted"
                mb={1}
              >
                Sale price
              </Text>

              <Text
                fontSize={{
                  base: "3xl",
                  md: "4xl",
                }}
                fontWeight="700"
                color="colorPalette.500"
              >
                €
                {Number(
                  sale.vehicle.price
                ).toLocaleString()}
              </Text>
            </Box>

            <Separator my={6} />

            {/* Sale dates/payment */}
            <SimpleGrid
              columns={{
                base: 1,
                sm: 2,
              }}
              gap={5}
            >
              <DetailItem
                icon={<LuCalendar />}
                label="Sale date"
                value={saleDate}
              />

              <DetailItem
                icon={<LuCalendar />}
                label="Delivery date"
                value={deliveryDate}
              />

              <DetailItem
                icon={<LuCreditCard />}
                label="Payment method"
                value={sale.paymentMethod}
              />

              <DetailItem
                icon={<LuCar />}
                label="Vehicle"
                value={`${sale.vehicle.brand} ${sale.vehicle.model}`}
              />
            </SimpleGrid>
          </Box>
        </Flex>
      </Card.Root>

      {/* Client + employee */}
      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
        }}
        gap={6}
        mt={6}
      >
        {/* Client */}
        <Card.Root
          borderRadius="2xl"
          shadow="sm"
        >
          <Card.Body p={{ base: 5, md: 8 }}>
            <HStack mb={5}>
              <Flex
                w="40px"
                h="40px"
                align="center"
                justify="center"
                borderRadius="lg"
                bg="colorPalette.subtle"
                color="colorPalette.fg"
              >
                <LuUser />
              </Flex>

              <Box>
                <Heading size="md">
                  Client
                </Heading>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Customer information
                </Text>
              </Box>
            </HStack>

            <SimpleGrid gap={4}>
              <InfoRow
                label="Name"
                value={sale.client.name}
              />

              <InfoRow
                label="Email"
                value={
                  sale.client.email ??
                  "No email"
                }
              />

              <InfoRow
                label="Client ID"
                value={String(
                  sale.client.id
                )}
              />
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {/* Employee */}
        <Card.Root
          borderRadius="2xl"
          shadow="sm"
        >
          <Card.Body p={{ base: 5, md: 8 }}>
            <HStack mb={5}>
              <Flex
                w="40px"
                h="40px"
                align="center"
                justify="center"
                borderRadius="lg"
                bg="colorPalette.subtle"
                color="colorPalette.fg"
              >
                <LuUser />
              </Flex>

              <Box>
                <Heading size="md">
                  Sale handled by
                </Heading>

                <Text
                  fontSize="sm"
                  color="fg.muted"
                >
                  Employee information
                </Text>
              </Box>
            </HStack>

            <SimpleGrid gap={4}>
              <InfoRow
                label="Name"
                value={sale.user.name}
              />

              <InfoRow
                label="Email"
                value={sale.user.email}
              />

              <InfoRow
                label="User ID"
                value={String(
                  sale.user.id
                )}
              />
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      {/* Vehicle information */}
      <Card.Root
        mt={6}
        borderRadius="2xl"
        shadow="sm"
      >
        <Card.Body p={{ base: 5, md: 8 }}>
          <HStack mb={5}>
            <Flex
              w="40px"
              h="40px"
              align="center"
              justify="center"
              borderRadius="lg"
              bg="colorPalette.subtle"
              color="colorPalette.fg"
            >
              <LuCar />
            </Flex>

            <Box>
              <Heading size="md">
                Vehicle information
              </Heading>

              <Text
                fontSize="sm"
                color="fg.muted"
              >
                Vehicle sold in this transaction
              </Text>
            </Box>
          </HStack>

          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
            }}
            gap={6}
          >
            <InfoRow
              label="Vehicle ID"
              value={sale.vehicle.id}
            />

            <InfoRow
              label="Brand"
              value={sale.vehicle.brand}
            />

            <InfoRow
              label="Model"
              value={sale.vehicle.model}
            />

            <InfoRow
              label="Type"
              value={sale.vehicle.type}
            />

            <InfoRow
              label="Manufacture year"
              value={String(
                sale.vehicle.manufactureYear
              )}
            />

            <InfoRow
              label="Mileage"
              value={`${sale.vehicle.mileage.toLocaleString()} km`}
            />

            <InfoRow
              label="Condition"
              value={sale.vehicle.condition}
            />

            <InfoRow
              label="Color"
              value={sale.vehicle.color}
            />

            <InfoRow
              label="Acquisition date"
              value={acquisitionDate}
            />

            <InfoRow
              label="Vehicle status"
              value={sale.vehicle.status}
            />
          </SimpleGrid>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

/* =========================
   Detail Item
========================= */

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({
  icon,
  label,
  value,
}: DetailItemProps) {
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
        flexShrink={0}
      >
        {icon}
      </Flex>

      <Box>
        <Text
          fontSize="xs"
          color="fg.muted"
          mb={0.5}
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

/* =========================
   Info Row
========================= */

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <Flex
      justify="space-between"
      gap={4}
      borderBottomWidth="1px"
      pb={3}
    >
      <Text
        fontSize="sm"
        color="fg.muted"
      >
        {label}
      </Text>

      <Text
        fontSize="sm"
        fontWeight="500"
        textAlign="right"
        wordBreak="break-word"
      >
        {value}
      </Text>
    </Flex>
  );
}