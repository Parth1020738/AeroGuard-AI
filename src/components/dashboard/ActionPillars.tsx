import React, { useState } from 'react';
import { ActionCategory, SmogActionItem } from '../../types/airQuality';
import { ActionCard } from './ActionCard';

interface ActionPillarsProps {
  actions: SmogActionItem[];
  onToggle: (id: string) => void;
}

type TabFilter = 'all' | ActionCategory;

export function ActionPillars({ actions, onToggle }: ActionPillarsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filteredActions =
    activeTab === 'all' ? actions : actions.filter((a) => a.category === activeTab);

  const tabs: { id: TabFilter; label: string }[] = [
    { id: 'all', label: `All Actions (${actions.length})` },
    { id: 'low_emission_routine', label: 'Routines' },
    { id: 'iaq_hack', label: 'Indoor Clean Air Hacks' },
    { id: 'sustainable_alternative', label: 'Sustainable Alternatives' },
  ];

  return (
    <section className="space-y-5" aria-labelledby="action-pillars-heading">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
            Categorized Smog Mitigation Engine
          </span>
          <h2 id="action-pillars-heading" className="text-xl font-bold text-slate-900 tracking-tight">
            Targeted Smog Defense Actions
          </h2>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Action Category Filters"
          className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeTab === tab.id
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.map((action) => (
          <ActionCard key={action.id} action={action} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}
