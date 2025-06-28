import React from 'react';

// Mock feature icons as SVG components
const features = [
  {
    label: 'Calorie Counter',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#34d399"/><text x="12" y="17" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">Kcal</text></svg>
    ),
  },
  {
    label: 'Step Tracker',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="5" fill="#60a5fa"/><circle cx="8" cy="15" r="2" fill="#fff"/><circle cx="16" cy="15" r="2" fill="#fff"/></svg>
    ),
  },
  {
    label: 'Water Reminder',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" fill="#38bdf8"/><text x="12" y="19" textAnchor="middle" fontSize="10" fill="#fff">H₂O</text></svg>
    ),
  },
  {
    label: 'Workout Plans',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="6" fill="#fbbf24"/><rect x="10" y="10" width="4" height="8" rx="2" fill="#fff"/></svg>
    ),
  },
  {
    label: 'Community',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="12" r="4" fill="#a78bfa"/><circle cx="16" cy="12" r="4" fill="#f472b6"/><rect x="4" y="16" width="16" height="4" rx="2" fill="#fff"/></svg>
    ),
  },
  {
    label: 'Articles',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="3" fill="#f87171"/><rect x="8" y="8" width="8" height="2" rx="1" fill="#fff"/><rect x="8" y="12" width="6" height="2" rx="1" fill="#fff"/></svg>
    ),
  },
];

const mockScreens = [
  {
    content: (
      <div className="w-full p-6">
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">3 million+ strong, friendly community</h3>
        <div className="flex items-center mb-2">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Anu Bathla" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <div className="font-semibold text-gray-800 dark:text-white">Anu Bathla</div>
            <div className="text-xs text-gray-500">Transformation</div>
          </div>
        </div>
        <div className="flex space-x-2 mb-2">
          <img src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=100&h=100" alt="Before" className="w-16 h-20 object-cover rounded-lg" />
          <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=100&h=100" alt="After" className="w-16 h-20 object-cover rounded-lg" />
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="text-pink-500 mr-1">❤</span> 4K Likes
        </div>
        <div className="flex items-center text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Saurabh" className="w-6 h-6 rounded-full mr-2" />
          <span><b>Saurabh</b> Great work, kudos! Keep it up 👍🏼</span>
        </div>
      </div>
    ),
  },
  {
    content: (
      <div className="w-full p-6">
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Customised Diet Plan for you!</h3>
        <div className="space-y-3">
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <img src="https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=60&h=60" alt="Breakfast" className="w-10 h-10 rounded mr-3 object-cover" />
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">Breakfast</div>
              <div className="text-xs text-gray-500">500 Calories</div>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <img src="https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=60&h=60" alt="Lunch" className="w-10 h-10 rounded mr-3 object-cover" />
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">Lunch</div>
              <div className="text-xs text-gray-500">700 Calories</div>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <img src="https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=60&h=60" alt="Snacks" className="w-10 h-10 rounded mr-3 object-cover" />
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">Snacks</div>
              <div className="text-xs text-gray-500">400 Calories</div>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <img src="https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=60&h=60" alt="Dinner" className="w-10 h-10 rounded mr-3 object-cover" />
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">Dinner</div>
              <div className="text-xs text-gray-500">600 Calories</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    content: (
      <div className="w-full p-6">
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Training tool with 500+ exercise videos</h3>
        <div className="space-y-3">
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <img src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=80&h=60" alt="Reverse Barbell Curl" className="w-16 h-10 rounded mr-3 object-cover" />
            <div>
              <div className="font-bold text-xs text-blue-700 dark:text-blue-400 uppercase">Reverse Barbell Curl</div>
              <div className="text-xs text-gray-500">Biceps &bull; 4 Sets</div>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <img src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=80&h=60" alt="Dumbbell Deadlift" className="w-16 h-10 rounded mr-3 object-cover" />
            <div>
              <div className="font-bold text-xs text-blue-700 dark:text-blue-400 uppercase">Dumbbell Deadlift</div>
              <div className="text-xs text-gray-500">Glutes &bull; 3 Sets</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const AppDownload: React.FC = () => {
  return (
    <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Introducing the Heal Fitness Zone app
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 mb-10 text-lg">
          Coaches, Community, Customised Plans. Plus loads of free tools like Calorie Counter, Diet Tool, Step Counter, Water Reminder, Exercise Library, Articles, and much more!
        </p>
        <div className="flex justify-center mb-10">
          {/* Realistic iPhone device frame */}
          <div className="relative w-[340px] h-[700px] bg-gray-200/60 dark:bg-gray-700/60 backdrop-blur-lg border-4 border-gray-300 dark:border-gray-600 rounded-[2.5rem] shadow-2xl flex flex-col items-center overflow-hidden">
            {/* Speaker and camera notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-300 dark:bg-gray-600 rounded-b-2xl z-10 mt-1 flex items-center justify-center">
              <div className="w-8 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mx-auto"></div>
            </div>
            {/* App screens stacked vertically */}
            <div className="flex-1 flex flex-col justify-center items-center pt-10 pb-6 w-full overflow-y-auto">
              {mockScreens.map((screen, idx) => (
                <div key={idx} className="glass dark:glass-dark rounded-2xl w-[90%] mx-auto mb-6 last:mb-0 shadow-lg">
                  {screen.content}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 text-lg">
          Get the app
        </button>
      </div>
    </section>
  );
};

export default AppDownload;