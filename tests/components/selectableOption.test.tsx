import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectableOption } from '../../src/components/common/SelectableOption';

describe('SelectableOption component', () => {
  it('renders label, badge, and description correctly', () => {
    render(
      <SelectableOption
        label="N95 Respirator"
        selected={false}
        onSelect={vi.fn()}
        badge="AQI 300+"
        description="High-efficiency particulate filtration."
      />
    );

    expect(screen.getByText('N95 Respirator')).toBeInTheDocument();
    expect(screen.getByText('AQI 300+')).toBeInTheDocument();
    expect(screen.getByText('High-efficiency particulate filtration.')).toBeInTheDocument();
  });

  it('triggers onSelect callback when clicked', () => {
    const handleSelect = vi.fn();
    render(
      <SelectableOption
        label="HEPA Filter"
        selected={false}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /HEPA Filter/i }));
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('triggers onSelect on Space and Enter keydown events', () => {
    const handleSelect = vi.fn();
    render(
      <SelectableOption
        label="Corsi-Rosenthal Box"
        selected={false}
        onSelect={handleSelect}
        role="checkbox"
      />
    );

    const option = screen.getByRole('checkbox', { name: /Corsi-Rosenthal Box/i });
    fireEvent.keyDown(option, { key: ' ' });
    expect(handleSelect).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(option, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it('exposes correct aria attributes for role="checkbox"', () => {
    const { rerender } = render(
      <SelectableOption
        label="Asthma Sensitivity"
        selected={false}
        onSelect={vi.fn()}
        role="checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Asthma Sensitivity/i });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    rerender(
      <SelectableOption
        label="Asthma Sensitivity"
        selected={true}
        onSelect={vi.fn()}
        role="checkbox"
      />
    );
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('exposes correct aria attributes for role="button"', () => {
    const { rerender } = render(
      <SelectableOption
        label="Delhi Smog Preset"
        selected={false}
        onSelect={vi.fn()}
        role="button"
      />
    );

    const button = screen.getByRole('button', { name: /Delhi Smog Preset/i });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <SelectableOption
        label="Delhi Smog Preset"
        selected={true}
        onSelect={vi.fn()}
        role="button"
      />
    );
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('disables interaction when disabled prop is true', () => {
    const handleSelect = vi.fn();
    render(
      <SelectableOption
        label="Disabled Option"
        selected={false}
        disabled={true}
        onSelect={handleSelect}
      />
    );

    const button = screen.getByRole('button', { name: /Disabled Option/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleSelect).not.toHaveBeenCalled();
  });
});
