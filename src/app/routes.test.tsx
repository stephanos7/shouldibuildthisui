import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from './routes';

function renderRoute(initialPath: string) {
  const memoryRouter = createMemoryRouter(routes, {
    initialEntries: [initialPath]
  });

  return render(<RouterProvider router={memoryRouter} />);
}

describe('app routes', () => {
  it('renders the home route', () => {
    renderRoute('/');

    expect(
      screen.getByRole('heading', {
        name: /routing and mui shell are ready/i
      })
    ).toBeInTheDocument();
  });

  it('renders the result route', () => {
    renderRoute('/result');

    expect(screen.getByRole('heading', { name: /result route/i })).toBeInTheDocument();
  });

  it('renders the calibration route', () => {
    renderRoute('/internal/calibration');

    expect(screen.getByRole('heading', { name: /internal calibration/i })).toBeInTheDocument();
  });
});
