import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Separator,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowLeft, LuSave, LuCar } from "react-icons/lu";

export interface SaleFormData {
  vehicleId: string;
  clientId: string;
  saleDate: string;
  paymentMethod: string;
  deliveryDate: string;
}

export interface VehicleOption {
  id: string | number;
  brand: string;
  model: string;
  year?: number;
  price?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
}

interface SelectOption {
  id: string | number;
  label: string;
}

interface SaleFormProps {
  title: string;
  submitLabel: string;
  isSaving: boolean;
  initialValues?: Partial<SaleFormData>;

  vehicles: VehicleOption[];
  clients: SelectOption[];

  onBack: () => void;
  onSubmit: (data: SaleFormData) => Promise<void>;
}

export default function SaleForm({
  title,
  submitLabel,
  isSaving,
  initialValues,
  vehicles,
  clients,
  onBack,
  onSubmit,
}: SaleFormProps) {
  const [vehicleId, setVehicleId] = useState(
    initialValues?.vehicleId ?? "",
  );

  const [clientId, setClientId] = useState(
    initialValues?.clientId ?? "",
  );

  const [saleDate, setSaleDate] = useState(
    initialValues?.saleDate ?? "",
  );

  const [paymentMethod, setPaymentMethod] = useState(
    initialValues?.paymentMethod ?? "",
  );

  const [deliveryDate, setDeliveryDate] = useState(
    initialValues?.deliveryDate ?? "",
  );

  const selectedVehicle = vehicles.find(
    (vehicle) => String(vehicle.id) === vehicleId,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await onSubmit({
      vehicleId,
      clientId,
      saleDate,
      paymentMethod,
      deliveryDate,
    });
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) {
      return null;
    }

    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage?: number) => {
    if (mileage === undefined || mileage === null) {
      return null;
    }

    return `${new Intl.NumberFormat("es-ES").format(mileage)} km`;
  };

  return (
    <Box maxW="850px" mx="auto">
      <Flex align="center" mb={6}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <LuArrowLeft />
          Back
        </Button>
      </Flex>

      <Heading size="lg" mb={2}>
        {title}
      </Heading>

      <Text color="fg.muted" mb={6}>
        Select the vehicle and client, then complete the sale details.
      </Text>

      <Card.Root borderRadius="2xl" shadow="sm">
        <Card.Body p={{ base: 5, md: 8 }}>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap={5}>
              {/* Vehicle */}

              <Field.Root required>
                <Field.Label>
                  Vehicle
                </Field.Label>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={vehicleId}
                    onChange={(e) =>
                      setVehicleId(e.target.value)
                    }
                  >
                    <option value="">
                      Select vehicle
                    </option>

                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {vehicle.brand} {vehicle.model}
                        {vehicle.year
                          ? ` · ${vehicle.year}`
                          : ""}
                        {vehicle.price !== undefined
                          ? ` · ${formatPrice(vehicle.price)}`
                          : ""}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              {/* Selected vehicle summary */}

              {selectedVehicle && (
                <Card.Root
                  variant="outline"
                  borderRadius="xl"
                  bg="bg.subtle"
                >
                  <Card.Body p={5}>
                    <Flex
                      justify="space-between"
                      align={{ base: "flex-start", md: "center" }}
                      gap={4}
                      direction={{ base: "column", md: "row" }}
                    >
                      <Flex gap={4} align="center">
                        <Flex
                          w="44px"
                          h="44px"
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg="bg.muted"
                        >
                          <LuCar />
                        </Flex>

                        <Box>
                          <Text
                            fontWeight="semibold"
                            fontSize="lg"
                          >
                            {selectedVehicle.brand}{" "}
                            {selectedVehicle.model}{" "}
                            
                            
                          </Text>

                          <Text
                            fontSize="sm"
                            color="fg.muted"
                          >
                            {[
                              selectedVehicle.year,
                              formatMileage(
                                selectedVehicle.mileage,
                              ),
                              selectedVehicle.fuelType,
                              selectedVehicle.transmission,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </Text>
                        </Box>
                      </Flex>

                      {selectedVehicle.price !== undefined && (
                        <Box textAlign={{ base: "left", md: "right" }}>
                          <Text
                            fontSize="xs"
                            color="fg.muted"
                          >
                            Sale price
                          </Text>

                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                          >
                            {formatPrice(
                              selectedVehicle.price,
                            )}
                          </Text>
                        </Box>
                      )}

                     
                    </Flex>
                  </Card.Body>
                </Card.Root>
              )}

              <Separator />

              {/* Client */}

              <Field.Root required>
                <Field.Label>
                  Client
                </Field.Label>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={clientId}
                    onChange={(e) =>
                      setClientId(e.target.value)
                    }
                  >
                    <option value="">
                      Select client
                    </option>

                    {clients.map((client) => (
                      <option
                        key={client.id}
                        value={client.id}
                      >
                        {client.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              <Separator />

              {/* Sale date */}

              <Field.Root required>
                <Field.Label>
                  Sale date
                </Field.Label>

                <Input
                  type="date"
                  value={saleDate}
                  onChange={(e) =>
                    setSaleDate(e.target.value)
                  }
                />
              </Field.Root>

              {/* Payment */}

              <Field.Root required>
                <Field.Label>
                  Payment method
                </Field.Label>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  >
                    <option value="">
                      Select payment method
                    </option>

                    <option value="CASH">
                      Cash
                    </option>

                    <option value="CARD">
                      Card
                    </option>

                    <option value="BANK_TRANSFER">
                      Bank transfer
                    </option>

                    <option value="FINANCING">
                      Financing
                    </option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              {/* Delivery */}

              <Field.Root required>
                <Field.Label>
                  Delivery date
                </Field.Label>

                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) =>
                    setDeliveryDate(e.target.value)
                  }
                />
              </Field.Root>

              <Flex
                justify="flex-end"
                gap={3}
                mt={3}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  colorPalette="brand"
                  loading={isSaving}
                  disabled={
                    !vehicleId ||
                    !clientId ||
                    !saleDate ||
                    !paymentMethod ||
                    !deliveryDate
                  }
                >
                  <LuSave />
                  {submitLabel}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}