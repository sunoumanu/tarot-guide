
'use client';

import { useState, useEffect } from 'react';
import type { TarotCard, Spread, SelectedCardInReading, TarotReading } from '@/types/tarot';
import { ALL_TAROT_CARDS } from '@/lib/tarot-data';
import { generateTarotReading } from '@/ai/flows/generate-tarot-reading';
import { saveReading as saveReadingToLocalStorage } from '@/lib/localStorage';
import SpreadSelector from '@/components/tarot/SpreadSelector';
import TarotCardDisplay from '@/components/tarot/TarotCardDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shuffle, Save, Sparkles, HelpCircle, Loader2, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';

type ReadingStep = 'spreadSelection' | 'cardSelection' | 'readingDisplay';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TarotPage() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState<ReadingStep>('spreadSelection');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [drawnCardsWithPositions, setDrawnCardsWithPositions] = useState<Array<SelectedCardInReading | null>>([]);
  const [currentPositionToDraw, setCurrentPositionToDraw] = useState<number>(0);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    setDeck(shuffleArray(ALL_TAROT_CARDS));
  }, []);

  const handleSpreadSelect = (spread: Spread) => {
    setSelectedSpread(spread);
    setDrawnCardsWithPositions(Array(spread.cardCount).fill(null)); // Initialize with nulls
    setCurrentPositionToDraw(0);
    setAiInterpretation(null);
    setDeck(shuffleArray(ALL_TAROT_CARDS)); 
    setCurrentStep('cardSelection');
  };

  const handleDrawCard = () => {
    if (!selectedSpread || deck.length === 0 || currentPositionToDraw >= selectedSpread.cardCount) return;

    const cardDrawn = deck[0]; 
    const remainingDeck = deck.slice(1);
    setDeck(remainingDeck);

    const position = selectedSpread.positions[currentPositionToDraw];
    
    setDrawnCardsWithPositions(prev => {
      const newDrawnCards = [...prev];
      newDrawnCards[currentPositionToDraw] = { 
        card: cardDrawn, 
        positionName: position.name, 
        positionDescription: position.description 
      };
      return newDrawnCards;
    });
    setCurrentPositionToDraw(prev => prev + 1);
  };

  const handleGenerateReading = async () => {
    if (!selectedSpread || drawnCardsWithPositions.some(c => c === null) || drawnCardsWithPositions.length !== selectedSpread.cardCount) {
      toast({ title: "Error", description: "Please draw all cards for the spread.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const aiInput = {
        spreadName: selectedSpread.name,
        cards: drawnCardsWithPositions.filter(item => item !== null).map(item => ({ name: item!.card.name, meaning: item!.card.meaning })),
      };
      const result = await generateTarotReading(aiInput);
      setAiInterpretation(result.reading);
      setCurrentStep('readingDisplay');
    } catch (error) {
      console.error("Error generating reading:", error);
      toast({ title: "AI Error", description: "Failed to generate reading. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReading = () => {
    if (!selectedSpread || !aiInterpretation || drawnCardsWithPositions.some(c => c === null)) return;
    const newReading: TarotReading = {
      id: Date.now().toString(),
      spreadName: selectedSpread.name,
      spreadDescription: selectedSpread.description,
      cardsInReading: drawnCardsWithPositions.filter(item => item !== null) as SelectedCardInReading[], // Type assertion
      interpretation: aiInterpretation,
      date: new Date().toISOString(),
    };
    saveReadingToLocalStorage(newReading);
    toast({ title: "Reading Saved", description: "Your tarot reading has been saved.", className: "bg-accent text-accent-foreground" });
  };
  
  const resetFlow = () => {
    setCurrentStep('spreadSelection');
    setSelectedSpread(null);
    setDrawnCardsWithPositions([]);
    setCurrentPositionToDraw(0);
    setAiInterpretation(null);
    setDeck(shuffleArray(ALL_TAROT_CARDS));
  };

  const cardsLeftToDraw = selectedSpread ? selectedSpread.cardCount - drawnCardsWithPositions.filter(c => c !== null).length : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {currentStep !== 'spreadSelection' && (
        <Button variant="outline" onClick={resetFlow} className="mb-6 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('actions.startOver')}
        </Button>
      )}

      {currentStep === 'spreadSelection' && <SpreadSelector onSpreadSelect={handleSpreadSelect} />}

      {currentStep === 'cardSelection' && selectedSpread && (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Wand2 className="h-6 w-6"/> Draw Cards for: {selectedSpread.name}
            </CardTitle>
            <CardDescription>
              {selectedSpread.description}<br />
              Draw {selectedSpread.cardCount} card{selectedSpread.cardCount > 1 ? 's' : ''}.
              {currentPositionToDraw < selectedSpread.cardCount && (
                <span className="block mt-1 font-semibold text-accent">
                  Next card for: {selectedSpread.positions[currentPositionToDraw].name} 
                  <em className="ml-1 text-xs font-normal text-muted-foreground">({selectedSpread.positions[currentPositionToDraw].description})</em>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap justify-center items-start gap-4 mb-6 min-h-[280px]"> {/* min-h to prevent layout shift */}
              {Array.from({ length: selectedSpread.cardCount }).map((_, index) => {
                const drawnCardItem = drawnCardsWithPositions[index];
                const isCurrentDrawSlot = index === currentPositionToDraw && !drawnCardItem;
                return (
                  <div key={index} className="flex flex-col items-center space-y-1">
                    <TarotCardDisplay
                      card={drawnCardItem ? drawnCardItem.card : null}
                      isFaceDown={!drawnCardItem} // True if no card drawn yet for this slot
                      onCardClick={isCurrentDrawSlot ? handleDrawCard : undefined}
                      className={isCurrentDrawSlot ? "animate-pulse border-2 border-accent shadow-lg shadow-accent/30" : "border-2 border-transparent"}
                      size="medium"
                    />
                     <p className="text-sm font-medium text-foreground h-5 capitalize">{drawnCardItem ? selectedSpread.positions[index].name : (isCurrentDrawSlot ? 'Click to Draw' : selectedSpread.positions[index].name)}</p>
                     <p className="text-xs text-muted-foreground h-4">{drawnCardItem ? '' : (isCurrentDrawSlot ? `for ${selectedSpread.positions[index].name}` : '')}</p>
                  </div>
                );
              })}
            </div>

            {cardsLeftToDraw > 0 && (
              <div className="text-center">
                <Button
                  onClick={handleDrawCard}
                  disabled={isLoading || currentPositionToDraw >= selectedSpread.cardCount}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg"
                  aria-label={`Draw card for ${selectedSpread.positions[currentPositionToDraw]?.name}`}
                >
                  <HelpCircle className="mr-2 h-5 w-5" /> Draw Card ({cardsLeftToDraw} left)
                </Button>
              </div>
            )}

            {cardsLeftToDraw === 0 && currentPositionToDraw === selectedSpread.cardCount && (
              <div className="text-center">
                <Button
                  onClick={handleGenerateReading}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                  aria-label="Get your Tarot Reading"
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Get Your Reading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 'readingDisplay' && selectedSpread && aiInterpretation && drawnCardsWithPositions.every(c => c !== null) && (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-primary flex items-center gap-2">
              <Sparkles className="h-7 w-7"/> Your {selectedSpread.name} Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-accent">Drawn Cards</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 mb-6">
              {drawnCardsWithPositions.map((item, index) => {
                if (!item) return null; // Should not happen if check above is done
                return (
                <div key={index} className="flex flex-col items-center text-center space-y-1">
                  <TarotCardDisplay card={item.card} size="medium" isFaceDown={false} />
                  <p className="mt-2 font-semibold text-foreground">{item.card.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{item.positionName}</p>
                  <p className="text-xs text-muted-foreground/80 italic max-w-[150px]">({item.positionDescription})</p>
                </div>
                );
            })}
            </div>
            
            <Separator className="my-6 bg-border/50" />

            <div>
              <h3 className="text-xl font-semibold text-accent mb-3 text-center">Mystic Interpretation</h3>
              <ScrollArea className="h-[200px] md:h-[300px] w-full rounded-md border border-input p-4 bg-background/70">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{aiInterpretation}</p>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Button onClick={handleSaveReading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-4 w-4" /> Save Reading
            </Button>
            <Button variant="outline" onClick={resetFlow}>
              <Shuffle className="mr-2 h-4 w-4" /> New Reading
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
