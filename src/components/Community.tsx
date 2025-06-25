import React from 'react';

const Community: React.FC = () => {
  return (
    <section className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm py-20">
      <div className="container mx-auto px-6 text-center">
        <div className="bg-gray-900/50 dark:bg-gray-800/50 text-white p-10 rounded-lg shadow-lg border border-white/20 dark:border-gray-500/20">
          <h2 className="text-4xl font-bold mb-4">
            A judgement-free space for everyone
          </h2>
          <p className="text-lg text-gray-200 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Unmatched support - just for you! With a CSAT of 93 and SLA TAT of 99.5%, Heal Fitness Zone provides best-in-class support whenever you need it. We're not simply a company but an extended network of friends that you can always count on. Heal Fitness Zone values your time and money. If you're not happy with our services, you'll get a full refund - no questions asked! And don't worry if you're not enrolled with us. You'll still get the same benefits and respect as our paid customers!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Community; 