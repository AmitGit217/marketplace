import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Separator,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendar,
  LuCar,
  LuCircleGauge,
  LuPencil,
  LuTag,
  LuWrench,
} from "react-icons/lu";

import type { Vehicle } from "@/types/vehicle";
import { vehiclesApi } from "@/api/vehicles";
import { ColorSpecification } from "@/utils/ColorSpecification";
import { ROUTES } from "@/utils/consts";

const formatCurrency = (value: number | string) =>
  `€${Number(value).toLocaleString()}`;

const formatNumber = (value: number) =>
  value.toLocaleString();

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString();

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const loadVehicle = async () => {
      try {
        const data = await vehiclesApi.getById(id);
        setVehicle(data);
      } catch (error) {
        console.error("Failed to load vehicle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <Spinner size="xl" colorPalette="brand" />
      </Flex>
    );
  }

  if (!vehicle) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Heading size="md">Vehicle not found</Heading>

        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.vehicles)}
        >
          <LuArrowLeft />
          Back to vehicles
        </Button>
      </Flex>
    );
  }

  const vehicleName = `${vehicle.brand} ${vehicle.model}`;

  return (
    <Box maxW="1400px" mx="auto">
      {/* Navigation */}
      <Flex justify="space-between" align="center" mb={6}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.vehicles)}
        >
          <LuArrowLeft />
          Back to vehicles
        </Button>

        <Button
          colorPalette="brand"
          onClick={() =>
            navigate(ROUTES.vehicleEdit(vehicle.id))
          }
        >
          <LuPencil />
          Edit vehicle
        </Button>
      </Flex>

      {/* Main vehicle card */}
      <Card.Root overflow="hidden" borderRadius="xl" shadow="sm">
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1.1fr 1fr",
          }}
        >
          {/* Image */}
          <Box
            position="relative"
            bg="surfaceAlt"
            minH={{
              base: "280px",
              md: "400px",
              lg: "500px",
            }}
          >
            <Image
              src={vehicle.image}
              alt={vehicleName}
              w="100%"
              h="100%"
              minH={{
                base: "280px",
                md: "400px",
                lg: "500px",
              }}
              objectFit="cover"
            />

            <Box position="absolute" top={4} right={4}>
              <Box
                as="span"
                px={3}
                py={1}
                borderRadius="full"
                bg={
                  vehicle.status === "available"
                    ? "success"
                    : "surfaceAlt"
                }
                color={
                  vehicle.status === "available"
                    ? "white"
                    : "text"
                }
                fontSize="sm"
                fontWeight="600"
              >
                {vehicle.status}
              </Box>
            </Box>
          </Box>

          {/* Information */}
          <Box p={{ base: 5, md: 8 }}>
            <Flex direction="column" h="100%">
              <Box>
                <Text
                  fontSize="sm"
                  color="fg.muted"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  mb={1}
                >
                  {vehicle.type}
                </Text>

                <Heading
                  size={{
                    base: "xl",
                    md: "2xl",
                  }}
                >
                  {vehicleName}
                </Heading>

                <Text color="fg.muted" mt={2}>
                  {vehicle.manufactureYear}
                </Text>
              </Box>

              <Separator my={6} />

              {/* Price */}
              <Box>
                <Text fontSize="sm" color="fg.muted" mb={1}>
                  Price
                </Text>

                <Text
                  fontSize={{
                    base: "3xl",
                    md: "4xl",
                  }}
                  fontWeight="700"
                  color="colorPalette.500"
                >
                  {formatCurrency(vehicle.price)}
                </Text>
              </Box>

              <Separator my={6} />

              {/* Specifications */}
              <SimpleGrid
                columns={{
                  base: 1,
                  sm: 2,
                }}
                gap={5}
              >
                <Specification
                  icon={<LuCar />}
                  label="Type"
                  value={vehicle.type}
                />

                <Specification
                  icon={<LuCalendar />}
                  label="Year"
                  value={String(vehicle.manufactureYear)}
                />

                <Specification
                  icon={<LuCircleGauge />}
                  label="Mileage"
                  value={`${formatNumber(vehicle.mileage)} km`}
                />

                <Specification
                  icon={<LuWrench />}
                  label="Condition"
                  value={vehicle.condition}
                />

                <ColorSpecification color={vehicle.color} />

                <Specification
                  icon={<LuTag />}
                  label="Status"
                  value={vehicle.status}
                />
              </SimpleGrid>

              <Box mt="auto" pt={8}>
                <Text fontSize="xs" color="fg.muted">
                  Acquired on {formatDate(vehicle.acquisitionDate)}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Grid>
      </Card.Root>

      {/* Additional information */}
      <Card.Root mt={6} borderRadius="xl" shadow="sm">
        <Card.Body p={{ base: 5, md: 8 }}>
          <Heading size="md" mb={5}>
            Vehicle information
          </Heading>

          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
            }}
            gap={6}
          >
            <InfoRow
              label="Vehicle ID"
              value={String(vehicle.id)}
            />

            <InfoRow label="Brand" value={vehicle.brand} />

            <InfoRow label="Model" value={vehicle.model} />

            <InfoRow label="Type" value={vehicle.type} />

            <InfoRow
              label="Manufacture year"
              value={String(vehicle.manufactureYear)}
            />

            <InfoRow
              label="Mileage"
              value={`${formatNumber(vehicle.mileage)} km`}
            />

            <InfoRow
              label="Condition"
              value={vehicle.condition}
            />

            <InfoRow
              label="Acquisition date"
              value={formatDate(vehicle.acquisitionDate)}
            />

            <InfoRow
              label="Status"
              value={vehicle.status}
            />
          </SimpleGrid>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

interface SpecificationProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Specification({
  icon,
  label,
  value,
}: SpecificationProps) {
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
        {icon}
      </Flex>

      <Box>
        <Text fontSize="xs" color="fg.muted" mb={0.5}>
          {label}
        </Text>

        <Text fontSize="sm" fontWeight="600">
          {value}
        </Text>
      </Box>
    </HStack>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Flex
      justify="space-between"
      gap={4}
      borderBottomWidth="1px"
      pb={3}
    >
      <Text fontSize="sm" color="fg.muted">
        {label}
      </Text>

      <Text
        fontSize="sm"
        fontWeight="500"
        textAlign="right"
        wordBreak="break-all"
      >
        {value}
      </Text>
    </Flex>
  );
}