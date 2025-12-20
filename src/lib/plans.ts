export const PLAN_LIMITS = {
  FREE: {
    name: 'Free',
    customers: 50,
    shipments: 500,
    price: 0,
  },
  BASIC: {
    name: 'Basic',
    customers: 200,
    shipments: 2000,
    price: 25,
  },
  PRO: {
    name: 'Pro',
    customers: -1, // unlimited
    shipments: -1, // unlimited
    price: 100,
  },
};

export function canAddCustomer(plan: keyof typeof PLAN_LIMITS, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].customers;
  return limit === -1 || currentCount < limit;
}

export function canAddShipment(plan: keyof typeof PLAN_LIMITS, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].shipments;
  return limit === -1 || currentCount < limit;
}

