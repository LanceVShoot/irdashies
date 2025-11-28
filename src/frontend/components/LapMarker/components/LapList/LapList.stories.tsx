import type { Meta, StoryObj } from '@storybook/react-vite';
import { LapList } from './LapList';

export default {
  component: LapList,
  decorators: [(Story) => (
    <div style={{ width: '200px', backgroundColor: '#1e293b', padding: '8px', borderRadius: '4px' }}>
      <Story />
    </div>
  )],
} as Meta;

type Story = StoryObj<typeof LapList>;

export const Empty: Story = {
  args: {
    laps: [],
  },
};

export const SingleLap: Story = {
  args: {
    laps: [
      {
        lapNumber: 1,
        timestamp: 123456789,
      },
    ],
  },
};

export const MultipleLaps: Story = {
  args: {
    laps: [
      {
        lapNumber: 1,
        timestamp: 123456789,
      },
      {
        lapNumber: 2,
        timestamp: 123466789,
      },
      {
        lapNumber: 3,
        timestamp: 123476789,
      },
      {
        lapNumber: 4,
        timestamp: 123486789,
      },
      {
        lapNumber: 5,
        timestamp: 123496789,
      },
    ],
  },
};

export const ManyLaps: Story = {
  args: {
    laps: Array.from({ length: 15 }, (_, i) => ({
      lapNumber: i + 1,
      timestamp: 123456789 + i * 10000,
    })),
  },
};

export const WithViewedLaps: Story = {
  args: {
    laps: [
      {
        lapNumber: 1,
        timestamp: 123456789,
        viewed: true,
      },
      {
        lapNumber: 2,
        timestamp: 123466789,
      },
      {
        lapNumber: 3,
        timestamp: 123476789,
        viewed: true,
      },
      {
        lapNumber: 4,
        timestamp: 123486789,
      },
      {
        lapNumber: 5,
        timestamp: 123496789,
      },
    ],
  },
};
