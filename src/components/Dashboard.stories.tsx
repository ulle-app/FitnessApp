import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
const meta: Meta<typeof Dashboard> = {
  title: 'Components/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithUserData: Story = {
  args: {
    // Add user data props if your Dashboard accepts them
  },
}; 