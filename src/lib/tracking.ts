import { customAlphabet } from 'nanoid';

// Generate tracking number: TKS-XXXXXXXX
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export function generateTrackingNumber(): string {
  return `TKS-${nanoid()}`;
}

export function validateTrackingNumber(trackingNumber: string): boolean {
  const pattern = /^TKS-[A-Z0-9]{8}$/;
  return pattern.test(trackingNumber);
}

