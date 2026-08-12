import { useEffect, useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  Text,
  Heading,
  CardBody,
  VStack,
  HStack,
  Progress,
  Spinner,
  CardRoot,
} from "@chakra-ui/react";

import type { DashboardData } from "@/types/dashboard";
import { getDashboardData } from "@/api/dashboard";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardData();
        setDashboard(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        minH="100vh"
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
      <Box p={6}>
        <Text>Unable to load dashboard data.</Text>
      </Box>
    );
  }

  const soldPercentage =
    dashboard.totalVehicles > 0
      ? (dashboard.soldVehicles / dashboard.totalVehicles) * 100
      : 0;

  return (
    <Box minH="100vh" py={6}>
      <Container maxW="container.lg">
        <VStack align="stretch" gap={6}>
          {/* Header */}
          <Box>
            <Heading size="lg">Dashboard</Heading>
            <Text color="gray.500" mt={1}>
              Overview of your dealership
            </Text>
          </Box>

          {/* Revenue */}
          <CardRoot>
            <CardBody>
              <Stat.Root>
                <Stat.Label>Monthly Revenue</Stat.Label>

                <Stat.ValueText fontSize="4xl">
                  €
                  {dashboard.monthlyRevenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Stat.ValueText>

                <Stat.HelpText>
                  Revenue generated this month
                </Stat.HelpText>
              </Stat.Root>
            </CardBody>
          </CardRoot>

          {/* Secondary KPIs */}
          <SimpleGrid columns={{ base: 2, md: 2 }} gap={4}>
            <CardRoot>
              <CardBody>
                <Stat.Root>
                  <Stat.Label>Monthly Sales</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    {dashboard.monthlySales}
                  </Stat.ValueText>
                  <Stat.HelpText>Vehicles sold</Stat.HelpText>
                </Stat.Root>
              </CardBody>
            </CardRoot>

            <CardRoot>
              <CardBody>
                <Stat.Root>
                  <Stat.Label>Available</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    {dashboard.availableVehicles}
                  </Stat.ValueText>
                  <Stat.HelpText>Vehicles available</Stat.HelpText>
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
                  <Text color="gray.500" fontSize="sm">
                    Current vehicle inventory
                  </Text>
                </Box>

                <HStack justify="space-between">
                  <Text>Total vehicles</Text>
                  <Text fontWeight="bold">
                    {dashboard.totalVehicles}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Available</Text>
                  <Text fontWeight="bold">
                    {dashboard.availableVehicles}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text>Sold</Text>
                  <Text fontWeight="bold">
                    {dashboard.soldVehicles}
                  </Text>
                </HStack>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm">Inventory sold</Text>
                    <Text fontSize="sm" fontWeight="medium">
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
        </VStack>
      </Container>
    </Box>
  );
}