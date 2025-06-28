import React, { createContext, useState, useEffect, useContext } from 'react';

// BodyFatContext for sharing body fat % between calculators
interface BodyFatContextType {
  bodyFat: string;
  setBodyFat: (value: string) => void;
  clearBodyFat: () => void;
}

const BodyFatContext = createContext<BodyFatContextType | undefined>(undefined);

export const BodyFatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bodyFat, setBodyFatState] = useState<string>(() => {
    return localStorage.getItem('bodyFat') || '';
  });

  useEffect(() => {
    if (bodyFat) {
      localStorage.setItem('bodyFat', bodyFat);
    } else {
      localStorage.removeItem('bodyFat');
    }
  }, [bodyFat]);

  const setBodyFat = (value: string) => setBodyFatState(value);
  const clearBodyFat = () => setBodyFatState('');

  return (
    <BodyFatContext.Provider value={{ bodyFat, setBodyFat, clearBodyFat }}>
      {children}
    </BodyFatContext.Provider>
  );
};

export const useBodyFat = () => {
  const context = useContext(BodyFatContext);
  if (context === undefined) {
    throw new Error('useBodyFat must be used within a BodyFatProvider');
  }
  return context;
}; 