import React, { useState } from 'react';
import { Check, Star, ArrowRight, Crown, Heart, Zap, Trophy } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../utils/constants';

const MembershipTiers: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const iconMap = {
    essential: Heart,
    pro: Zap,
    elite: Crown,
    sports: Trophy
  };

  return (
    <section id="healpass" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              Membership Plans
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">HealPass</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Flexible membership plans designed to fit your healing journey. 
            Start your transformation today with our expert-guided programs.
          </p>
        </div>

        {/* Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MEMBERSHIP_TIERS.map((tier) => {
            const IconComponent = iconMap[tier.id as keyof typeof iconMap];
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                  tier.popular ? 'ring-2 ring-green-500 scale-105' : ''
                }`}
                onClick={() => setSelectedPlan(tier.id)}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>

                <div className="relative p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${tier.color} rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 text-sm">{tier.tagline}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    {tier.originalPrice && (
                      <div className="text-sm text-gray-500">
                        <span className="line-through">{tier.originalPrice}</span>
                        <span className="ml-2 text-green-600 font-semibold">Save 33%</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md'
                  }`}>
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose HealFitness Zone?</h3>
            <p className="text-gray-600">
              All plans include access to our mobile app and online community
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="font-semibold text-gray-900">No joining fee</div>
              <div className="text-sm text-gray-500">Start immediately</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900">Cancel anytime</div>
              <div className="text-sm text-gray-500">No long-term commitment</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="font-semibold text-gray-900">7-day free trial</div>
              <div className="text-sm text-gray-500">Experience before you commit</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div className="font-semibold text-gray-900">Money-back guarantee</div>
              <div className="text-sm text-gray-500">100% satisfaction guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipTiers;