import type { Meta, StoryObj } from '@storybook/react-vite';
import { LapMarker } from './LapMarker';
import { TelemetryDecorator, DynamicTelemetrySelector } from '@irdashies/storybook';
import { useState } from 'react';
import { useLapMarkerStore } from '../../context/LapMarkerStore/LapMarkerStore';

interface MockElectronAPI {
  onMessage: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => void;
  removeListener: () => void;
}

declare global {
  interface Window {
    electronAPI?: MockElectronAPI;
  }
}

export default {
  component: LapMarker,
  decorators: [(Story) => (
    <div style={{ width: '200px' }}>
      <Story />
    </div>
  )],
} as Meta;

type Story = StoryObj<typeof LapMarker>;

export const Primary: Story = {
  decorators: [
    (Story, context) => {
      // Mock saved laps in the store for the primary story
      useLapMarkerStore.setState({
        savedLaps: [
          { lapNumber: 1, timestamp: 123456789 },
          { lapNumber: 2, timestamp: 123466789 },
          { lapNumber: 3, timestamp: 123476789 },
          { lapNumber: 4, timestamp: 123486789 },
          { lapNumber: 5, timestamp: 123496789 },
        ],
        sessionNum: 1,
      });

      return TelemetryDecorator('/test-data/1732355190142')(Story, context);
    }
  ],
};

export const DynamicTelemetry: Story = {
  decorators: [(Story, context) => {
    const [selectedPath, setSelectedPath] = useState('/test-data/1731637331038');

    return (
      <>
        <DynamicTelemetrySelector
          onPathChange={setSelectedPath}
          initialPath={selectedPath}
        />
        {TelemetryDecorator(selectedPath)(Story, context)}
      </>
    );
  }],
};

export const RaceSession: Story = {
  decorators: [TelemetryDecorator('/test-data/1731667156475')],
};

export const PracticeSession: Story = {
  decorators: [TelemetryDecorator('/test-data/1731639076383')],
};

export const QualifyingSession: Story = {
  decorators: [TelemetryDecorator('/test-data/1731663455602')],
};

export const NotDriving: Story = {
  decorators: [TelemetryDecorator('/test-data/1732355190142')],
};

export const WithNotification: Story = {
  decorators: [
    (Story, context) => {
      // Set up mock electronAPI before component renders
      (window as any).electronAPI = {
        onMessage: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => {
          // Simulate receiving save-lap message after 1 second
          setTimeout(() => callback({} as Electron.IpcRendererEvent, 'save-lap'), 1000);
        },
        removeListener: () => {
          // Mock remove listener - no-op for stories
        }
      };

      return TelemetryDecorator('/test-data/1731663749009')(Story, context);
    }
  ],
  parameters: {
    docs: {
      description: {
        story: 'Tests the lap saved notification by mocking the electronAPI IPC message. Now allows saving laps even when currentLap is 0.'
      }
    }
  }
};

export const WithSavedLaps: Story = {
  decorators: [
    (Story, context) => {
      // Mock saved laps in the store before rendering
      useLapMarkerStore.setState({
        savedLaps: [
          { lapNumber: 1, timestamp: 123456789 },
          { lapNumber: 3, timestamp: 123476789 },
          { lapNumber: 5, timestamp: 123496789 },
          { lapNumber: 7, timestamp: 123516789 },
          { lapNumber: 9, timestamp: 123536789 },
        ],
        sessionNum: 1,
      });

      return TelemetryDecorator('/test-data/1732355190142')(Story, context);
    }
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows the LapList component with multiple saved laps when not driving.'
      }
    }
  }
};
