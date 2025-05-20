'use client';

import type { Spread } from '@/types/tarot';
import { SPREADS } from '@/lib/tarot-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SpreadSelectorProps {
  onSpreadSelect: (spread: Spread) => void;
}

export default function SpreadSelector({ onSpreadSelect }: SpreadSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Choose Your Spread</h2>
        <p className="text-muted-foreground mt-2">Select a layout to begin your tarot journey.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPREADS.map((spread) => (
          <Card key={spread.id} className="flex flex-col justify-between_ overflow-hidden_ shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  {spread.name}
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg">
                      <p className="font-semibold text-sm mb-1">Positions:</p>
                      <ul className="list-disc list-inside text-xs space-y-0.5">
                        {spread.positions.map(p => <li key={p.name}><strong>{p.name}:</strong> {p.description}</li>)}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-sm pt-1">{spread.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow_">
               {/* Could add a visual representation of the spread here */}
              <p className="text-xs text-muted-foreground">{spread.cardCount} card{spread.cardCount > 1 ? 's' : ''}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button
                onClick={() => onSpreadSelect(spread)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                aria-label={`Select ${spread.name} spread`}
              >
                Select Spread
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
