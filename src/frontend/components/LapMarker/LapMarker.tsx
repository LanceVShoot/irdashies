import { useState, useEffect } from 'react';
import { useDrivingState, useCurrentSessionType, useTelemetryValue } from '@irdashies/context';
import { useSavedLaps, useSaveLap } from '../../context/LapMarkerStore/LapMarkerStore';
import { useStandingsSettings } from '../Standings/hooks/useStandingsSettings';
import { Toast } from './components/Toast/Toast';
import { LapList } from './components/LapList/LapList';

export const LapMarker = () => {
  const { isDriving } = useDrivingState();
  const sessionType = useCurrentSessionType();
  const currentLap = useTelemetryValue('Lap') ?? 0;
  const sessionTime = useTelemetryValue('SessionTime') ?? 0;
  const sessionNum = useTelemetryValue('SessionNum');

  const savedLaps = useSavedLaps();
  const saveLap = useSaveLap();
  const settings = useStandingsSettings();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle lap saving (will be triggered by hotkey)
  useEffect(() => {
    const handleSaveLap = () => {
      if (isDriving && sessionType === 'Race' && currentLap >= 0) {
        saveLap(currentLap, sessionTime, sessionNum ?? null);
        setToastMessage(`Lap ${currentLap} Saved`);
        // Clear toast after 3 seconds
        setTimeout(() => setToastMessage(null), 3000);
      }
    };

    // Listen for IPC message from main process
    const handleIpcMessage = (_event: Electron.IpcRendererEvent, message: string) => {
      if (message === 'save-lap') {
        handleSaveLap();
      }
    };

    if (window.electronAPI?.onMessage) {
      window.electronAPI.onMessage(handleIpcMessage);
    }

    return () => {
      if (window.electronAPI?.removeListener) {
        window.electronAPI.removeListener();
      }
    };
  }, [isDriving, sessionType, currentLap, sessionTime, sessionNum, saveLap]);

  // Don't show component when not on track and no saved laps
  if (!isDriving && savedLaps.length === 0) {
    return <></>;
  }

  return (
    <div className="w-full h-full text-white overflow-hidden">
      {/* Toast notification area - only show during race */}
      {isDriving && (
        <div className="h-8 mb-2">
          {toastMessage && <Toast message={toastMessage} />}
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1">
        {isDriving ? (
          // When driving: show current lap info and hint (transparent background)
          <div className="text-center text-sm text-gray-300">
            <div className="text-lg font-semibold text-white mb-1">
              Lap {currentLap}
            </div>
            <div className="text-xs text-gray-400">
              Press F8 to save lap
            </div>
          </div>
        ) : (
          // When not driving: show saved laps list with transparent background
          savedLaps.length > 0 && <LapList laps={savedLaps} backgroundOpacity={settings?.background?.opacity ?? 0} />
        )}
      </div>
    </div>
  );
};
