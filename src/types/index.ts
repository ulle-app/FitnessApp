export interface MembershipTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
  color: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  text: string;
  transformation?: {
    before: string;
    after: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}