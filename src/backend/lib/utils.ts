import { type ClassValue, clsx } from 'clsx';

// Utility function for conditional class names (if you want to add clsx later)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format price as currency
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

// Generate a unique order ID
export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Calculate estimated delivery date
export function getEstimatedDelivery(days: number = 5): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// Truncate text for display
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sleep utility for simulating delays
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
