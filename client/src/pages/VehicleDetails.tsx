import {
  Badge,
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
import { useEffect, useState } from "react";
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
import VehicleEditForm from "@/components/VehicleEditForm";



export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;

      try {
        const data =
          await vehiclesApi.getById(id);

        setVehicle(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicle();
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

  if (!vehicle) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Heading size="md">
          Vehicle not found
        </Heading>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/vehicles")
          }
        >
          <LuArrowLeft />
          Back to vehicles
        </Button>
      </Flex>
    );
  }

 return (
  <Box maxW="1400px" mx="auto">
    {/* Back + Edit */}
    <Flex
      justify="space-between"
      align="center"
      mb={6}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/vehicles")}
      >
        <LuArrowLeft />
        Back to vehicles
      </Button>

      {!isEditing && (
        <Button
          colorPalette="brand"
          onClick={() => setIsEditing(true)}
        >
          <LuPencil />
          Edit vehicle
        </Button>
      )}
    </Flex>

    {/* Content */}
    {isEditing ? (
      <VehicleEditForm
        vehicle={vehicle}
        onCancel={() => setIsEditing(false)}
        onSaved={(updatedVehicle) => {
          setVehicle(updatedVehicle);
          setIsEditing(false);
        }}
      />
    ) : (
      <>
        {/* Main vehicle card */}
        <Card.Root
          overflow="hidden"
          borderRadius="2xl"
          shadow="sm"
        >
          <Grid
            templateColumns={{
              base: "1fr",
              lg: "1.1fr 1fr",
            }}
          >
            {/* IMAGE */}
            <Box
              position="relative"
              bg="gray.100"
              _dark={{
                bg: "gray.800",
              }}
              minH={{
                base: "280px",
                md: "400px",
                lg: "500px",
              }}
            >
              <Image
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                w="100%"
                h="100%"
                minH={{
                  base: "280px",
                  md: "400px",
                  lg: "500px",
                }}
                objectFit="cover"
              />

              {/* Status */}
              <Box
                position="absolute"
                top={4}
                right={4}
              >
                <Badge
                  size="lg"
                  variant="solid"
                  colorPalette={
                    vehicle.status === "available"
                      ? "green"
                      : "gray"
                  }
                >
                  {vehicle.status}
                </Badge>
              </Box>
            </Box>

            {/* INFORMATION */}
            <Box p={{ base: 5, md: 8 }}>
              <Flex
                direction="column"
                h="100%"
              >
                {/* Header */}
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
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </Heading>

                  <Text
                    mt={2}
                    color="fg.muted"
                  >
                    {vehicle.manufactureYear} ·{" "}
                    {vehicle.color}
                  </Text>
                </Box>

                <Separator my={6} />

                {/* Price */}
                <Box>
                  <Text
                    fontSize="sm"
                    color="fg.muted"
                    mb={1}
                  >
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
                    €
                    {Number(
                      vehicle.price
                    ).toLocaleString()}
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
                    value={String(
                      vehicle.manufactureYear
                    )}
                  />

                  <Specification
                    icon={<LuCircleGauge />}
                    label="Mileage"
                    value={`${vehicle.mileage.toLocaleString()} km`}
                  />

                  <Specification
                    icon={<LuWrench />}
                    label="Condition"
                    value={vehicle.condition}
                  />

                  <ColorSpecification
                    color={vehicle.color}
                  />

                  <Specification
                    icon={<LuTag />}
                    label="Status"
                    value={vehicle.status}
                  />
                </SimpleGrid>

                <Box mt="auto" pt={8}>
                  <Text
                    fontSize="xs"
                    color="fg.muted"
                  >
                    Acquired on{" "}
                    {new Date(
                      vehicle.acquisitionDate
                    ).toLocaleDateString()}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Grid>
        </Card.Root>

        {/* Additional information */}
        <Card.Root
          mt={6}
          borderRadius="2xl"
          shadow="sm"
        >
          <Card.Body
            p={{ base: 5, md: 8 }}
          >
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
                value={vehicle.id}
              />

              <InfoRow
                label="Brand"
                value={vehicle.brand}
              />

              <InfoRow
                label="Model"
                value={vehicle.model}
              />

              <InfoRow
                label="Type"
                value={vehicle.type}
              />

              <InfoRow
                label="Manufacture year"
                value={String(
                  vehicle.manufactureYear
                )}
              />

              <InfoRow
                label="Mileage"
                value={`${vehicle.mileage.toLocaleString()} km`}
              />

              <InfoRow
                label="Condition"
                value={vehicle.condition}
              />

              <InfoRow
                label="Color"
                value={vehicle.color}
              />

              <InfoRow
                label="Acquisition date"
                value={new Date(
                  vehicle.acquisitionDate
                ).toLocaleDateString()}
              />

              <InfoRow
                label="Status"
                value={vehicle.status}
              />
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
      </>
    )}
  </Box>
);
}

/* =========================
   Specification
========================= */

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
        wordBreak="break-all"
      >
        {value}
      </Text>
    </Flex>
  );
}