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
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type {
  CreateVehicleDto,
  UpdateVehicleDto,
  Vehicle,
} from "@/types/vehicle";

import { vehiclesApi } from "@/api/vehicles";
import { cloudinaryApi } from "@/api/cloudinary";

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
  imageFile: File | null;
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
  status: "Available",
  image: "",
  imageFile: null,
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
  imageFile: null,
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

  const handleChange = <
    K extends keyof FormState
  >(
    field: K,
    value: FormState[K]
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

      let imageUrl = form.image;

      if (form.imageFile) {
        const uploaded =
          await cloudinaryApi.uploadImage(
            form.imageFile
          );

        imageUrl = uploaded.secure_url;
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
          image: imageUrl,
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
          image: imageUrl,
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
      w="full"
      maxW="100%"
      minW="0"
      overflow="hidden"
    >
      <Card.Body
        p={{ base: 5, md: 8 }}
        w="full"
        minW="0"
      >
        <Heading size="md" mb={6}>
          {isEdit
            ? "Edit vehicle"
            : "Create vehicle"}
        </Heading>

        <Box
          as="form"
          onSubmit={handleSubmit}
          w="full"
          minW="0"
        >
          <Grid
            templateColumns={{
              base: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            }}
            gap={5}
            w="full"
            minW="0"
          >
            <Field.Root required minW="0">
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

            <Field.Root required minW="0">
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

            <Field.Root required minW="0">
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

            <Field.Root required minW="0">
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

            <Field.Root required minW="0">
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

            <Field.Root required minW="0">
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

            <Field.Root required minW="0">
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

            <Field.Root
              required
              minW="0"
            >
              <Field.Label>
                Color
              </Field.Label>

              <Flex
                wrap="wrap"
                gap={3}
                minW="0"
                maxW="100%"
              >
                {[
                  {
                    name: "Black",
                    value:
                      "rgb(0, 0, 0)",
                  },
                  {
                    name: "White",
                    value:
                      "rgb(255, 255, 255)",
                  },
                  {
                    name: "Gray",
                    value:
                      "rgb(107, 114, 128)",
                  },
                  {
                    name: "Silver",
                    value:
                      "rgb(192, 192, 192)",
                  },
                  {
                    name: "Red",
                    value:
                      "rgb(220, 38, 38)",
                  },
                  {
                    name: "Blue",
                    value:
                      "rgb(37, 99, 235)",
                  },
                  {
                    name: "Navy",
                    value:
                      "rgb(30, 58, 138)",
                  },
                  {
                    name: "Green",
                    value:
                      "rgb(22, 163, 74)",
                  },
                  {
                    name: "Yellow",
                    value:
                      "rgb(234, 179, 8)",
                  },
                  {
                    name: "Orange",
                    value:
                      "rgb(234, 88, 12)",
                  },
                  {
                    name: "Brown",
                    value:
                      "rgb(146, 64, 14)",
                  },
                  {
                    name: "Beige",
                    value:
                      "rgb(214, 198, 165)",
                  },
                ].map((color) => (
                  <Box
                    key={color.value}
                    flexShrink={0}
                  >
                    <Button
                      type="button"
                      aria-label={
                        color.name
                      }
                      title={color.name}
                      w="40px"
                      h="40px"
                      minW="40px"
                      p={0}
                      borderRadius="full"
                      bg={color.value}
                      borderWidth="2px"
                      borderColor={
                        form.color ===
                        color.value
                          ? "colorPalette.500"
                          : "border"
                      }
                      boxShadow={
                        form.color ===
                        color.value
                          ? "0 0 0 2px var(--chakra-colors-color-palette-500)"
                          : "none"
                      }
                      onClick={() =>
                        handleChange(
                          "color",
                          color.value
                        )
                      }
                    />
                  </Box>
                ))}
              </Flex>

              {form.color && (
                <Text
                  mt={2}
                  fontSize="sm"
                  color="fg.muted"
                >
                  Selected:{" "}
                  {form.color}
                </Text>
              )}
            </Field.Root>

            <Field.Root required minW="0">
              <Field.Label>
                Status
              </Field.Label>

              <NativeSelect.Root
                w="full"
                minW="0"
              >
                <NativeSelect.Field
                  value={form.status}
                  onChange={(e) =>
                    handleChange(
                      "status",
                      e.target.value
                    )
                  }
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="Reserved">
                    Reserved
                  </option>

                  <option value="Sold">
                    Sold
                  </option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root required minW="0">
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
              minW="0"
              w="full"
            >
              <Field.Label>
                Vehicle image
              </Field.Label>

              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                w="full"
                minW="0"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0] ??
                    null;

                  handleChange(
                    "imageFile",
                    file
                  );
                }}
              />

              {form.imageFile && (
                <Text
                  mt={2}
                  fontSize="sm"
                  color="fg.muted"
                  maxW="full"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  Selected:{" "}
                  {form.imageFile.name}
                </Text>
              )}

              {!form.imageFile &&
                form.image && (
                  <Text
                    mt={2}
                    fontSize="sm"
                    color="fg.muted"
                    maxW="full"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    Current image:{" "}
                    {form.image}
                  </Text>
                )}
            </Field.Root>
          </Grid>

          {error && (
            <Box
              mt={5}
              p={3}
              borderRadius="md"
              bg="red.subtle"
              color="red.fg"
              maxW="100%"
              overflow="hidden"
            >
              {error}
            </Box>
          )}

          <Flex
            justify="flex-end"
            gap={3}
            mt={8}
            flexWrap="wrap"
            w="full"
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