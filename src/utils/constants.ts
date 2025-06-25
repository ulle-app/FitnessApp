import { MembershipTier, Service, Testimonial, NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '#services' },
  { label: 'Learn', href: '#learn' },
  { label: 'About Us', href: '#about' },
  { label: 'Community', href: '#community' },
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
    id: 'fitness-nutrition',
    title: 'Fitness & Nutrition Coaching',
    description: 'Personalized diet and workout plans tailored to your lifestyle, goals, and preferences for total body wellness.',
    icon: 'Dumbbell',
    image: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Certified fitness & nutrition coaches',
      'Personalized plans for all ages',
      'Weekly progress monitoring',
      'Continuous support & motivation',
      'Goal-based transformations'
    ]
  },
  {
    id: 'yoga-meditation',
    title: 'Yoga & Meditation',
    description: 'Holistic yoga and meditation sessions to enhance flexibility, mindfulness, and inner peace for all levels.',
    icon: 'Apple',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Certified yoga instructors',
      'Guided meditation & breathwork',
      'Stress reduction techniques',
      'Improved flexibility & balance',
      'Mind-body harmony'
    ]
  },
  {
    id: 'mental-wellness',
    title: 'Mental Wellness Coaching',
    description: 'Expert guidance for mental health, stress management, and emotional resilience to help you thrive.',
    icon: 'Heart',
    image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Certified mental wellness coaches',
      'Stress & anxiety management',
      'Emotional resilience training',
      'Mindfulness & self-care routines',
      'Confidential support'
    ]
  },
  {
    id: 'sleep-coaching',
    title: 'Sleep Coaching',
    description: 'Personalized sleep coaching to help you achieve restorative sleep and boost your overall health.',
    icon: 'Shield',
    image: 'https://images.pexels.com/photos/935743/pexels-photo-935743.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Sleep assessment & tracking',
      'Personalized sleep plans',
      'Insomnia & sleep disorder support',
      'Healthy bedtime routines',
      'Expert sleep coaches'
    ]
  },
  {
    id: 'habit-lifestyle',
    title: 'Habit & Lifestyle Coaching',
    description: 'Build sustainable healthy habits and positive lifestyle changes with expert coaching and accountability.',
    icon: 'Heart',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Personalized habit plans',
      'Daily/weekly check-ins',
      'Goal setting & tracking',
      'Behavioral change strategies',
      'Long-term accountability'
    ]
  },
  {
    id: 'community',
    title: 'Supportive Community',
    description: 'Join a vibrant, judgement-free community for motivation, support, and shared wellness journeys.',
    icon: 'Apple',
    image: 'https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Active online forums',
      'Group challenges & events',
      'Peer motivation & support',
      'Expert Q&A sessions',
      'Inclusive for all ages'
    ]
  },
  {
    id: 'preventive-health',
    title: 'Preventive Health Programs',
    description: 'Proactive health screenings and wellness programs to prevent illness and promote lifelong vitality.',
    icon: 'Shield',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Health risk assessments',
      'Lifestyle disease prevention',
      'Regular health checkups',
      'Personalized wellness plans',
      'Doctor & expert access'
    ]
  },
  {
    id: 'family-wellness',
    title: 'Family Wellness',
    description: 'Wellness programs designed for the whole family, including kids, seniors, and everyone in between.',
    icon: 'Heart',
    image: 'https://images.pexels.com/photos/1648376/pexels-photo-1648376.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Family fitness sessions',
      'Nutrition for all ages',
      'Parent-child wellness activities',
      'Senior wellness support',
      'Inclusive family plans'
    ]
  },
  {
    id: 'spiritual-wellness',
    title: 'Spiritual Wellness',
    description: 'Guidance and practices to nurture your spiritual well-being and find deeper meaning in life.',
    icon: 'Apple',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: [
      'Guided spiritual practices',
      'Mindfulness & gratitude sessions',
      'Workshops & retreats',
      'Holistic well-being focus',
      'Open to all beliefs'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rajan & Richa',
    location: 'Doctors',
    image: 'https://images.pexels.com/photos/8451333/pexels-photo-8451333.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: "As busy doctors with kids, Heal Fitness Zone's easy-to-follow plans were a blessing!"
  },
  {
    id: '2',
    name: 'Shilpa Mehta',
    location: 'Working Professional',
    image: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'Heal Fitness Zone inspired me to defeat low energy & body pain and get shredded!'
  },
  {
    id: '3',
    name: 'Dr Anirudh Deepak',
    location: 'Doctor',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'At 194 kg, I felt like a ticking time bomb... but Heal Fitness Zone gave me a new life!'
  },
  {
    id: '4',
    name: 'Austin & Niharika',
    location: 'Couple',
    image: 'https://images.pexels.com/photos/10156376/pexels-photo-10156376.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'From difficulty climbing the stairs to enjoying our healthiest lives together!'
  },
  {
    id: '5',
    name: 'Surender & Trilochan',
    location: 'Couple',
    image: 'https://images.pexels.com/photos/16843343/pexels-photo-16843343.jpeg?auto=compress&cs=tinysrgb&w=300',
    text: 'My wife & I feel at least 15 years younger than before, thanks to Heal Fitness Zone!'
  }
];