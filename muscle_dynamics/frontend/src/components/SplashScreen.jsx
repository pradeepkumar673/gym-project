import React, { useState, useEffect } from 'react';

const messages = [
  { lang: 'Tamil', text: 'வணக்கம், என் இணையதளத்திற்கு வரவேற்கிறேன்' },
  { lang: 'Telugu', text: 'నా వెబ్‌సైట్‌కి స్వాగతం' },
  { lang: 'Hindi', text: 'मेरी वेबसाइट में आपका स्वागत है' },
  { lang: 'Malayalam', text: 'എന്റെ വെബ്‌സൈറ്റിലേക്ക് സ്വാഗതം' }
];

function SplashScreen({ loadingComplete }) {
  const [index, setIndex] = useState(0);
  const [finalText, setFinalText] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [bottomText] = useState('backend connect agudhu wait pannunga');

  // Cycle messages every 300ms while loading
  useEffect(() => {
    if (!loadingComplete) {
      const interval = setInterval(() => {
        setIndex(prev => (prev + 1) % messages.length);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [loadingComplete]);

  // When loading completes, stop at Tamil (index 0) and show final message
  useEffect(() => {
    if (loadingComplete) {
      setFinalText(messages[0].text);
      setShowFinal(true);
      // No need to cycle anymore; final text stays
    }
  }, [loadingComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
      {/* Logo */}
      <img src="/light.svg" alt="Muscle Dynamics" className="w-24 h-24 mb-2" />

      {/* Welcome text */}
      <div className="text-white text-sm md:text-sm font-light text-center px-4 h-20 flex items-center justify-center">
        {showFinal ? finalText : messages[index].text}
      </div>

      {/* Bottom status */}
      <div className="absolute bottom-10 left-0 right-0 text-center text-gray-400 text-sm">
        {bottomText}
      </div>
    </div>
  );
}

export default SplashScreen;