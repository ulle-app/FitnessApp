import { MembershipTier, Service, Testimonial, NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'HealPass', href: '#healpass' },
  { label: 'Services', href: '#services' },
  { label: 'Centers', href: '#centers' },
  { label: 'Community', href: '#community' },
  { label: 'Corporate', href: '#corporate' },
];

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'essential',
    name: 'HealPass Essential',
    tagline: 'Perfect to get started',
    price: '₹999',
    originalPrice: '₹1,499',
    features: [
      'Single center access',
      'Unlimited group classes',
      'Online workout library',
      'Basic nutrition guidance',
      'Community support',
      'Mobile app access'
    ],
    ctaText: 'TRY FOR FREE',
    color: 'bg-blue-500'
  },
  {
    id: 'pro',
    name: 'HealPass Pro',
    tagline: 'Most popular choice',
    price: '₹1,899',
    originalPrice: '₹2,849',
    features: [
      'Unlimited access to all centers',
      'All group classes + personal training',
      'At-home live sessions',
      'Personalized meal plans',
      'Recovery therapy sessions',
      'Priority booking',
      'Guest passes (2/month)'
    ],
    ctaText: 'TRY FOR FREE',
    popular: true,
    color: 'bg-green-500'
  },
  {
    id: 'elite',
    name: 'HealPass Elite',
    tagline: 'Premium transformation',
    price: '₹2,999',
    originalPrice: '₹4,499',
    features: [
      'All Pro benefits',
      'Unlimited personal training',
      'One-on-one nutrition consultation',
      'Physiotherapy & rehabilitation',
      'Mindfulness coaching',
      'VIP locker access',
      'Complimentary guest passes',
      'Priority customer support'
    ],
    ctaText: 'TRY FOR FREE',
    color: 'bg-purple-500'
  },
  {
    id: 'sports',
    name: 'HealPass Sports',
    tagline: 'For sports enthusiasts',
    price: '₹1,499',
    originalPrice: '₹2,249',
    features: [
      'Badminton, swimming, sports',
      'Expert sports coaching',
      'Tournament participation',
      'Sports nutrition guidance',
      'Injury prevention programs',
      'Equipment included'
    ],
    ctaText: 'TRY FOR FREE',
    color: 'bg-orange-500'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'workouts',
    title: 'HealFit Workouts',
    description: 'Transform your body with expert-led fitness programs designed for every fitness level',
    icon: 'Dumbbell',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['HIIT Training', 'Strength Building', 'Cardio Blast', 'Functional Fitness', 'Group Classes', 'Personal Training']
  },
  {
    id: 'nutrition',
    title: 'HealFit Nutrition',
    description: 'Fuel your transformation with personalized meal plans and expert nutrition guidance',
    icon: 'Apple',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Custom Meal Plans', 'Macro Tracking', 'Healthy Recipes', 'Nutrition Counseling', 'Diet Consultations', 'Supplement Guidance']
  },
  {
    id: 'mindfulness',
    title: 'HealFit Mindfulness',
    description: 'Heal your mind through yoga, meditation, and stress management techniques',
    icon: 'Heart',
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Yoga Classes', 'Meditation Sessions', 'Stress Management', 'Mindful Movement', 'Breathing Techniques', 'Mental Wellness']
  },
  {
    id: 'recovery',
    title: 'HealFit Recovery',
    description: 'Accelerate healing with professional therapy and recovery programs',
    icon: 'Shield',
    image: 'https://images.pexels.com/photos/7176325/pexels-photo-7176325.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Physiotherapy', 'Sports Massage', 'Injury Rehabilitation', 'Recovery Protocols', 'Pain Management', 'Mobility Training']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'HealFitness Zone transformed not just my body, but my entire mindset. The holistic approach to wellness is incredible! I lost 12kg in 6 months and feel more energetic than ever.'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'Lost 15kg in 4 months with HealPass Pro. The combination of workouts and nutrition coaching is perfect. The trainers are supportive and the community keeps me motivated.'
  },
  {
    id: '3',
    name: 'Sneha Patel',
    location: 'Delhi',
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'The mindfulness sessions helped me manage stress better. This is more than just a gym - it\'s a lifestyle change. The yoga and meditation classes are life-changing.'
  },
  {
    id: '4',
    name: 'Arjun Singh',
    location: 'Pune',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'The recovery therapy sessions helped me come back stronger after my sports injury. The physiotherapists are excellent and the equipment is top-notch.'
  },
  {
    id: '5',
    name: 'Kavya Reddy',
    location: 'Hyderabad',
    image: 'https://images.pexels.com/photos/3865711/pexels-photo-3865711.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'The personal training sessions with HealPass Elite are worth every penny. My trainer understands my goals and pushes me to achieve them safely.'
  },
  {
    id: '6',
    name: 'Vikram Mehta',
    location: 'Chennai',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'The app makes it so convenient to book classes and track progress. The variety of workouts keeps things interesting and challenging.'
  }
];