import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Setup fetch mock
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Reset mocks after each test
beforeEach(() => {
  vi.resetAllMocks();
});

// Helper to mock successful fetch responses
export const mockFetchSuccess = (data: any) => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => data
  });
};

// Helper to mock failed fetch responses
export const mockFetchError = (error: string) => {
  fetchMock.mockRejectedValueOnce(new Error(error));
};