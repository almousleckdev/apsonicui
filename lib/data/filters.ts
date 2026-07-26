// Filter options - if dynamic, use GET /api/products/categories
export interface FilterOption {
  value: string;
  label: string;
}

export const CATEGORY_OPTIONS: FilterOption[] = [
  { value: "", label: "All Types" },
  { value: "standard", label: "Standard" },
  { value: "street", label: "Street" },
  { value: "offroad", label: "Off-Road" },
  { value: "underbone", label: "Underbone" },
  { value: "scooter", label: "Scooter" },
  { value: "atv", label: "ATV" },
  { value: "tricycle", label: "Tricycle" },
];

