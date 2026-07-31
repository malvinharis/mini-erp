import { Badge, Button } from '@/components/ui';
import { render, screen } from '@testing-library/react';

// Smoke tests proving RTL + jsdom + the vendored @/components/ui package render.
describe('ui components', () => {
  it('Badge renders its children', () => {
    render(<Badge color="success">Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('Button renders as a button element', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });
});
