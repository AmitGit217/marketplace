export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  profile: "/profile",

  vehicles: "/vehicles",
  vehicleNew: "/vehicles/new",
  vehicle: (id: string | number) => `/vehicles/${id}`,
  vehicleEdit: (id: string | number) => `/vehicles/${id}/edit`,

  sales: "/sales",
  saleNew: "/sales/new",
  sale: (id: string | number) => `/sales/${id}`,
  saleEdit: (id: string | number) => `/sales/${id}/edit`,

  clients: "/clients",
  clientNew: "/clients/new",
  client: (id: string | number) => `/clients/${id}`,
  clientEdit: (id: string | number) => `/clients/${id}/edit`,

  personnel: "/personnel",
  personnelNew: "/personnel/new",
  personnelDetail: (id: string | number) => `/personnel/${id}`,
  personnelEdit: (id: string | number) =>
    `/personnel/${id}/edit`,
} as const;