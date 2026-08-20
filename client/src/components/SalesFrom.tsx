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
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowLeft, LuSave } from "react-icons/lu";

export interface SaleFormData {
  vehicleId: string;
  clientId: string;
  saleDate: string;
  paymentMethod: string;
  deliveryDate: string;
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

  vehicles: SelectOption[];
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
  const [vehicleId, setVehicleId] =
    useState(initialValues?.vehicleId ?? "");

  const [clientId, setClientId] =
    useState(initialValues?.clientId ?? "");

  const [saleDate, setSaleDate] =
    useState(initialValues?.saleDate ?? "");

  const [paymentMethod, setPaymentMethod] =
    useState(initialValues?.paymentMethod ?? "");

  const [deliveryDate, setDeliveryDate] =
    useState(initialValues?.deliveryDate ?? "");

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    await onSubmit({
      vehicleId,
      clientId,
      saleDate,
      paymentMethod,
      deliveryDate,
    });
  };

  return (
    <Box maxW="800px" mx="auto">
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

      <Heading size="lg" mb={6}>
        {title}
      </Heading>

      <Card.Root
        borderRadius="2xl"
        shadow="sm"
      >
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
                        {vehicle.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

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
                      setPaymentMethod(
                        e.target.value,
                      )
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
                    setDeliveryDate(
                      e.target.value,
                    )
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