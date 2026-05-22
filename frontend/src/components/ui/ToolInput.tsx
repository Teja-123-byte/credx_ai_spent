'use client';

import { ChangeEvent } from 'react';
import { ToolEntry, ToolName } from '../../lib/types';
import { pricingData } from '../../lib/pricingData';

interface Props {
  tool: ToolName;
  value: ToolEntry;
  onChange: (update: Partial<ToolEntry>) => void;
  onRemove: () => void;
}

export default function ToolInput({ tool, value, onChange, onRemove }: Props) {
  const availablePlans = pricingData[tool].plans;

  return (
    <div className="p-6 rounded-xl border bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg capitalize">{tool}</h3>
        <button
          type="button"
          className="text-sm text-slate-600 hover:text-slate-900"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Plan</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={value.plan}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onChange({ plan: e.target.value as ToolEntry['plan'] })
            }
          >
            {availablePlans.map((plan) => (
              <option key={plan.name} value={plan.name}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Spend ($)</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            type="number"
            value={value.monthlySpend}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({ monthlySpend: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Seats</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            type="number"
            value={value.seats}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({ seats: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
}