import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Enviar</Button>);

    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('supports variants and sizes', () => {
    const { rerender } = render(
      <Button size="small" variant="secondary">
        Secundário
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Secundário' })).toBeEnabled();

    rerender(
      <Button size="large" variant="ghost">
        Fantasma
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Fantasma' })).toBeEnabled();
  });

  it('handles disabled and loading states', () => {
    const { rerender } = render(<Button disabled>Bloqueado</Button>);

    expect(screen.getByRole('button', { name: 'Bloqueado' })).toBeDisabled();

    rerender(<Button loading>Carregando</Button>);

    expect(screen.getByRole('button', { name: 'Carregando' })).toBeDisabled();
    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    render(
      <Button
        leftIcon={<ArrowForwardIcon data-testid="left-icon" />}
        rightIcon={<ArrowForwardIcon data-testid="right-icon" />}
      >
        Ícones
      </Button>,
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('calls click handlers', () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Clicar</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Clicar' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
