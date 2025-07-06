import type { Meta, StoryObj } from '@storybook/react';
import Calculators from './Calculators';

const meta: Meta<typeof Calculators> = {
  title: 'Components/Tools/Calculators',
  component: Calculators,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithActiveCalculator: Story = {
  args: {
    // Add props to show a specific calculator active
  },
}; 