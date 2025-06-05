
'use client';

import { useState, useEffect } from 'react';
import type { TarotReading } from '@/types/tarot';
import { getSavedReadings, deleteReading } from '@/lib/localStorage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import TarotCardDisplay from '@/components/tarot/TarotCardDisplay';
import { Trash2, Eye, CalendarDays, BookOpen, ArrowLeft, Wand2 } from 'lucide-react'; // Added ArrowLeft
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function SavedReadingsPage() {
  const [savedReadings, setSavedReadings] = useState<TarotReading[]>([]);
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(null);
  const [clientLoaded, setClientLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSavedReadings(getSavedReadings());
    setClientLoaded(true);
  }, []);

  const handleDeleteReading = (readingId: string) => {
    deleteReading(readingId);
    setSavedReadings(getSavedReadings()); // Refresh the list
    toast({ title: "Reading Deleted", description: "The reading has been removed.", variant: "destructive" });
  };

  if (!clientLoaded) {
    // Prevents hydration errors by not rendering list until client has loaded localStorage
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-12">
            <Wand2 className="mx-auto h-16 w-16 text-primary animate-pulse mb-4" />
            <p className="text-muted-foreground">Loading your mystical archives...</p>
        </div>
    );
  }

  if (savedReadings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-12">
        <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">No Saved Readings Yet</h2>
        <p className="text-muted-foreground mb-6">
          Your mystical insights will appear here once you save them.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">Get a New Reading</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!selectedReading && (
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8" /> Your Saved Readings
          </h1>
          <p className="text-muted-foreground mt-1">Review your past journeys and insights.</p>
        </div>
      )}
      
      {selectedReading ? (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-primary flex items-center gap-2"><Wand2 className="h-6 w-6" />{selectedReading.spreadName}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
                  <CalendarDays className="h-3.5 w-3.5" /> 
                  Read on: {new Date(selectedReading.date).toLocaleDateString()} at {new Date(selectedReading.date).toLocaleTimeString()}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedReading(null)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-accent">Drawn Cards</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6 mb-6">
              {selectedReading.cardsInReading.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-1">
                  <TarotCardDisplay card={item.card} size="small" isFaceDown={false} />
                  <p className="mt-1 text-xs font-semibold text-foreground max-w-[80px] truncate">{item.card.name}</p>
                  <p className="text-xs text-muted-foreground max-w-[80px] truncate capitalize">{item.positionName}</p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4 bg-border/50" />

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-accent mb-3 text-center">Mystic Interpretation</h3>
              <ScrollArea className="h-[250px] w-full rounded-md border border-input p-4 bg-background/70">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{selectedReading.interpretation}</p>
              </ScrollArea>
            </div>
          </CardContent>
           <CardFooter className="flex justify-end pt-4">
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete This Reading
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this tarot reading.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        handleDeleteReading(selectedReading.id);
                        setSelectedReading(null); 
                    }}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedReadings.map((reading) => (
            <Card key={reading.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 bg-card/80 backdrop-blur-sm transform hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary truncate flex items-center gap-1.5"><Wand2 className="h-5 w-5 shrink-0" />{reading.spreadName}</CardTitle>
                <CardDescription className="text-xs flex items-center gap-1 text-muted-foreground">
                  <CalendarDays className="h-3 w-3" /> {new Date(reading.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 pb-4">
                <p className="text-sm text-card-foreground line-clamp-3">
                  {reading.interpretation.substring(0, 100)}...
                </p>
                <div className="flex gap-1 flex-wrap pt-1">
                    {reading.cardsInReading.slice(0,3).map(cr => (
                         <span key={cr.card.id} className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">{cr.card.name}</span>
                    ))}
                    {reading.cardsInReading.length > 3 && <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">+{reading.cardsInReading.length - 3} more</span>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center gap-2 pt-3 pb-4 border-t border-border/50">
                <Button variant="outline" size="sm" onClick={() => setSelectedReading(reading)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete reading</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this tarot reading.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteReading(reading.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
