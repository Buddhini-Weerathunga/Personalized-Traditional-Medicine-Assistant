import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      icon: "🧘‍♀️",
      title: "Yoga Consultation",
      description: "Personalized yoga sessions tailored to your dosha and wellness goals",
      color: "from-emerald-400 to-green-400"
    },
    {
      icon: "🔍",
      title: "Disease Detection",
      description: "AI-powered analysis to identify potential health imbalances early",
      color: "from-teal-400 to-cyan-400"
    },
    {
      icon: "💊",
      title: "Personalized Treatment",
      description: "Customized Ayurvedic treatment plans based on your unique constitution",
      color: "from-green-400 to-lime-400"
    },
    {
      icon: "🌿",
      title: "Medicinal Plant ID",
      description: "Identify and learn about medicinal plants using advanced image recognition",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-green-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">🕉️</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AyuCeylon
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Home
              </a>
              <a href="#services" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
           <div className="hidden md:flex items-center gap-4">
  
  <Link
    to="/login"
    className="px-4 py-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
  >
    Login
  </Link>

  <Link
    to="/register"
    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
  >
    Sign Up
  </Link>

</div>


            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <span className="text-2xl">{isMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-3">
              <a href="#home" className="block text-gray-700 hover:text-green-600 font-medium py-2">
                Home
              </a>
              <a href="#services" className="block text-gray-700 hover:text-green-600 font-medium py-2">
                Services
              </a>
              <a href="#about" className="block text-gray-700 hover:text-green-600 font-medium py-2">
                About
              </a>
              <a href="#contact" className="block text-gray-700 hover:text-green-600 font-medium py-2">
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <button className="px-4 py-2 text-green-600 font-semibold border-2 border-green-500 rounded-full">
                  Login
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full">
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-4 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 font-semibold text-sm">
                ✨ Ancient Wisdom, Modern Technology
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your Path to{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Holistic Wellness
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the power of Ayurveda combined with AI technology. 
                Personalized health insights, expert consultations, and natural healing - all in one place.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  Get Started Free
                </button>
                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full shadow-lg border-2 border-green-200 hover:border-green-300 transition-all">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-green-600">10K+</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Medicinal Plants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Image/Illustration */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-2xl border-2 border-white">
                <div className="text-center space-y-6">
                  <div className="text-8xl">🧘‍♀️</div>
                  <div className="text-6xl">🌿</div>
                  <div className="flex justify-center gap-4">
                    <div className="text-4xl">💊</div>
                    <div className="text-4xl">🔍</div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-3xl">✨</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍃</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive Ayurvedic care powered by cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-100 hover:border-green-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                <button className="mt-4 text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More 
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start your wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-lg border-2 border-green-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds</p>
            </div>

            <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-lg border-2 border-green-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Get Analyzed</h3>
              <p className="text-gray-600">Answer questions about your health and lifestyle</p>
            </div>

            <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-lg border-2 border-green-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Start Healing</h3>
              <p className="text-gray-600">Follow your personalized treatment plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who have found balance and wellness through AyuCeylon
          </p>
          <button className="px-10 py-4 bg-white text-green-600 font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all text-lg">
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🕉️</span>
              </div>
              <span className="text-xl font-bold">AyuCeylon</span>
            </div>
            <p className="text-gray-400 text-sm">
              Ancient Ayurvedic wisdom meets modern AI technology for holistic wellness.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-green-400">Yoga Consultation</a></li>
              <li><a href="#" className="hover:text-green-400">Disease Detection</a></li>
              <li><a href="#" className="hover:text-green-400">Treatment Plans</a></li>
              <li><a href="#" className="hover:text-green-400">Plant Identification</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-green-400">About Us</a></li>
              <li><a href="#" className="hover:text-green-400">Contact</a></li>
              <li><a href="#" className="hover:text-green-400">Blog</a></li>
              <li><a href="#" className="hover:text-green-400">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-green-400">📘</a>
              <a href="#" className="hover:text-green-400">📷</a>
              <a href="#" className="hover:text-green-400">🐦</a>
              <a href="#" className="hover:text-green-400">💼</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 AyuCeylon. All rights reserved. Made with 💚 for wellness.</p>
        </div>
      </footer>
    </div>
  );
}