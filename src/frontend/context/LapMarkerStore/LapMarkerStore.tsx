import { create, useStore } from 'zustand';

export interface SavedLap {
  lapNumber: number;
  timestamp: number; // Session time when lap was saved
  viewed?: boolean; // Whether this lap has been viewed/clicked
}

interface LapMarkerState {
  savedLaps: SavedLap[];
  sessionNum: number | null;
  saveLap: (lapNumber: number, timestamp: number, sessionNum: number | null) => void;
  markLapViewed: (lapNumber: number) => void;
  clearLaps: () => void;
  reset: () => void; // For session changes
}

export const useLapMarkerStore = create<LapMarkerState>((set, get) => ({
  savedLaps: [],
  sessionNum: null,

  saveLap: (lapNumber, timestamp, sessionNum) => {
    const { savedLaps, sessionNum: prevSessionNum } = get();

    // Auto-reset if session changed
    if (prevSessionNum !== null && sessionNum !== null && sessionNum !== prevSessionNum) {
      console.log(`[LapMarkerStore] Session changed from ${prevSessionNum} to ${sessionNum}, resetting`);
      set({
        savedLaps: [],
        sessionNum,
      });
      return;
    }

    // Avoid duplicates
    if (!savedLaps.some(lap => lap.lapNumber === lapNumber)) {
      set({
        savedLaps: [...savedLaps, { lapNumber, timestamp }],
        sessionNum,
      });
    }
  },

  markLapViewed: (lapNumber) => {
    const { savedLaps } = get();
    const updatedLaps = savedLaps.map(lap =>
      lap.lapNumber === lapNumber ? { ...lap, viewed: true } : lap
    );
    set({ savedLaps: updatedLaps });
  },

  clearLaps: () => {
    set({ savedLaps: [] });
  },

  reset: () => {
    set({ savedLaps: [], sessionNum: null });
  },
}));

/**
 * @returns Array of saved laps with lap numbers and timestamps
 */
export const useSavedLaps = (): SavedLap[] => useStore(useLapMarkerStore, (state) => state.savedLaps);

/**
 * @returns Function to save a lap
 */
export const useSaveLap = () => useStore(useLapMarkerStore, (state) => state.saveLap);

/**
 * @returns Function to mark a lap as viewed
 */
export const useMarkLapViewed = () => useStore(useLapMarkerStore, (state) => state.markLapViewed);

/**
 * @returns Function to clear all saved laps
 */
