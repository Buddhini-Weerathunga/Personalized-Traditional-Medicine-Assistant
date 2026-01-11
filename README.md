
# 🧠 **AI-Powered Personalized Traditional Medicine Assistant**

## **Research Group:** 25-26J-232

---

## **Project Overview**

The **AI-Powered Personalized Traditional Medicine Assistant** is a smart healthcare system designed to support **Ayurveda practices** using artificial intelligence. The system provides personalized health analysis, diagnosis, and guidance by combining machine learning, environmental data, and traditional medical knowledge.

![diargam](https://github.com/user-attachments/assets/3ee8055d-4fb3-4072-ab9a-821751d493c2)


## **Key Functional Modules**

### **1️⃣ AI-Powered Dosha Diagnosis & Prescription**

**Member:** Suhana M.Y.F (IT22885432)

Analyzes user health inputs to identify **Vata, Pitta, and Kapha** imbalances and provides personalized traditional medicine recommendations.

---

### **2️⃣ Medicinal Plant Identification & Safety Alerts**

**Member:** Sendanayake S.R (IT22151674)

Identifies medicinal plants using image analysis and provides **safety alerts, usage guidance, and risk information** to ensure safe application.

---

### **3️⃣ AI-Based Health Profile Analysis & Forecasting**

**Member:** Weerathunga B I (IT22251428)

Creates personalized health profiles, analyzes lifestyle and environmental factors, and predicts **future health trends and diet recommendations** for preventive care.

---

### **4️⃣ AR-Based Therapy Guidance System**

**Member:** Jayakodi W.B.S (IT22029904)

Uses **augmented reality (AR)** to guide users through traditional therapy procedures, helping them perform treatments correctly and safely.

---

## **Project Objectives**

* Enhance traditional medicine practices using AI
* Provide personalized and preventive healthcare solutions
* Improve safety, accuracy, and accessibility of Ayurveda-based treatments

---

## 🛠️ **Technology Stack & Dependencies**

### **Frontend (React + Vite)**

The frontend is developed using **React** with **Vite** for fast development and optimized builds.

**Core Technologies**

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS

**UI & Visualization**

* Lucide React
* React Icons
* Recharts
* html2pdf.js

**Camera, AR & Pose Detection**

* React Webcam
* MediaPipe Pose
* TensorFlow.js
* TensorFlow Pose Detection
* TensorFlow WebGL Backend

**Development Tools**

* ESLint
* PostCSS
* Autoprefixer

---

### **Backend (Node.js – MERN Stack)**

The backend is implemented using **Node.js and Express** to provide secure RESTful APIs.

**Core Backend Technologies**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Security & Authentication**

* JSON Web Token (JWT)
* Bcrypt.js
* Cookie Parser
* Helmet
* Express Rate Limit

**File Handling & Utilities**

* Multer (Image Uploads)
* Morgan (Logging)
* Dotenv
* CORS
* Axios

**AI & External Services**

* OpenAI SDK

**Development Tool**

* Nodemon

---

### **AI / Machine Learning Services (Python)**

Machine learning models and AI services are developed using **Python**, exposed via APIs.

**Frameworks & Core Libraries**

* FastAPI
* Uvicorn
* Pydantic
* Python Multipart

**Data Processing & ML**

* NumPy
* Pandas
* Scikit-learn (v1.3.2)
* Joblib
* XGBoost

**Computer Vision & Deep Learning**

* OpenCV
* Pillow
* MediaPipe
* PyTorch
* TorchVision
* TorchAudio

**Plant Identification (Advanced Vision Models)**

* TIMM
* Albumentations

---

### **Model Training & Experimentation**

* Google Colab (GPU-enabled model training and evaluation)

---

### **External APIs**

* OpenWeatherMap API (Geocoding & Weather Data)

---

## 📌 **Note**

> Full dependency details are maintained in `package.json`, `package-lock.json`, and `requirements.txt` files for reproducibility.

---

## ▶️ **How to Run the Project**

### **1️⃣ Frontend (React)**

Navigate to the frontend directory and run:

```bash
cd frontend
npm install
npm run dev
```

### **2️⃣ Backend (Node.js / Express)**

Navigate to the backend directory and run:

```bash
cd backend
npm install
npm run dev
```

---

### **3️⃣ AI / Machine Learning Service (Python – FastAPI)**

Navigate to the Python ML service directory and run:

```bash
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```












