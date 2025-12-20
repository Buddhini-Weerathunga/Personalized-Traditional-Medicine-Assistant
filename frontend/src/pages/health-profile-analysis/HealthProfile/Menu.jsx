import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../../services/api";
import { Heart, User, Activity, Stethoscope, Droplet, ArrowLeft, ArrowRight, Mic, FileText, Check } from "lucide-react";

export default function HealthProfileCreation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(null); // 'voice' or 'form'
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    age: "",
    gender: "",
    location: "",
    
    // Dosha
    vataLevel: 50,
    pittaLevel: 50,
    kaphaLevel: 50,
    dominantDosha: "",
    
    // Complaints
    currentComplaints: "",
    chronicConditions: "",
    allergies: "",
    
    // History
    medicalHistory: "",
    familyHistory: "",
    surgeries: "",
    
    // Lifestyle
    diet: "",
    exercise: "",
    sleep: "",
    stressLevel: ""
  });

  useEffect(() => {
    // PROTECTED CALL
    getProfile()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
    setTimeout(() => {
      setIsRecording(false);
      alert("Voice recording completed! Profile would be auto-generated.");
    }, 3000);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else setMode(null);
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleSubmit = () => {
    console.log("Submitting health profile:", formData);
    alert("Health Profile Created Successfully!");
    // Submit logic here - connect to your API
    // Example: createHealthProfile(formData).then(() => navigate('/dashboard'));
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Mode Selection Screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={handleBackToDashboard} className="p-2 hover:bg-white rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Create Health Profile</h1>
            </div>
          </div>

          <p className="text-gray-600 mb-10 text-center text-lg">
            Choose your preferred method to create your Ayurvedic health profile
          </p>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Voice-Based Option */}
            <div
              onClick={() => setMode('voice')}
              className="bg-white border-2 border-blue-200 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                Voice-Based Profile
              </h2>
              <p className="text-gray-600 text-center mb-4 leading-relaxed">
                Simply speak about your health concerns, lifestyle, and symptoms. Our AI will automatically generate your complete health profile.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800 font-semibold">✓ Quick & Easy</p>
                <p className="text-sm text-blue-800 font-semibold">✓ Natural Conversation</p>
                <p className="text-sm text-blue-800 font-semibold">✓ AI-Powered Analysis</p>
              </div>
            </div>

            {/* Form-Based Option */}
            <div
              onClick={() => setMode('form')}
              className="bg-white border-2 border-green-200 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                Fill Manual Form
              </h2>
              <p className="text-gray-600 text-center mb-4 leading-relaxed">
                Complete a detailed step-by-step form covering all aspects of your health, lifestyle, and medical history.
              </p>
              <div className="bg-green-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-green-800 font-semibold">✓ Detailed & Precise</p>
                <p className="text-sm text-green-800 font-semibold">✓ Structured Information</p>
                <p className="text-sm text-green-800 font-semibold">✓ Complete Control</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Voice-Based Mode
  if (mode === 'voice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => setMode(null)} className="p-2 hover:bg-white rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Mic className="w-7 h-7 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Voice-Based Profile Creation</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Tell us about your health
              </h2>
              <p className="text-gray-600">
                Speak naturally about your concerns, symptoms, lifestyle, and medical history
              </p>
            </div>

            {/* Voice Recorder */}
            <div className="flex flex-col items-center justify-center py-12">
              <button
                onClick={handleVoiceRecord}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse shadow-2xl' 
                    : 'bg-blue-500 hover:bg-blue-600 shadow-lg'
                }`}
              >
                <Mic className="w-16 h-16 text-white" />
              </button>
              
              <p className="mt-6 text-lg font-semibold text-gray-700">
                {isRecording ? 'Recording... Speak now' : 'Tap to start recording'}
              </p>
              
              {isRecording && (
                <div className="mt-4 flex gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-gray-800 mb-3">💡 Tips for better results:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Mention your age, gender, and location</li>
                <li>• Describe current health complaints or concerns</li>
                <li>• Share your daily routine and diet habits</li>
                <li>• Mention any chronic conditions or allergies</li>
                <li>• Describe your sleep patterns and stress levels</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form-Based Mode
  const tabs = [
    { id: 1, name: "Personal", icon: User },
    { id: 2, name: "Dosha", icon: Droplet },
    { id: 3, name: "Complaints", icon: Activity },
    { id: 4, name: "History", icon: FileText },
    { id: 5, name: "Lifestyle", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleBack} className="p-2 hover:bg-white rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Health Profile</h1>
            <p className="text-sm text-gray-600">Update your health information to ensure accurate AI recommendations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setStep(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  step === tab.id
                    ? 'bg-white text-green-700 shadow-md'
                    : 'bg-white/50 text-gray-600 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Personal Details</h2>
              <p className="text-sm text-gray-600 mb-6">Update your basic personal information</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dosha */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Dosha Assessment</h2>
              <p className="text-sm text-gray-600 mb-6">Indicate your body constitution levels</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Vata Level: {formData.vataLevel}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.vataLevel}
                    onChange={(e) => handleInputChange('vataLevel', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Air & Space - Movement, creativity, anxiety</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pitta Level: {formData.pittaLevel}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.pittaLevel}
                    onChange={(e) => handleInputChange('pittaLevel', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fire & Water - Metabolism, intelligence, anger</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kapha Level: {formData.kaphaLevel}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.kaphaLevel}
                    onChange={(e) => handleInputChange('kaphaLevel', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Earth & Water - Structure, stability, lethargy</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dominant Dosha</label>
                  <select
                    value={formData.dominantDosha}
                    onChange={(e) => handleInputChange('dominantDosha', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select dominant dosha</option>
                    <option value="vata">Vata</option>
                    <option value="pitta">Pitta</option>
                    <option value="kapha">Kapha</option>
                    <option value="vata-pitta">Vata-Pitta</option>
                    <option value="pitta-kapha">Pitta-Kapha</option>
                    <option value="vata-kapha">Vata-Kapha</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Complaints */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Health Complaints</h2>
              <p className="text-sm text-gray-600 mb-6">Describe your current health concerns</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Complaints</label>
                  <textarea
                    value={formData.currentComplaints}
                    onChange={(e) => handleInputChange('currentComplaints', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your current health issues or symptoms..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                  <textarea
                    value={formData.chronicConditions}
                    onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="List any long-term health conditions..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="List any known allergies..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: History */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Medical History</h2>
              <p className="text-sm text-gray-600 mb-6">Provide your medical background</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Past illnesses, treatments, medications..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                  <textarea
                    value={formData.familyHistory}
                    onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Health conditions in your family..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surgeries</label>
                  <textarea
                    value={formData.surgeries}
                    onChange={(e) => handleInputChange('surgeries', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="List any surgeries or procedures..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Lifestyle */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Lifestyle Information</h2>
              <p className="text-sm text-gray-600 mb-6">Tell us about your daily habits</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diet Habits</label>
                  <textarea
                    value={formData.diet}
                    onChange={(e) => handleInputChange('diet', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your typical diet, meal times, preferences..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Routine</label>
                  <textarea
                    value={formData.exercise}
                    onChange={(e) => handleInputChange('exercise', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your physical activity and exercise habits..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Pattern</label>
                  <input
                    type="text"
                    value={formData.sleep}
                    onChange={(e) => handleInputChange('sleep', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 7-8 hours, 11pm to 6am"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                  <select
                    value={formData.stressLevel}
                    onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select stress level</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="very-high">Very High</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
            >
              Back
            </button>
            
            <div className="flex gap-3">
              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save and View Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}