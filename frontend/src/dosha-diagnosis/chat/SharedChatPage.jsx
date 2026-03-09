// frontend/src/dosha-diagnosis/chat/SharedChatPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function SharedChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vataScore, pittaScore, kaphaScore, dominantDosha } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate AI recommendations on mount
  useEffect(() => {
    if (!vataScore || !pittaScore || !kaphaScore || !dominantDosha) {
      // No scores provided, redirect to home
      navigate("/home");
      return;
    }

    const generateInitialMessage = async () => {
      setLoading(true);
      try {
        const GEMINI_API_KEY = "AIzaSyCAvvhH7bgJqazPQ5r_R-9_ITWd3bwQEWw";
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const promptText = `Based on your Ayurvedic analysis, your primary Dosha is ${dominantDosha} with the following scores:
- Vata: ${Math.round(vataScore * 100)}%
- Pitta: ${Math.round(pittaScore * 100)}%
- Kapha: ${Math.round(kaphaScore * 100)}%

Give explanation under these details:
1. Physical Characteristics
2. Diet Recommendations
3. Foods to Avoid
4. Lifestyle Recommendations
5. Herbal Remedies
6. Practical Applications

Provide detailed, specific, and actionable advice for someone with ${dominantDosha} as their dominant dosha.`;

        const response = await model.generateContent(promptText);
        const geminiResponse = response.response;
        const aiText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiText) {
          // Add user message and AI response
          setMessages([
            {
              _id: "user-initial",
              role: "user",
              content: `Show me my personalized Ayurvedic analysis for ${dominantDosha} dosha`
            },
            {
              _id: "bot-initial",
              role: "assistant",
              content: formatAIResponse(aiText)
            }
          ]);
        } else {
          setMessages([
            {
              _id: "user-initial",
              role: "user",
              content: `Show me my personalized Ayurvedic analysis for ${dominantDosha} dosha`
            },
            {
              _id: "bot-initial",
              role: "assistant",
              content: formatManualResponse()
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to generate AI recommendations:", error);
        // Use manual formatting on error
        setMessages([
          {
            _id: "user-initial",
            role: "user",
            content: `Show me my personalized Ayurvedic analysis for ${dominantDosha} dosha`
          },
          {
            _id: "bot-initial",
            role: "assistant",
            content: formatManualResponse()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateInitialMessage();
  }, [vataScore, pittaScore, kaphaScore, dominantDosha, navigate]);

  // Format AI response for better display
  const formatAIResponse = (text) => {
    // Clean up markdown if present
    let cleaned = text.replace(/```markdown\n?/g, '').replace(/```\n?/g, '').trim();
    return cleaned;
  };

  // Manual response formatting as fallback
  const formatManualResponse = () => {
    return `🌿 **Your Ayurvedic Analysis Results** 🌿

Based on your comprehensive facial analysis and questionnaire, your primary Dosha is: **${dominantDosha}**

📊 **Your Dosha Scores:**
• Vata: ${Math.round(vataScore * 100)}%
• Pitta: ${Math.round(pittaScore * 100)}%
• Kapha: ${Math.round(kaphaScore * 100)}%

---

**1. Physical Characteristics** ${(dominantDosha === 'Vata' ? '(Air & Space Elements)' : dominantDosha === 'Pitta' ? '(Fire & Water Elements)' : '(Water & Earth Elements)')}

${getPhysicalCharacteristics(dominantDosha)}

**2. Diet Recommendations**

${getDietRecommendations(dominantDosha)}

**3. Foods to Avoid**

${getFoodsToAvoid(dominantDosha)}

**4. Lifestyle Recommendations**

${getLifestyleRecommendations(dominantDosha)}

**5. Herbal Remedies**

${getHerbalRemedies(dominantDosha)}

**6. Practical Applications**

${getPracticalApplications(dominantDosha)}

---

💚 This personalized analysis is based on your unique Prakriti (constitution). Follow these guidelines gently and consistently for best results.`;
  };

  // Helper functions for manual formatting
  const getPhysicalCharacteristics = (dosha) => {
    const characteristics = {
      Vata: "• Light, thin frame with prominent joints\n• Dry, rough skin that tends toward wrinkles\n• Cold hands and feet, sensitive to cold\n• Irregular appetite and digestion\n• Quick, active mind with creative thinking\n• Light sleeper, may experience insomnia\n• Tends toward anxiety when stressed",
      Pitta: "• Medium, athletic build with good muscle tone\n• Warm body temperature, sensitive to heat\n• Sharp appetite and strong digestion\n• Fair or reddish skin that burns easily\n• Penetrating, focused eyes\n• Strong, organized thinking\n• Tends toward irritability when imbalanced",
      Kapha: "• Solid, well-developed physique\n• Cool, smooth, and oily skin\n• Slow but steady appetite\n• Excellent stamina and endurance\n• Calm, methodical thinking style\n• Deep, long sleeper\n• Tends toward attachment and resistance to change"
    };
    return characteristics[dosha] || "Balanced constitution";
  };

  const getDietRecommendations = (dosha) => {
    const diet = {
      Vata: "• Warm, cooked meals with healthy oils (ghee, sesame)\n• Sweet, sour, and salty tastes\n• Nuts, seeds, and dairy products\n• Root vegetables and whole grains\n• Regular meal times in a calm environment\n• Warm beverages throughout the day",
      Pitta: "• Cooling foods like cucumbers, melons, and leafy greens\n• Sweet, bitter, and astringent tastes\n• Whole grains like rice, wheat, and oats\n• Coconut oil and olive oil\n• Avoid excessive spices and fried foods\n• Eat at regular intervals, don't skip meals",
      Kapha: "• Light, warm, and dry foods\n• Pungent, bitter, and astringent tastes\n• Plenty of vegetables and legumes\n• Light grains like barley, millet, and quinoa\n• Minimal oil and fat\n• Spicy teas and warm beverages\n• Avoid heavy, oily, and sweet foods"
    };
    return diet[dosha] || "Balanced diet recommended";
  };

  const getFoodsToAvoid = (dosha) => {
    const avoid = {
      Vata: "• Cold and frozen foods\n• Raw vegetables and salads\n• Excessive beans and legumes\n• Carbonated beverages\n• Bitter and astringent tastes\n• Dry, crunchy snacks",
      Pitta: "• Spicy and fried foods\n• Sour fruits like citrus\n• Excessive salt\n• Fermented foods\n• Alcohol and caffeine\n• Tomatoes and eggplant",
      Kapha: "• Heavy, greasy foods\n• Excessive sweets and sugar\n• Dairy products (especially cold)\n• Red meat\n• Processed and packaged foods\n• Cold beverages and ice cream"
    };
    return avoid[dosha] || "Avoid processed and unhealthy foods";
  };

  const getLifestyleRecommendations = (dosha) => {
    const lifestyle = {
      Vata: "• Maintain a regular daily routine\n• Gentle yoga and slow movements\n• Daily self-massage with warm sesame oil\n• Keep warm and stay hydrated\n• Practice meditation and breathing exercises\n• Get adequate rest and sleep\n• Avoid overstimulation and multitasking",
      Pitta: "• Moderate exercise without overheating\n• Swimming and water activities\n• Practice cooling pranayama (Sheetali)\n• Spend time in nature\n• Develop patience and compassion\n• Avoid excessive competition\n• Take regular breaks to cool down",
      Kapha: "• Vigorous daily exercise (30+ minutes)\n• Stimulating yoga practices\n• Dry massage with chickpea flour\n• Wake up early (before 6 AM)\n• Engage in creative and social activities\n• Try new experiences regularly\n• Avoid daytime sleeping"
    };
    return lifestyle[dosha] || "Balanced lifestyle recommended";
  };

  const getHerbalRemedies = (dosha) => {
    const herbs = {
      Vata: "• Ashwagandha - for strength and grounding\n• Triphala - for digestive support\n• Brahmi - for nervous system calming\n• Ginger tea - for digestion\n• Warm milk with nutmeg - for sleep\n• Licorice root - for adrenal support",
      Pitta: "• Amla - cooling antioxidant\n• Shatavari - for cooling and nourishment\n• Guduchi - for immune support\n• Coriander-cumin-fennel tea\n• Aloe vera juice - for cooling\n• Rose petal preparations",
      Kapha: "• Trikatu - for metabolism stimulation\n• Tulsi (Holy Basil) - for respiratory health\n• Guggulu - for cleansing\n• Ginger and lemon tea\n• Cinnamon - for circulation\n• Turmeric - for purification"
    };
    return herbs[dosha] || "Consult an Ayurvedic practitioner for personalized herbs";
  };

  const getPracticalApplications = (dosha) => {
    const practical = {
      Vata: "✓ Start your day with warm lemon water\n✓ Establish consistent sleep schedule (bed by 10 PM)\n✓ Practice 10 minutes of gentle stretching daily\n✓ Keep a journal for creative expression\n✓ Use aromatherapy with grounding scents (sandalwood, cedar)\n✓ Wear warm, comfortable clothing in earth tones",
      Pitta: "✓ Begin day with cooling coconut water\n✓ Practice moon salutations (Chandra Namaskar)\n✓ Take lunch as your main meal (12-1 PM)\n✓ Schedule regular relaxation breaks\n✓ Use cooling essential oils (rose, lavender)\n✓ Wear cooling colors (blue, green, white)",
      Kapha: "✓ Rise before sunrise for energized start\n✓ Practice invigorating sun salutations\n✓ Drink ginger tea upon waking\n✓ Brush dry skin before bathing\n✓ Use stimulating scents (eucalyptus, rosemary)\n✓ Wear bright, warm colors (orange, yellow, red)"
    };
    return practical[dosha] || "Implement gradual lifestyle changes";
  };

  // Handle sending new messages
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input;
    setInput("");
    
    // Check if the question is Ayurvedic-related
    const ayurvedicKeywords = [
      'dosha', 'vata', 'pitta', 'kapha', 'ayurveda', 'ayurvedic',
      'diet', 'food', 'herb', 'remedy', 'lifestyle', 'health',
      'wellness', 'meditation', 'yoga', 'pranayama', 'constitution',
      'prakriti', 'imbalance', 'digestion', 'metabolism', 'energy',
      'skin', 'hair', 'sleep', 'stress', 'anxiety', 'balance',
      'natural', 'holistic', 'treatment', 'therapy', 'massage',
      'oil', 'ghee', 'turmeric', 'ginger', 'ashwagandha', 'triphala',
      'brahmi', 'tulsi', 'neem', 'amla', 'shatavari', 'guggulu'
    ];

    const isAyurvedicQuestion = ayurvedicKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    // Add user message
    const userMsg = {
      _id: `user-${Date.now()}`,
      role: "user",
      content: userMessage
    };
    setMessages((prev) => [...prev, userMsg]);
    
    // If not Ayurvedic-related, show polite message
    if (!isAyurvedicQuestion) {
      setTimeout(() => {
        const botMsg = {
          _id: `bot-${Date.now()}`,
          role: "assistant",
          content: "🙏 Thank you for your question! However, I specialize in Ayurvedic medicine and wellness. I can help you with questions about:\n\n• Doshas (Vata, Pitta, Kapha)\n• Diet and nutrition recommendations\n• Herbal remedies and natural treatments\n• Lifestyle practices for balance\n• Yoga and meditation\n• Holistic health approaches\n\nPlease feel free to ask me anything related to Ayurveda and your dosha analysis! 🌿"
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 500);
      return;
    }
    
    // Generate AI response for Ayurvedic questions
    setSending(true);
    try {
      const GEMINI_API_KEY = "AIzaSyDtMmHX0kdpoJ2-JapCuICmlecxZaGb_rw";
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const contextPrompt = `You are an expert Ayurvedic practitioner. The user has ${dominantDosha} as their dominant dosha with scores: Vata ${Math.round(vataScore * 100)}%, Pitta ${Math.round(pittaScore * 100)}%, Kapha ${Math.round(kaphaScore * 100)}%. 

User question: ${userMessage}

Provide a helpful, concise, and practical Ayurvedic response considering their dosha balance. Focus on traditional Ayurvedic wisdom and holistic approaches.`;

      const response = await model.generateContent(contextPrompt);
      const geminiResponse = response.response;
      const aiText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

      const botMsg = {
        _id: `bot-${Date.now()}`,
        role: "assistant",
        content: aiText || "I apologize, but I'm having trouble generating a response right now. Please try again."
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to generate response:", error);
      const errMsg = {
        _id: `err-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I couldn't generate a response due to a server issue. Please try again shortly."
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
          <div className="pointer-events-none">
            <div className="absolute top-10 left-0 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
          </div>
          <section className="relative max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-700 text-lg font-semibold">Generating Your Personalized Ayurvedic Analysis...</p>
                <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your Dosha recommendations</p>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen pb-12">
        {/* Soft glowing circles */}
        <div className="pointer-events-none">
          <div className="absolute top-10 left-0 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        </div>

        <section className="relative max-w-5xl mx-auto px-4 py-10">
          {/* Page Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <span>🤖 AI-Powered Chat</span>
              <span className="h-4 w-px bg-green-300" />
              <span>Ayurveda Assistant</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
              Your{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Personalized Dosha Analysis
              </span>
            </h1>

            <p className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed max-w-2xl">
              Based on your facial analysis, here's your comprehensive Ayurvedic profile with personalized recommendations.
            </p>
          </div>

          {/* Chat Messages Container */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-green-200 shadow-xl overflow-hidden">
            {/* Messages Area */}
            <div className="h-[60vh] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50/50 to-white">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-white border border-green-100 text-gray-800"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-green-100 rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="border-t border-green-100 p-4 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your dosha, diet, lifestyle..."
                  className="flex-1 px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 placeholder-gray-400"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {sending ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
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
              Ancient Ayurvedic wisdom meets modern AI to bring holistic,
              personalized wellness insights.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">
                Yoga Consultation
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Disease Detection
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Treatment Plans
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Plant Identification
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">About Us</li>
              <li className="hover:text-green-400 cursor-pointer">Contact</li>
              <li className="hover:text-green-400 cursor-pointer">Blog</li>
              <li className="hover:text-green-400 cursor-pointer">Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4 text-2xl">
              <span className="hover:text-green-400 cursor-pointer">📘</span>
              <span className="hover:text-green-400 cursor-pointer">📷</span>
              <span className="hover:text-green-400 cursor-pointer">🐦</span>
              <span className="hover:text-green-400 cursor-pointer">💼</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 AyuCeylon. All rights reserved. Made with 💚 for wellness.</p>
        </div>
      </footer>
    </>
  );
}
