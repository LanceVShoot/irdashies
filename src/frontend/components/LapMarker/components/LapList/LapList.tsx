import { FC, useMemo } from 'react';
import { SavedLap, useMarkLapViewed } from '../../../../context/LapMarkerStore/LapMarkerStore';
import { formatTime } from '@irdashies/utils/time';

interface LapListProps {
  laps: SavedLap[];
  backgroundOpacity?: number;
}

export const LapList: FC<LapListProps> = ({ laps, backgroundOpacity = 0 }) => {
  const markLapViewed = useMarkLapViewed();

  const formattedLaps = useMemo(() => {
    return laps.map(lap => ({
      ...lap,
      formattedTime: formatTime(lap.timestamp, 'full'),
    }));
  }, [laps]);

  const handleLapClick = (lap: SavedLap) => {
    // Mark lap as viewed
    markLapViewed(lap.lapNumber);
    // TODO: Implement replay seeking functionality
    console.log('Clicked lap:', lap);
  };

  return (
    <div
      className={`w-full bg-slate-800/(--bg-opacity) rounded-sm p-2 text-white overflow-hidden`}
      style={{
        ['--bg-opacity' as string]: `${backgroundOpacity}%`,
      }}
    >
      <div className="bg-slate-900/70 text-sm px-3 py-1 mb-2 flex justify-center">
        <div className="flex">Saved Laps</div>
      </div>
      <table className="w-full table-auto text-sm border-separate border-spacing-y-1.5">
        <tbody>
          {formattedLaps.map((lap) => (
            <tr
              key={`${lap.lapNumber}-${lap.timestamp}`}
              className={`bg-slate-900/70 text-sm ${lap.viewed ? 'opacity-50' : ''}`}
            >
              <td
                className={`px-3 py-2 cursor-pointer hover:bg-slate-600 transition-colors duration-200 font-medium flex justify-between ${
                  lap.viewed ? 'text-gray-400' : 'text-white'
                }`}
                onClick={() => handleLapClick(lap)}
              >
                <span>Lap {lap.lapNumber}</span>
                <span>{lap.formattedTime}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
