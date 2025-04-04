import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Shimmer } from '../components/Shimmer';

describe('Shimmer', () => {
  it('renders with data-testid', () => {
    render(<Shimmer />);
    expect(screen.getByTestId('shimmer-container')).toBeInTheDocument();
  });

  it('renders with default count of 3 items', () => {
    const { getByTestId } = render(<Shimmer />);
    const container = getByTestId('shimmer-container');
    const items = container.querySelectorAll('.mb-2.p-3');
    expect(items.length).toBe(3);
  });

  it('renders with custom count', () => {
    const { getByTestId } = render(<Shimmer count={2} />);
    const container = getByTestId('shimmer-container');
    const items = container.querySelectorAll('.mb-2.p-3');
    expect(items.length).toBe(2);
  });
}); 