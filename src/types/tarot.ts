export interface TarotCard {
  id: string;
  name: string;
  meaning: string; // General meaning
  image: string; // URL to placeholder image
  keywords: string[];
  suit?: string; // For Minor Arcana
  number?: number; // For Minor Arcana (Ace=1, Page=11, Knight=12, Queen=13, King=14)
}

export interface SpreadPosition {
  name: string;
  description: string;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface SelectedCardInReading {
  card: TarotCard;
  positionName: string;
  positionDescription: string;
}

export interface TarotReading {
  id: string; // Unique ID, e.g., timestamp
  spreadName: string;
  spreadDescription: string;
  cardsInReading: SelectedCardInReading[];
  interpretation: string;
  date: string; // ISO string
}
