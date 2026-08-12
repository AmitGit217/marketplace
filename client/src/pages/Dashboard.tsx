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

  const { inventory, recent, yearly, dataThrough } = dashboard;

  const soldPercentage =
    inventory.totalVehicles > 0
      ? (inventory.soldVehicles / inventory.totalVehicles) * 100
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

            {dataThrough && (
              <Text color="gray.500" fontSize="sm" mt={2}>
                Data through{" "}
                {new Date(dataThrough).toLocaleDateString()}
              </Text>
            )}
          </Box>

          {/* Recent Revenue */}
          <CardRoot>
            <CardBody>
              <Stat.Root>
                <Stat.Label>Revenue — Last 30 Days</Stat.Label>

                <Stat.ValueText fontSize="4xl">
                  €
                  {recent.revenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Stat.ValueText>

                <Stat.HelpText>
                  Revenue generated in the last 30 days
                </Stat.HelpText>
              </Stat.Root>
            </CardBody>
          </CardRoot>

          {/* Recent KPIs */}
          <SimpleGrid columns={{ base: 2, md: 2 }} gap={4}>
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

                  <Text color="gray.500" fontSize="sm">
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

          {/* Historical Sales */}
          <CardRoot>
            <CardBody>
              <VStack align="stretch" gap={4}>
                <Box>
                  <Heading size="md">
                    Sales History
                  </Heading>

                  <Text color="gray.500" fontSize="sm">
                    Yearly sales performance
                  </Text>
                </Box>

                {yearly.map((item) => (
                  <HStack
                    key={item.year}
                    justify="space-between"
                  >
                    <Text fontWeight="medium">
                      {item.year}
                    </Text>

                    <HStack gap={6}>
                      <Text>
                        {item.sales} sales
                      </Text>

                      <Text fontWeight="bold">
                        €
                        {item.revenue.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
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