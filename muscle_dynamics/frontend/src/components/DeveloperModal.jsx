import React from 'react';
import { X, Github, Linkedin, Mail } from 'lucide-react';

function DeveloperModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
          <div className="sticky top-0 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">About the Developer</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">PK</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Pradeep Kumar</h3>
              <p className="text-gray-400 mb-4">Full Stack Developer & Fitness Enthusiast</p>
              <p className="text-gray-300 mb-6">
                Passionate about building tools that help people achieve their fitness goals.
                This project combines my love for coding and gym training.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="https://github.com/pradeepkumar673" target="_blank" rel="noopener noreferrer"
                   className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/in/pradeepkumar673" target="_blank" rel="noopener noreferrer"
                   className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/pradeepkumar673atyt/"
                   className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeveloperModal;