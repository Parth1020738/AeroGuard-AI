import { SmogActionItem } from '../types/airQuality';

export function getFallbackActions(isSevere: boolean): SmogActionItem[] {
  return [
    {
      id: 'routine-stagger-travel',
      title: 'Stagger Commute to Escape Thermal Inversion',
      category: 'low_emission_routine',
      steps: [
        'Shift outdoor departures past 10:00 AM once sunlight breaks boundary inversion.',
        'Wear an airtight certified dual-strap N95 respirator covering nose and chin.',
      ],
      costLevel: 'free',
      difficulty: 'easy',
      scientificRationale:
        'Ground-level pollutants peak during dawn cool air stagnation; delaying commute avoids 40% of micro-particles.',
      pm25ReductionUg: isSevere ? 720 : 380,
      weeklyCo2SavedKg: 0,
      enabled: true,
    },
    {
      id: 'routine-damp-mop',
      title: 'Damp-Mopping Over Dry Broom Sweeping',
      category: 'low_emission_routine',
      steps: [
        'Replace dry brooms with microfiber damp mop once daily in the afternoon.',
        'Wipe window sills and door frames with a damp cotton cloth.',
      ],
      costLevel: 'free',
      difficulty: 'easy',
      scientificRationale:
        'Dry sweeping resuspends settled sub-micron PM2.5 and allergen particles into breathing zones for up to 4 hours.',
      pm25ReductionUg: isSevere ? 360 : 190,
      weeklyCo2SavedKg: 0,
      enabled: true,
    },
    {
      id: 'routine-active-threshold-seal',
      title: 'Wet-Towel Door Threshold Ingress Sealing',
      category: 'low_emission_routine',
      steps: [
        'Roll a damp towel along the base of external exterior doorways and balcony gaps.',
        'Keep internal bedroom doors closed to form a clean-air sanctuary room.',
      ],
      costLevel: 'free',
      difficulty: 'easy',
      scientificRationale:
        'Cuts unconditioned outdoor air infiltration by 45% through high-pressure doorway drafts.',
      pm25ReductionUg: isSevere ? 420 : 220,
      weeklyCo2SavedKg: 0,
      enabled: true,
    },
    {
      id: 'hack-diy-corsi-box',
      title: 'Assemble Low-Cost DIY Corsi-Rosenthal Filter Box',
      category: 'iaq_hack',
      steps: [
        'Tape MERV-13 pleated HVAC furnace filters around an inexpensive box fan.',
        'Ensure cardboard shroud base is airtight and place in primary bedroom.',
      ],
      costLevel: 'low',
      difficulty: 'medium',
      scientificRationale:
        'Achieves 300+ CFM clean air delivery rate (CADR) matching $400 commercial HEPA purifiers at 80% lower cost.',
      pm25ReductionUg: isSevere ? 940 : 510,
      weeklyCo2SavedKg: 1.2,
      enabled: true,
    },
    {
      id: 'hack-activated-charcoal',
      title: 'Activated Charcoal VOC & Odor Adsorption',
      category: 'iaq_hack',
      steps: [
        'Place porous fabric pouches of granular activated carbon in kitchen and hallway.',
        'Sun-bake pouches for 2 hours on clear days once a month to regenerate adsorption.',
      ],
      costLevel: 'low',
      difficulty: 'easy',
      scientificRationale:
        'Captures toxic gaseous VOCs, formaldehyde, and nitrogen oxides that mechanical particle filters miss.',
      pm25ReductionUg: isSevere ? 180 : 90,
      weeklyCo2SavedKg: 0,
      enabled: false,
    },
    {
      id: 'hack-indoor-plant-micro-sink',
      title: 'Targeted High-Transpiration Foliage Placement',
      category: 'iaq_hack',
      steps: [
        'Position Snake Plants (Sansevieria) and Areca Palms in sleeping areas.',
        'Clean leaves weekly with damp cloth to keep stomata pores unblocked.',
      ],
      costLevel: 'low',
      difficulty: 'easy',
      scientificRationale:
        'Increases indoor humidity slightly to accelerate particulate settling while emitting oxygen overnight.',
      pm25ReductionUg: isSevere ? 140 : 80,
      weeklyCo2SavedKg: 0.3,
      enabled: false,
    },
    {
      id: 'alt-induction-cooking',
      title: 'Shift From Open Flame Cooking to Induction',
      category: 'sustainable_alternative',
      steps: [
        'Prepare morning meals and tea using a portable electric induction cooktop.',
        'Turn on kitchen exhaust fan 2 minutes prior to cooking and 5 minutes after.',
      ],
      costLevel: 'moderate',
      difficulty: 'easy',
      scientificRationale:
        'Eliminates unvented combustion gases (NO2 and ultrafine soot) inside closed living spaces.',
      pm25ReductionUg: isSevere ? 320 : 180,
      weeklyCo2SavedKg: 4.8,
      enabled: true,
    },
    {
      id: 'alt-transit-carpool',
      title: 'Transition Commute to Metro or Electric Carpool',
      category: 'sustainable_alternative',
      steps: [
        'Switch private two-wheeler/car trips to underground metro or bus transit.',
        'Use designated filtered cabin routes rather than high-density open arterial roads.',
      ],
      costLevel: 'low',
      difficulty: 'easy',
      scientificRationale:
        'Reduces commuter tailpipe PM2.5 inhalation by 65% while preventing ~12 kg CO2 weekly per commuter.',
      pm25ReductionUg: isSevere ? 580 : 310,
      weeklyCo2SavedKg: 11.5,
      enabled: true,
    },
    {
      id: 'alt-community-composting',
      title: 'Neighborhood Biomass Leaf-Composting Pledge',
      category: 'sustainable_alternative',
      steps: [
        'Coordinate with society guards to ban open sweep-and-burn dry leaf disposal.',
        'Deposit garden waste into designated microbial composting pits.',
      ],
      costLevel: 'free',
      difficulty: 'medium',
      scientificRationale:
        'Prevents local emission of toxic polycyclic aromatic hydrocarbons and dense ground smoke plumes.',
      pm25ReductionUg: isSevere ? 280 : 150,
      weeklyCo2SavedKg: 3.2,
      enabled: false,
    },
  ];
}
