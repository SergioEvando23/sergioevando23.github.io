import GitHubIcon from '@mui/icons-material/GitHub';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('requires an accessible label', () => {
    render(
      <IconButton label="Abrir GitHub">
        <GitHubIcon data-testid="github-icon" />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Abrir GitHub' })).toBeInTheDocument();
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });

  it('supports disabled state', () => {
    render(
      <IconButton disabled label="Ação indisponível">
        <GitHubIcon />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Ação indisponível' })).toBeDisabled();
  });

  it('supports keyboard activation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <IconButton label="Executar" onClick={onClick}>
        <GitHubIcon />
      </IconButton>,
    );

    screen.getByRole('button', { name: 'Executar' }).focus();
    await user.keyboard('[Enter]');
    await user.keyboard('[Space]');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('calls click handlers', () => {
    const onClick = vi.fn();

    render(
      <IconButton label="Clicar" onClick={onClick}>
        <GitHubIcon />
      </IconButton>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clicar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
