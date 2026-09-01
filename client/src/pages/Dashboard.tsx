import { useEffect, useState } from "react";
import {
  Box,
  CardBody,
  CardRoot,
  Container,
  Heading,
  HStack,
  Progress,
  SimpleGrid,
  Spinner,
  Stat,
  Text,
  VStack,
} from "@chakra-ui/react";

import type { DashboardData } from "@/types/dashboard";
import { getDashboardData } from "@/api/dashboard";

const formatCurrency = (value: number, decimals = 2) =>
  `€${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString();

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        minH="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!dashboard) {
    return (
      <Container maxW="7xl" py={10}>
        <Text color="textMuted">
          Unable to load dashboard data.
        </Text>
      </Container>
    );
  }

  const { inventory, recent, yearly, dataThrough } = dashboard;

  const soldPercentage =
    inventory.totalVehicles > 0
      ? (inventory.soldVehicles / inventory.totalVehicles) * 100
      : 0;

  return (
    <Box py={6}>
      <Container maxW="7xl">
        <VStack align="stretch" gap={6}>

          {/* Header */}
          <Box>
            <Heading size="lg">Dashboard</Heading>

            <Text color="textMuted" mt={1}>
              Overview of your dealership
            </Text>

            {dataThrough && (
              <Text color="textMuted" fontSize="sm" mt={2}>
                Data through {formatDate(dataThrough)}
              </Text>
            )}
          </Box>

          {/* Recent Revenue */}
          <CardRoot>
            <CardBody>
              <Stat.Root>
                <Stat.Label>Revenue — Last 30 Days</Stat.Label>

                <Stat.ValueText fontSize="4xl">
                  {formatCurrency(recent.revenue)}
                </Stat.ValueText>

                <Stat.HelpText>
                  Revenue generated in the last 30 days
                </Stat.HelpText>
              </Stat.Root>
            </CardBody>
          </CardRoot>

          {/* Recent KPIs */}
          <SimpleGrid
            columns={{ base: 1, sm: 2 }}
            gap={4}
          >
            <CardRoot>
              <CardBody>
                <Stat.Root>
                  <Stat.Label>Sales — Last 30 Days</Stat.Label>

                  <Stat.ValueText fontSize="2xl">
                    {recent.sales}
                  </Stat.ValueText>

                  <Stat.HelpText>
                    Vehicles sold
                  </Stat.HelpText>
                </Stat.Root>
              </CardBody>
            </CardRoot>

            <CardRoot>
              <CardBody>
                <Stat.Root>
                  <Stat.Label>Available</Stat.Label>

                  <Stat.ValueText fontSize="2xl">
                    {inventory.availableVehicles}
                  </Stat.ValueText>

                  <Stat.HelpText>
                    Vehicles available
                  </Stat.HelpText>
                </Stat.Root>
              </CardBody>
            </CardRoot>
          </SimpleGrid>

          {/* Inventory */}
          <CardRoot>
            <CardBody>
              <VStack align="stretch" gap={5}>
                <Box>
                  <Heading size="md">Inventory</Heading>

                  <Text color="textMuted" fontSize="sm">
                    Current vehicle inventory
                  </Text>
                </Box>

                <HStack justify="space-between">
                  <Text>Total vehicles</Text>
                  <Text fontWeight="bold">
                    {inventory.totalVehicles}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Available</Text>
                  <Text fontWeight="bold">
                    {inventory.availableVehicles}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Sold</Text>
                  <Text fontWeight="bold">
                    {inventory.soldVehicles}
                  </Text>
                </HStack>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm">
                      Inventory sold
                    </Text>

                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      {soldPercentage.toFixed(0)}%
                    </Text>
                  </HStack>

                  <Progress.Root
                    value={soldPercentage}
                    size="sm"
                    rounded="full"
                  >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Box>
              </VStack>
            </CardBody>
          </CardRoot>

          {/* Historical Sales */}
          <CardRoot>
            <CardBody>
              <VStack align="stretch" gap={4}>
                <Box>
                  <Heading size="md">
                    Sales History
                  </Heading>

                  <Text color="textMuted" fontSize="sm">
                    Yearly sales performance
                  </Text>
                </Box>

                {yearly.map((item) => (
                  <HStack
                    key={item.year}
                    justify="space-between"
                    gap={4}
                  >
                    <Text fontWeight="medium">
                      {item.year}
                    </Text>

                    <HStack gap={6}>
                      <Text color="textMuted">
                        {item.sales} sales
                      </Text>

                      <Text fontWeight="bold">
                        {formatCurrency(item.revenue, 0)}
                      </Text>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </CardRoot>

        </VStack>
      </Container>
    </Box>
  );
}