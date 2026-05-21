'use client';

import { ToolName } from '@/lib/types';
import { pricingData } from '@/lib/pricingData';

interface Props {
  tool: ToolName;
  value: ToolEntry;
  onChange: (update: Partial<ToolEntry>) => void;
  onRemove: () => void;
}

export default function ToolInput({ tool, value, onChange, onRemove }: Props) {
  const availablePlans = pricingData[tool].plans;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg capitalize">{tool}</h3>
        <Button variant="ghost" size="sm" onClick={onRemove}>Remove</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Plan</Label>
          <Select value={value.plan} onValueChange={(p) => onChange({ plan: p })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePlans.map(p => (
                <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Monthly Spend ($)</Label>
          <Input 
            type="number" 
            value={value.monthlySpend}
            onChange={e => onChange({ monthlySpend: +e.target.value })}
          />
        </div>

        <div>
          <Label>Seats</Label>
          <Input 
            type="number" 
            value={value.seats}
            onChange={e => onChange({ seats: +e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}