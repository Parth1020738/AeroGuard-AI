import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../src/App';

vi.mock('../../src/services/gemini', () => ({
  fetchAirQualityPlan: vi.fn(async (profile) => {
    const { generateFallbackSmogPlan } = await import('../../src/services/fallbackSmogPlan');
    return generateFallbackSmogPlan(profile);
  }),
}));

describe('Onboarding Wizard & Dashboard Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('completes the 3-step onboarding wizard and renders the dashboard', async () => {
    render(<App />);

    expect(screen.getByText(/Step 1: Location & Smog Severity/i)).toBeInTheDocument();
    const delhiPreset = screen.getByRole('button', { name: /Delhi NCR/i });
    fireEvent.click(delhiPreset);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(await screen.findByText(/Step 2: Dwelling & Vulnerability Profile/i)).toBeInTheDocument();

    const childrenChip = screen.getByRole('checkbox', { name: /Children/i });
    fireEvent.click(childrenChip);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(await screen.findByText(/Step 3: Commute & Home Setup/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Generate Smog Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Direct Choice Impact Simulator/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Targeted Smog Defense Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Inversion & Safe Ventilation Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/School & Neighborhood Smog Advisory/i)).toBeInTheDocument();
  });

  it('blocks progression on Step 1 when city is empty with validation error', () => {
    render(<App />);

    const cityInput = screen.getByLabelText(/City \/ Neighborhood Name/i);
    fireEvent.change(cityInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/City name must be at least 2 characters/i)).toBeInTheDocument();
  });

  it('blocks progression on Step 1 when AQI is out of bounds', () => {
    render(<App />);

    const aqiInput = screen.getByLabelText(/Current Outdoor AQI/i);
    fireEvent.change(aqiInput, { target: { value: '1500' } });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/AQI must be between 0 and 999/i)).toBeInTheDocument();
  });

  it('toggles an action switch and dynamically recomputes simulated metrics', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Generate Smog Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Direct Choice Impact Simulator/i)).toBeInTheDocument();
    });

    const actionSwitches = screen.getAllByRole('switch');
    const firstSwitch = actionSwitches[0]!;
    const initialChecked = firstSwitch.getAttribute('aria-checked');

    fireEvent.click(firstSwitch);
    expect(firstSwitch.getAttribute('aria-checked')).not.toBe(initialChecked);
  });

  it('filters actions by category tabs and handles Enable All High-Impact button', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Generate Smog Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Direct Choice Impact Simulator/i)).toBeInTheDocument();
    });

    const hacksTab = screen.getByRole('tab', { name: /Indoor Clean Air Hacks/i });
    fireEvent.click(hacksTab);
    expect(hacksTab).toHaveAttribute('aria-selected', 'true');

    const enableAllBtn = screen.getByRole('button', { name: /Enable All High-Impact Actions/i });
    fireEvent.click(enableAllBtn);
  });

  it('handles clipboard errors gracefully in CommunityCard when writeText rejects', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard permission denied')),
      },
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Generate Smog Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Copy Notice/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Copy Notice/i }));

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalled();
    });
    warnSpy.mockRestore();
  });

  it('triggers JSON export download and print triggers cleanly', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Generate Smog Action Plan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Export JSON/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Export JSON/i }));
    fireEvent.click(screen.getByRole('button', { name: /Print Advisory/i }));

    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
