import type { TarotCard, Spread } from '@/types/tarot';

const MAJOR_ARCANA_COUNT = 22;
const MINOR_ARCANA_SUIT_COUNT = 14;
const SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'];

// Helper to generate placeholder Major Arcana cards
const generateMajorArcana = (): TarotCard[] => {
  // Major Arcana cards with their names and filenames
  const cards = [
    { id: 0, name: 'The Fool', filename: 'RWS_Tarot_00_Fool.jpg' },
    { id: 1, name: 'The Magician', filename: 'RWS_Tarot_01_Magician.jpg' },
    { id: 2, name: 'The High Priestess', filename: 'RWS_Tarot_02_High_Priestess.jpg' },
    { id: 3, name: 'The Empress', filename: 'RWS_Tarot_03_Empress.jpg' },
    { id: 4, name: 'The Emperor', filename: 'RWS_Tarot_04_Emperor.jpg' },
    { id: 5, name: 'The Hierophant', filename: 'RWS_Tarot_05_Hierophant.jpg' },
    { id: 6, name: 'The Lovers', filename: 'RWS_Tarot_06_Lovers.jpg' },
    { id: 7, name: 'The Chariot', filename: 'RWS_Tarot_07_Chariot.jpg' },
    { id: 8, name: 'Strength', filename: 'RWS_Tarot_08_Strength.jpg' },
    { id: 9, name: 'The Hermit', filename: 'RWS_Tarot_09_Hermit.jpg' },
    { id: 10, name: 'Wheel of Fortune', filename: 'RWS_Tarot_10_Wheel_of_Fortune.jpg' },
    { id: 11, name: 'Justice', filename: 'RWS_Tarot_11_Justice.jpg' },
    { id: 12, name: 'The Hanged Man', filename: 'RWS_Tarot_12_Hanged_Man.jpg' },
    { id: 13, name: 'Death', filename: 'RWS_Tarot_13_Death.jpg' },
    { id: 14, name: 'Temperance', filename: 'RWS_Tarot_14_Temperance.jpg' },
    { id: 15, name: 'The Devil', filename: 'RWS_Tarot_15_Devil.jpg' },
    { id: 16, name: 'The Tower', filename: 'RWS_Tarot_16_Tower.jpg' },
    { id: 17, name: 'The Star', filename: 'RWS_Tarot_17_Star.jpg' },
    { id: 18, name: 'The Moon', filename: 'RWS_Tarot_18_Moon.jpg' },
    { id: 19, name: 'The Sun', filename: 'RWS_Tarot_19_Sun.jpg' },
    { id: 20, name: 'Judgement', filename: 'RWS_Tarot_20_Judgement.jpg' },
    { id: 21, name: 'The World', filename: 'RWS_Tarot_21_World.jpg' }
  ];

  return cards.map(({ id, name, filename }) => ({
    id: `MA${id}`,
    name,
    meaning: `General meaning for ${name}. Represents major life lessons and archetypal themes.`,
    image: `/images/tarot/${filename}.jpg`,
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
      const filename = `${suit.toLowerCase()}-${i.toString().padStart(2, '0')}`;
      cards.push({
        id: `MI${suit.substring(0,1)}${i}`,
        name: cardName,
        meaning: `General meaning for ${cardName}. Represents day-to-day events and experiences.`,
        image: `/images/tarot/${filename}.jpg`,
        keywords: [i === 1 ? 'ace' : i.toString(), 'of', suit.toLowerCase()],
        suit,
        number: i,
      });
    }
    // Court cards
    courtCards.forEach((courtCard, index) => {
      const cardName = `${courtCard} of ${suit}`;
      const filename = `${suit.toLowerCase()}-${courtCard.toLowerCase()}`;
      cards.push({
        id: `MI${suit.substring(0,1)}C${index+1}`,
        name: cardName,
        meaning: `General meaning for ${cardName}. Represents personalities or aspects of oneself.`,
        image: `/images/tarot/${filename}.jpg`,
        keywords: [courtCard.toLowerCase(), 'of', suit.toLowerCase()],
        suit,
        number: 11 + index,
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
