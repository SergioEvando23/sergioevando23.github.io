import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UserAvatar } from './UserAvatar';

describe('UserAvatar', () => {
  it('renders the Firebase profile photo and exposes only the email as a tooltip', async () => {
    render(<UserAvatar email="user@example.com" photoUrl="https://example.com/photo.jpg" />);

    const avatar = screen.getByRole('img', { name: 'user@example.com' });
    expect(document.querySelector('img')).toHaveAttribute('src', 'https://example.com/photo.jpg');
    expect(avatar.tagName).toBe('SPAN');
    fireEvent.mouseOver(avatar);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('user@example.com');
  });

  it('uses the generic avatar when a photo is unavailable or fails to load', () => {
    const { rerender } = render(<UserAvatar email="user@example.com" photoUrl={null} />);
    expect(document.querySelector('img')).not.toBeInTheDocument();

    rerender(<UserAvatar email="user@example.com" photoUrl="https://example.com/photo.jpg" />);
    fireEvent.error(document.querySelector('img')!);
    expect(document.querySelector('img')).not.toBeInTheDocument();
  });
});
