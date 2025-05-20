'use client';

import type { TarotReading } from '@/types/tarot';

const READINGS_STORAGE_KEY = 'mysticGuideReadings';

export const getSavedReadings = (): TarotReading[] => {
  if (typeof window === 'undefined') return [];
  try {
    const readingsJson = localStorage.getItem(READINGS_STORAGE_KEY);
    return readingsJson ? JSON.parse(readingsJson) : [];
  } catch (error) {
    console.error('Error retrieving readings from local storage:', error);
    return [];
  }
};

export const saveReading = (reading: TarotReading): void => {
  if (typeof window === 'undefined') return;
  try {
    const existingReadings = getSavedReadings();
    const updatedReadings = [reading, ...existingReadings]; // Add new reading to the top
    localStorage.setItem(READINGS_STORAGE_KEY, JSON.stringify(updatedReadings));
  } catch (error) {
    console.error('Error saving reading to local storage:', error);
  }
};

export const deleteReading = (readingId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const existingReadings = getSavedReadings();
    const updatedReadings = existingReadings.filter(r => r.id !== readingId);
    localStorage.setItem(READINGS_STORAGE_KEY, JSON.stringify(updatedReadings));
  } catch (error) {
    console.error('Error deleting reading from local storage:', error);
  }
};

export const getReadingById = (readingId: string): TarotReading | undefined => {
  if (typeof window === 'undefined') return undefined;
  const readings = getSavedReadings();
  return readings.find(r => r.id === readingId);
};
