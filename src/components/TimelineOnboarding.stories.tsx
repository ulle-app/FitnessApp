import type { Meta, StoryObj } from '@storybook/react';
import TimelineOnboarding from './TimelineOnboarding';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../context/UserContext';

const meta: Meta<typeof TimelineOnboarding> = {
  title: 'Components/TimelineOnboarding',
  component: TimelineOnboarding,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/onboarding']}>
        <UserProvider>
          <Story />
        </UserProvider>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'This story shows the full, modern, multi-step onboarding flow. Click through each step to experience the onboarding as a user would in a top fitness app.',
      },
    },
  },
}; 