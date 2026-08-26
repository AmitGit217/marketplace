import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Grid,
  Heading,
  Input,
  NativeSelect,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type {
  CreateVehicleDto,
  UpdateVehicleDto,
  Vehicle,
} from "@/types/vehicle";

import { vehiclesApi } from "@/api/vehicles";

interface VehicleFormProps {
  mode: "create" | "edit";
  vehicle?: Vehicle;
  onCancel: () => void;
  onSaved: (vehicle: Vehicle) => void;
}

interface FormState {
  brand: string;
  model: string;
  type: string;
  manufactureYear: string;
  mileage: string;
  condition: string;
  price: string;
  acquisitionDate: string;
  status: string;
  image: string;
  color: string;
}

const emptyForm: FormState = {
  brand: "",
  model: "",
  type: "",
  manufactureYear: "",
  mileage: "",
  condition: "",
  price: "",
  acquisitionDate: "",
  status: "available",
  image: "",
  color: "",
};

const getFormFromVehicle = (
  vehicle: Vehicle
): FormState => ({
  brand: vehicle.brand,
  model: vehicle.model,
  type: vehicle.type,
  manufactureYear: String(vehicle.manufactureYear),
  mileage: String(vehicle.mileage),
  condition: vehicle.condition,
  price: String(vehicle.price),
  acquisitionDate:
    vehicle.acquisitionDate.slice(0, 10),
  status: vehicle.status,
  image: vehicle.image,
  color: vehicle.color,
});

export default function VehicleForm({
  mode,
  vehicle,
  onCancel,
  onSaved,
}: VehicleFormProps) {
  const [form, setForm] = useState<FormState>(
    mode === "edit" && vehicle
      ? getFormFromVehicle(vehicle)
      : emptyForm
  );

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && vehicle) {
      setForm(getFormFromVehicle(vehicle));
    } else {
      setForm(emptyForm);
    }
  }, [mode, vehicle]);

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError(null);
    setIsSaving(true);

    try {
      if (!form.acquisitionDate) {
        throw new Error(
          "Acquisition date is required."
        );
      }

      if (mode === "create") {
        const data: CreateVehicleDto = {
          brand: form.brand,
          model: form.model,
          type: form.type,
          manufactureYear:
            Number(form.manufactureYear),
          mileage: Number(form.mileage),
          condition: form.condition,
          price: form.price,
          acquisitionDate:
            new Date(
              form.acquisitionDate
            ).toISOString(),
          status: form.status,
          image: form.image,
          color: form.color,
        };

        const created =
          await vehiclesApi.create(data);

        onSaved(created);
      } else {
        if (!vehicle) {
          throw new Error(
            "Vehicle is required for editing."
          );
        }

        const data: UpdateVehicleDto = {
          brand: form.brand,
          model: form.model,
          type: form.type,
          manufactureYear:
            Number(form.manufactureYear),
          mileage: Number(form.mileage),
          condition: form.condition,
          price: form.price,
          acquisitionDate:
            new Date(
              form.acquisitionDate
            ).toISOString(),
          status: form.status,
          image: form.image,
          color: form.color,
        };

        const updated =
          await vehiclesApi.update(
            vehicle.id,
            data
          );

        onSaved(updated);
      }
    } catch (err) {
      console.error(err);

      setError(
        mode === "create"
          ? "Could not create the vehicle."
          : "Could not update the vehicle."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <Card.Root
      borderRadius="2xl"
      shadow="sm"
    >
      <Card.Body p={{ base: 5, md: 8 }}>
        <Heading size="md" mb={6}>
          {isEdit
            ? "Edit vehicle"
            : "Create vehicle"}
        </Heading>

        <Box
          as="form"
          onSubmit={handleSubmit}
        >
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
            }}
            gap={5}
          >
            <Field.Root required>
              <Field.Label>
                Brand
              </Field.Label>

              <Input
                value={form.brand}
                onChange={(e) =>
                  handleChange(
                    "brand",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Model
              </Field.Label>

              <Input
                value={form.model}
                onChange={(e) =>
                  handleChange(
                    "model",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Type
              </Field.Label>

              <Input
                value={form.type}
                onChange={(e) =>
                  handleChange(
                    "type",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Manufacture year
              </Field.Label>

              <Input
                type="number"
                value={
                  form.manufactureYear
                }
                onChange={(e) =>
                  handleChange(
                    "manufactureYear",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Mileage
              </Field.Label>

              <Input
                type="number"
                value={form.mileage}
                onChange={(e) =>
                  handleChange(
                    "mileage",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Price
              </Field.Label>

              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  handleChange(
                    "price",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Condition
              </Field.Label>

              <Input
                value={form.condition}
                onChange={(e) =>
                  handleChange(
                    "condition",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Color
              </Field.Label>

              <Input
                value={form.color}
                onChange={(e) =>
                  handleChange(
                    "color",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Status
              </Field.Label>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={form.status}
                  onChange={(e) =>
                    handleChange(
                      "status",
                      e.target.value
                    )
                  }
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="reserved">
                    Reserved
                  </option>

                  <option value="sold">
                    Sold
                  </option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Acquisition date
              </Field.Label>

              <Input
                type="date"
                value={
                  form.acquisitionDate
                }
                onChange={(e) =>
                  handleChange(
                    "acquisitionDate",
                    e.target.value
                  )
                }
              />
            </Field.Root>

            <Field.Root
              gridColumn={{
                base: "auto",
                md: "1 / -1",
              }}
            >
              <Field.Label>
                Image URL
              </Field.Label>

              <Input
                value={form.image}
                onChange={(e) =>
                  handleChange(
                    "image",
                    e.target.value
                  )
                }
                placeholder="https://..."
              />
            </Field.Root>
          </Grid>

          {error && (
            <Box
              mt={5}
              p={3}
              borderRadius="md"
              bg="red.subtle"
              color="red.fg"
            >
              {error}
            </Box>
          )}

          <Flex
            justify="flex-end"
            gap={3}
            mt={8}
          >
            <Button
              variant="outline"
              onClick={onCancel}
              type="button"
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              colorPalette="brand"
              loading={isSaving}
            >
              {isEdit
                ? "Save changes"
                : "Create vehicle"}
            </Button>
          </Flex>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}