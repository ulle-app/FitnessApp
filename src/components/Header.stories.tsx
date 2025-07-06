import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';
const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
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

export const WithUser: Story = {
  args: {
    // Add any props your Header component accepts
  },
}; 