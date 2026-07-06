import { AxiosError } from 'axios';
import type { ApiFailure } from '../types';

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiFailure | undefined;
    if (data?.message) return data.message;
  }
  return 'Something went wrong. Please try again.';
};
