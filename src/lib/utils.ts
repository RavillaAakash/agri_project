import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(score: number): {
  label: string;
  badgeClass: string;
  colorClass: string;
} {
  if (score >= 80) {
    return {
      label: 'High Confidence',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
      colorClass: 'text-emerald-600',
    };
  }
  if (score >= 50) {
    return {
      label: 'Moderate Confidence',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
      colorClass: 'text-amber-600',
    };
  }
  return {
    label: 'Low Confidence (Expert Review Recommended)',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300',
    colorClass: 'text-rose-600',
  };
}
