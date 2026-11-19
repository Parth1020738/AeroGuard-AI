import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '../../src/components/common/ErrorBoundary';
import { DisclaimerBanner } from '../../src/components/common/DisclaimerBanner';
import { LoadingSkeleton } from '../../src/components/common/LoadingSkeleton';

function CrashingComponent(): React.JSX.Element {
  throw new Error('Test intentional crash');
}

describe('Core Common Components', () => {
  describe('DisclaimerBanner', () => {
    it('renders with note role and informative text', () => {
      render(<DisclaimerBanner />);
      const note = screen.getByRole('note');
      expect(note).toBeInTheDocument();
      expect(note).toHaveTextContent(/Environmental Science Advisory/i);
    });
  });

  describe('LoadingSkeleton', () => {
    it('renders accessible status role and custom label', () => {
      render(<LoadingSkeleton label="Generating testing scenario..." rows={2} />);
      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent(/Generating testing scenario.../i);
    });
  });

  describe('ErrorBoundary', () => {
    it('renders child components when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Healthy Child Content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Healthy Child Content')).toBeInTheDocument();
    });

    it('catches crashes and renders accessible fallback UI', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary fallbackTitle="Custom System Crash">
          <CrashingComponent />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('Custom System Crash')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Application/i })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
