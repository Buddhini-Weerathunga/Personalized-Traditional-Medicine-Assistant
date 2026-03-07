import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // Images from public/images
  const images = [
    "/images/ayurveda1.jpg",
    "/images/ayurveda2.jpg",
    "/images/ayurveda3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const services = [
    {
      icon: "🧘‍♀️",
      title: "Yoga Consultation",
      description:
        "Personalized yoga guidance aligned with your dosha, body type, and lifestyle goals.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: "🔍",
      title: "Health Analysis",
      description:
        "Smart wellness assessment to identify imbalances and support early Ayurvedic care.",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: "💊",
      title: "Personalized Treatment",
      description:
        "Customized herbal, dietary, and lifestyle recommendations for holistic healing.",
      color: "from-green-500 to-lime-500",
    },
    {
      icon: "🌿",
      title: "Medicinal Plant ID",
      description:
        "Recognize medicinal plants and learn their traditional Ayurvedic benefits easily.",
      color: "from-green-600 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7fbf7] text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold tracking-tight">
                <span className="text-green-700">Ayu</span>
                <span className="text-gray-900">Ceylon</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-green-700 font-medium transition"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-green-700 font-medium transition"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-green-700 font-medium transition"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-green-700 font-medium transition"
              >
                Contact
              </a>
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-green-700 hover:text-green-800 font-semibold transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-full shadow-md transition"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-2xl text-gray-700"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-green-100">
              <a
                href="#home"
                className="block text-gray-700 hover:text-green-700 font-medium py-2"
              >
                Home
              </a>
              <a
                href="#services"
                className="block text-gray-700 hover:text-green-700 font-medium py-2"
              >
                Services
              </a>
              <a
                href="#about"
                className="block text-gray-700 hover:text-green-700 font-medium py-2"
              >
                About
              </a>
              <a
                href="#contact"
                className="block text-gray-700 hover:text-green-700 font-medium py-2"
              >
                Contact
              </a>

              <div className="flex flex-col gap-3 pt-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-center text-green-700 font-semibold border border-green-600 rounded-full"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-center bg-green-700 text-white font-semibold rounded-full"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-[#f8fcf7] via-[#eef8ef] to-[#fdfdfb] py-16 md:py-24"
      >
        {/* Background shapes */}
        <div className="absolute top-10 left-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200">
                ✨ Trusted Ayurveda with Modern Intelligence
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Professional{" "}
                <span className="text-green-700">Ayurvedic Care</span> for a
                Healthier, Balanced Life
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                AyuCeylon brings together authentic Ayurvedic wisdom, natural
                healing practices, and modern AI support to help you understand
                your body, improve wellness, and follow a more balanced
                lifestyle.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-full shadow-lg transition"
                >
                  Get Started
                </Link>
                <a
                  href="#services"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full border border-green-200 shadow-sm transition"
                >
                  Explore Services
                </a>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="bg-white/90 border border-green-100 rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-700">
                    10K+
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Users Guided</div>
                </div>

                <div className="bg-white/90 border border-green-100 rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-700">
                    500+
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Medicinal Plants
                  </div>
                </div>

                <div className="bg-white/90 border border-green-100 rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-700">
                    98%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>

            {/* Right Slider */}
            <div className="relative">
              <div className="bg-white rounded-[28px] p-4 md:p-5 shadow-2xl border border-green-100">
                <div className="relative w-full h-[320px] md:h-[500px] overflow-hidden rounded-[24px]">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Ayurveda slide ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        index === current ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"></div>

                  {/* Text on slider */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-sm uppercase tracking-[0.2em] opacity-90 mb-2">
                      Natural Healing
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                      Discover the Power of Traditional Ayurveda
                    </h3>
                  </div>

                  {/* Dots */}
                  <div className="absolute bottom-5 right-5 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-3 w-3 rounded-full transition-all ${
                          index === current
                            ? "bg-white w-8"
                            : "bg-white/60 hover:bg-white"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

             
            </div>
          </div>
        </div>
      </section>

      {/* About Intro */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200 mb-5">
            About AyuCeylon
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blending Ancient Ayurveda with Modern Digital Care
          </h2>

          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            AyuCeylon is designed to make Ayurvedic wellness more accessible,
            intelligent, and personalized. From health insights and herbal
            knowledge to consultations and lifestyle guidance, our platform
            supports a complete natural healing journey for today’s world.
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 bg-[#f8fbf8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200 mb-4">
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Professional Ayurvedic Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thoughtfully designed wellness services to support prevention,
              balance, and long-term health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-green-100 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl shadow-lg mb-5 group-hover:scale-105 transition`}
                >
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm">
                  {service.description}
                </p>

                <button className="mt-5 text-green-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  Learn More <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200 mb-4">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start Your Healing Journey in 3 Steps
            </h2>
            <p className="text-xl text-gray-600">
              Easy, guided, and designed for a smooth wellness experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f9fcf9] border border-green-100 rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-700 text-white flex items-center justify-center text-2xl font-bold shadow-md mb-5">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your account and access personalized Ayurvedic wellness
                tools.
              </p>
            </div>

            <div className="bg-[#f9fcf9] border border-green-100 rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-700 text-white flex items-center justify-center text-2xl font-bold shadow-md mb-5">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Get Assessed
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Answer guided questions to understand your body, habits, and
                health balance.
              </p>
            </div>

            <div className="bg-[#f9fcf9] border border-green-100 rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-700 text-white flex items-center justify-center text-2xl font-bold shadow-md mb-5">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Begin Treatment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Follow your personalized recommendations and improve your
                lifestyle naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-700 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience True Holistic Wellness?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
            Join AyuCeylon and take the next step toward a naturally healthier,
            more balanced life.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-green-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#111827] text-white py-14 px-4">
        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold tracking-wide">
                AyuCeylon
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AyuCeylon combines authentic Ayurvedic knowledge with modern
              digital innovation to provide professional and personalized
              wellness care.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Yoga & Wellness Consultation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  AI Health Analysis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Personalized Treatment Plans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Medicinal Plant Identification
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  About AyuCeylon
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Health Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
            <div className="flex gap-4 text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-3 rounded-full bg-gray-800 hover:bg-green-600 transition text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-3 rounded-full bg-gray-800 hover:bg-green-600 transition text-white"
              >
                <FaInstagram />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-3 rounded-full bg-gray-800 hover:bg-green-600 transition text-white"
              >
                <FaTwitter />
              </a>

              <a
                href="https://wa.me/94770000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-3 rounded-full bg-gray-800 hover:bg-green-600 transition text-white"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} AyuCeylon. All rights reserved.
            <span className="block sm:inline">
              {" "}
              Crafted with 💚 for holistic wellness.
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}