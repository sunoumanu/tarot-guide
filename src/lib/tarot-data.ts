import type { TarotCard, Spread } from '@/types/tarot';

const MAJOR_ARCANA_COUNT = 22;
const MINOR_ARCANA_SUIT_COUNT = 14;
const SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'];

// Helper to generate placeholder Major Arcana cards
const generateMajorArcana = (): TarotCard[] => {
  const names = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
  ];
  return names.map((name, index) => ({
    id: `MA${index}`,
    name,
    meaning: `General meaning for ${name}. Represents major life lessons and archetypal themes.`,
    image: `https://placehold.co/250x425.png`, // Aspect ratio close to tarot cards
    keywords: name.toLowerCase().split(' '),
  }));
};

// Helper to generate placeholder Minor Arcana cards
const generateMinorArcana = (): TarotCard[] => {
  const cards: TarotCard[] = [];
  const courtCards = ['Page', 'Knight', 'Queen', 'King'];
  SUITS.forEach(suit => {
    // Numbered cards (Ace to 10)
    for (let i = 1; i <= 10; i++) {
      const cardName = (i === 1 ? 'Ace' : i.toString()) + ` of ${suit}`;
      cards.push({
        id: `MI${suit.substring(0,1)}${i}`,
        name: cardName,
        meaning: `General meaning for ${cardName}. Represents day-to-day events and experiences.`,
        image: `https://placehold.co/250x425.png`,
        keywords: [i === 1 ? 'ace' : i.toString(), 'of', suit.toLowerCase()],
        suit,
        number: i,
      });
    }
    // Court cards
    courtCards.forEach((courtCard, index) => {
      const cardName = `${courtCard} of ${suit}`;
      cards.push({
        id: `MI${suit.substring(0,1)}C${index+1}`,
        name: cardName,
        meaning: `General meaning for ${cardName}. Represents personalities or aspects of oneself.`,
        image: `https://placehold.co/250x425.png`,
        keywords: [courtCard.toLowerCase(), 'of', suit.toLowerCase()],
        suit,
        number: 11 + index, // Page=11, Knight=12, Queen=13, King=14
      });
    });
  });
  return cards;
};

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...generateMajorArcana(),
  ...generateMinorArcana(),
];

export const SPREADS: Spread[] = [
  {
    id: 'single',
    name: 'Single Card Draw',
    description: 'Quick insight or guidance on a specific question or general theme for the day.',
    cardCount: 1,
    positions: [
      { name: 'Overall Guidance', description: 'The main theme, answer, or advice.' },
    ],
  },
  {
    id: 'three-card',
    name: 'Three-Card Spread',
    description: 'A versatile spread for exploring past, present, and future, or a situation, action, and outcome.',
    cardCount: 3,
    positions: [
      { name: 'Past Influence / Situation', description: 'What led to the current situation or represents the core of the issue.' },
      { name: 'Present State / Action', description: 'The current circumstances or the recommended course of action.' },
      { name: 'Future Outcome / Outcome', description: 'The potential result if things continue as they are or if the action is taken.' },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross (Simplified)',
    description: 'A more in-depth look at a situation. (Simplified for this app)',
    cardCount: 5, // Simplified version
    positions: [
      { name: 'The Present', description: 'The current situation or the querent\'s state of mind.' },
      { name: 'The Challenge', description: 'Immediate challenges or obstacles affecting the situation.' },
      { name: 'The Past', description: 'Past events or influences that have led to the present.' },
      { name: 'The Future', description: 'Potential near-future developments.' },
      { name: 'The Outcome', description: 'The likely resolution or overall outcome.' },
    ],
  },
];
