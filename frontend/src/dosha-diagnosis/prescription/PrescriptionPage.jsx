// frontend/src/dosha-diagnosis/prescription/PrescriptionPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";

export default function PrescriptionPage() {
  return (
    <>
      {/* SHOW NAVBAR ONLY HERE */}
      <Navbar />

      <section className="pt-6 pb-10">
        <h1 className="text-2xl font-semibold text-[#3e2b20] mb-3">
          Prescription (Coming Soon)
        </h1>

        <p className="text-sm text-[#7a5b3f] max-w-xl">
          Here you can view and manage your medical prescriptions, including
          prescribed medicines, dosages, and recommended treatment plans.
          This section helps you keep track of your healthcare regimen in an
          organized way.
        </p>
      </section>
      
    </>
  );
}
