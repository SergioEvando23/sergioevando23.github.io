import { describe, expect, it } from 'vitest';
import { adminConverter, studyProjectConverter } from './converters';

describe('Firebase converters', () => {
  it('keeps admin documents unchanged in both directions', () => {
    const admin = { email: 'admin@example.com', active: true };
    const snapshot = { data: () => admin };

    expect(adminConverter.toFirestore(admin as never)).toBe(admin);
    expect(adminConverter.fromFirestore(snapshot as never, {} as never)).toBe(admin);
  });

  it('keeps study projects unchanged in both directions', () => {
    const project = { id: 'study', title: 'Study' };
    const snapshot = { data: () => project };

    expect(studyProjectConverter.toFirestore(project as never)).toBe(project);
    expect(studyProjectConverter.fromFirestore(snapshot as never, {} as never)).toBe(project);
  });
});
