import type { Meta, StoryObj } from '@storybook/react';
import Login from './Login';

const meta: Meta<typeof Login> = {
  title: 'Components/Login',
  component: Login,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPrefill: Story = {
  args: {
    // Add any props your Login component accepts
  },
}; 