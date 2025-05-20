
'use client';

import Image from 'next/image';
import type { TarotCard } from '@/types/tarot';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Wand2 } from 'lucide-react'; // Import Wand2 from lucide-react
import React, { useState, useEffect, useRef } from 'react';

interface TarotCardDisplayProps {
  card: TarotCard | null;
  isFaceDown?: boolean; // If true, card is meant to be face down (e.g., placeholder or explicitly hidden)
  className?: string;
  onCardClick?: () => void; // For drawing cards or other interactions
  size?: 'small' | 'medium' | 'large';
  isClickableToReveal?: boolean; // If true, a face-down card can be clicked to reveal it
}

export default function TarotCardDisplay({
  card,
  isFaceDown: isFaceDownProp = false, // Default to face up if card is provided, face down if card is null.
  className,
  onCardClick,
  size = 'medium',
  isClickableToReveal = false,
}: TarotCardDisplayProps) {
  const dimensions = {
    small: { width: 80, height: 136, text: 'text-xs', iconSize: 'h-10 w-10' },
    medium: { width: 150, height: 255, text: 'text-sm', iconSize: 'h-16 w-16' },
    large: { width: 250, height: 425, text: 'text-base', iconSize: 'h-24 w-24' },
  };
  const currentDimensions = dimensions[size];

  // Determine initial flip state based on card presence and isFaceDownProp
  const initialIsFlipped = !!card && !isFaceDownProp;
  const [isFlipped, setIsFlipped] = useState(initialIsFlipped);
  
  const prevCardRef = useRef(card);
  const prevIsFaceDownPropRef = useRef(isFaceDownProp);

  useEffect(() => {
    const cardJustAppeared = card && !prevCardRef.current;
    const propChangedToFaceUp = !!card && prevIsFaceDownPropRef.current && !isFaceDownProp;

    if (cardJustAppeared || propChangedToFaceUp) {
      // Card is present and should be shown face up, trigger flip
      const timer = setTimeout(() => setIsFlipped(true), 50); // Small delay for CSS transition
      return () => clearTimeout(timer);
    } else if (!card || isFaceDownProp) {
      // Card is not present or explicitly face down, ensure it's not flipped
      setIsFlipped(false);
    }
    
    prevCardRef.current = card;
    prevIsFaceDownPropRef.current = isFaceDownProp;
  }, [card, isFaceDownProp]);


  const handleInternalClick = () => {
    if (onCardClick) {
      onCardClick();
    }
    if (isClickableToReveal && card && !isFlipped) {
      setIsFlipped(true);
    }
  };

  const cardFaceFront = (
    <Card
      className={cn(
        'w-full h-full shadow-lg overflow-hidden flex flex-col',
        // Remove hover effects from here if applied by outer container
      )}
    >
      <CardContent className="p-0 aspect-[250/425] flex items-center justify-center flex-grow">
        {card ? (
          <Image
            src={card.image}
            alt={card.name}
            width={currentDimensions.width}
            height={currentDimensions.height - (size === 'small' ? 28 : size === 'medium' ? 36 : 44) } // Adjust height for footer
            className="object-contain rounded-t-md"
            data-ai-hint={`${card.keywords.join(' ')} tarot card`}
            priority={size === 'large'} // Prioritize larger images
          />
        ) : (
          // Fallback for front face if card somehow null but meant to be shown
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Wand2 className={cn(currentDimensions.iconSize, "text-muted-foreground")} />
          </div>
        )}
      </CardContent>
      {card && (
        <CardFooter className={cn("p-1 border-t", currentDimensions.text, 
          size === 'small' ? 'py-1' : 'py-1.5'
        )}>
          <p className="w-full text-center font-semibold truncate text-card-foreground">{card.name}</p>
        </CardFooter>
      )}
    </Card>
  );

  const cardFaceBack = (
    <div className="w-full h-full flex flex-col items-center justify-center bg-primary rounded-lg border-2 border-primary/70 group-hover:border-accent transition-colors">
      <Wand2 className={cn(currentDimensions.iconSize, "text-primary-foreground/70 group-hover:text-accent transition-colors")} />
    </div>
  );

  // Clickable if onCardClick is provided (typically for drawing) or if it's clickable to reveal
  const isActuallyClickable = !!onCardClick || (isClickableToReveal && card && !isFlipped);

  return (
    <div
      className={cn(
        'tarot-card-outer-container group',
        onCardClick && !card ? 'cursor-pointer' : '', // Cursor pointer if it's a draw slot
        isClickableToReveal && card && !isFlipped ? 'cursor-pointer' : '', // Cursor pointer if clickable to reveal
        className
      )}
      style={{ width: `${currentDimensions.width}px`, height: `${currentDimensions.height}px` }}
      onClick={isActuallyClickable ? handleInternalClick : undefined}
      onKeyDown={isActuallyClickable ? (e) => (e.key === 'Enter' || e.key === ' ') && handleInternalClick() : undefined}
      role={isActuallyClickable ? 'button' : undefined}
      tabIndex={isActuallyClickable ? 0 : undefined}
      aria-label={isFaceDownProp || !card ? 'Card back' : (card ? card.name : 'Card slot')}
    >
      <div className={cn('tarot-card-flipper', { 'is-flipped': isFlipped })}>
        <div className="tarot-card-face tarot-card-back">
          {cardFaceBack}
        </div>
        <div className="tarot-card-face tarot-card-front">
          {cardFaceFront}
        </div>
      </div>
    </div>
  );
}
