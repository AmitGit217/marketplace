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
  UpdateVehicleDto,
  Vehicle,
} from "@/types/vehicle";

import { vehiclesApi } from "@/api/vehicles";

interface VehicleEditFormProps {
  vehicle: Vehicle;
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

export default function VehicleEditForm({
  vehicle,
  onCancel,
  onSaved,
}: VehicleEditFormProps) {
  const [form, setForm] =
    useState<FormState>({
      brand: vehicle.brand,
      model: vehicle.model,
      type: vehicle.type,
      manufactureYear:
        String(vehicle.manufactureYear),
      mileage: String(vehicle.mileage),
      condition: vehicle.condition,
      price: String(vehicle.price),
      acquisitionDate:
        vehicle.acquisitionDate.slice(0, 10),
      status: vehicle.status,
      image: vehicle.image,
      color: vehicle.color,
    });

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      type: vehicle.type,
      manufactureYear:
        String(vehicle.manufactureYear),
      mileage: String(vehicle.mileage),
      condition: vehicle.condition,
      price: String(vehicle.price),
      acquisitionDate:
        vehicle.acquisitionDate.slice(0, 10),
      status: vehicle.status,
      image: vehicle.image,
      color: vehicle.color,
    });
  }, [vehicle]);

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
    } catch (err) {
      console.error(err);
      setError(
        "Could not update the vehicle."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card.Root
      borderRadius="2xl"
      shadow="sm"
    >
      <Card.Body p={{ base: 5, md: 8 }}>
        <Heading size="md" mb={6}>
          Edit vehicle
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
            <Field.Root>
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

            <Field.Root>
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

            <Field.Root>
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

            <Field.Root>
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

            <Field.Root>
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

            <Field.Root>
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

            <Field.Root>
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

            <Field.Root>
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

            <Field.Root>
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

                  <option value="sold">
                    Sold
                  </option>

                  <option value="reserved">
                    Reserved
                  </option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root>
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
              Save changes
            </Button>
          </Flex>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}