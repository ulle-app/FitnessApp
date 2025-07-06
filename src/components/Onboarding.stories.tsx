import type { Meta, StoryObj } from '@storybook/react';
import Onboarding from './Onboarding';
import { MemoryRouter } from 'react-router-dom';
// If your Onboarding component needs user context, import it here:
// import { UserProvider } from '../context/UserContext';

const meta: Meta<typeof Onboarding> = {
  title: 'Components/Onboarding',
  component: Onboarding,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/onboarding"]}>
        {/* Uncomment below if you need user context */}
        {/* <UserProvider> */}
          <Story />
        {/* </UserProvider> */}
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
          'This story shows the entire onboarding flow from start to finish. Click through the steps to experience the onboarding as a user would.',
      },
    },
  },
};

export const Step1: Story = {
  args: {
    // You can add specific props to show different steps
  },
}; 