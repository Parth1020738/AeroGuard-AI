import {
  CommuteMode,
  CookingFuel,
  HomeType,
  VulnerabilityGroup,
  CleanAirGear,
} from '../../types/airQuality';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const DWELLING_OPTIONS: SelectOption<HomeType>[] = [
  { value: 'apartment', label: 'Mid-Rise Apartment (1–4 Floors)', description: 'Moderate street traffic particulate infiltration' },
  { value: 'highRise', label: 'High-Rise Flat (5+ Floors)', description: 'Elevated thermal boundary layer exposure' },
  { value: 'standalone', label: 'Independent House / Villa', description: 'Highest perimeter draft & ground dust infiltration' },
];

export const VULNERABILITY_OPTIONS: SelectOption<VulnerabilityGroup>[] = [
  { value: 'children', label: 'Children (<12 yrs)', description: 'Higher breathing rate & developing pulmonary alveoli' },
  { value: 'seniors', label: 'Seniors (65+ yrs)', description: 'Elevated cardiovascular & inflammatory risks' },
  { value: 'asthma_respiratory', label: 'Asthma / COPD / Respiratory', description: 'Immediate bronchial spasm vulnerability' },
  { value: 'pregnant', label: 'Pregnant Individuals', description: 'Placental translocation of sub-micron particles' },
  { value: 'none', label: 'Healthy Adults Only', description: 'Standard physiological exposure baseline' },
];

export const COMMUTE_OPTIONS: SelectOption<CommuteMode>[] = [
  { value: 'two_wheeler', label: 'Open Two-Wheeler / Scooter', description: 'Direct unshielded tailpipe & road dust exposure' },
  { value: 'public_metro_bus', label: 'Public Transit (Metro / Bus)', description: 'Mixed exposure with filtered subway transit' },
  { value: 'private_car', label: 'Private Car / Cab', description: 'Cabin filtered but contributes to urban emissions' },
  { value: 'walk_cycle', label: 'Walking / Bicycle Commute', description: 'Maximum active inhalation of particulate matter' },
  { value: 'work_from_home', label: 'Remote / Work From Home', description: 'Zero transit exposure; high indoor dependency' },
];

export const FUEL_OPTIONS: SelectOption<CookingFuel>[] = [
  { value: 'lpg_gas', label: 'LPG Gas Cylinder', description: 'Emits NO2 & moisture inside closed winter rooms' },
  { value: 'induction_electric', label: 'Electric Induction / Air Fryer', description: 'Zero indoor combustion emissions' },
  { value: 'biomass_solid', label: 'Biomass / Coal / Firewood', description: 'Severe indoor black carbon & particulate hazard' },
];

export const GEAR_OPTIONS: SelectOption<CleanAirGear>[] = [
  { value: 'none', label: 'No Clean-Air Equipment', description: 'Unprotected baseline indoor environment' },
  { value: 'n95Masks', label: 'Certified N95 / FFP2 Masks', description: 'High personal protection during outdoor transit' },
  { value: 'diyBoxFan', label: 'DIY Box Fan / Custom Filter', description: 'Economical high-volume air scrubbing' },
  { value: 'hepaPurifier', label: 'Commercial HEPA Air Purifier', description: 'Automated multi-stage mechanical particulate removal' },
];
