// frontend/src/pages/CaptureProfilePage.jsx
import { Link, useNavigate } from "react-router-dom";

export default function CaptureProfilePage() {
  const navigate = useNavigate();

  return (
    <section className="pt-6 pb-10">
      <h1 className="text-2xl font-semibold text-[#3e2b20] mb-4">
        Prakriti Analysis – Profile View Capture
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#cfae87] bg-[#fdf7ef] flex items-center justify-center text-[#a07b52] text-sm shadow-inner">
            Webcam Preview – Profile View
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#5a402c]">
              Profile:
            </label>
            <select className="text-sm px-3 py-1.5 rounded-full border border-[#d7c1a5] bg-[#fdf7ef]">
              <option>Side profile</option>
            </select>
          </div>

          <p className="text-sm text-[#7a5b3f]">
            <strong>Instructions:</strong> Turn your face to the side to show
            your profile.
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#6f4725]">
              Capture
            </button>
            <button className="px-4 py-2 rounded-full bg-[#fdf7ef] border border-[#d7c1a5] text-sm font-medium text-[#5a402c] hover:bg-[#f2e4d3]">
              Reset
            </button>
          </div>

          {/* Thumbnails row (placeholders) */}
          <div className="mt-4 flex gap-2">
            {["Face", "Eyes", "Mouth", "Skin", "Profile"].map((label) => (
              <div
                key={label}
                className="w-14 h-14 rounded-xl bg-[#f7ebdd] border border-[#dec7a7] flex items-center justify-center text-[11px] text-[#7a5b3f]"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-[#8b6b4b] mt-2">
            <Link to="/prakriti/capture/skin" className="underline">
              &laquo; Back to skin capture
            </Link>
            <button
              onClick={() => navigate("/prakriti/results")}
              className="underline text-[#8b5d33]"
            >
              View Prakriti results &raquo;
            </button>
          </div>
        </div>

        <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-6 flex flex-col items-center justify-center">
          <div className="w-36 h-40 flex items-center justify-center mb-4">
            <div className="w-24 h-32 border-2 border-[#d4b690] rounded-[999px] relative">
              <div className="absolute right-0 top-12 w-10 h-14 border border-[#d4b690] rounded-[999px]" />
            </div>
          </div>
          <p className="text-sm text-center text-[#7a5b3f]">
            Side-profile outline helps assess jawline, nose, and overall
            structure in relation to Vata, Pitta, and Kapha traits.
          </p>
        </div>
      </div>
    </section>
  );
}
