// frontend/src/pages/CaptureFacePage.jsx
import { Link } from "react-router-dom";

export default function CaptureFacePage() {
  return (
    <section className="pt-6 pb-10">
      <h1 className="text-2xl font-semibold text-[#3e2b20] mb-4">
        Prakriti Analysis – Front Face Capture
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: webcam + controls */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#cfae87] bg-[#fdf7ef] flex items-center justify-center text-[#a07b52] text-sm shadow-inner">
            Webcam Preview
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#5a402c]">
              Face:
            </label>
            <select className="text-sm px-3 py-1.5 rounded-full border border-[#d7c1a5] bg-[#fdf7ef]">
              <option>Front view</option>
              <option>Other</option>
            </select>
          </div>

          <p className="text-sm text-[#7a5b3f]">
            <strong>Instructions:</strong> Look straight at the camera with a
            neutral expression.
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#6f4725]">
              Capture
            </button>
            <button className="px-4 py-2 rounded-full bg-[#fdf7ef] border border-[#d7c1a5] text-sm font-medium text-[#5a402c] hover:bg-[#f2e4d3]">
              Reset
            </button>
          </div>

          <div className="text-xs text-[#8b6b4b]">
            Step 1 of 5 – Front face. Next:{" "}
            <Link
              to="/prakriti/capture/eyes"
              className="text-[#8b5d33] underline"
            >
              Capture eyes &raquo;
            </Link>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-6 flex flex-col items-center justify-center">
          <div className="w-40 h-52 border-2 border-[#d4b690] rounded-full flex items-center justify-center mb-4">
            <div className="w-24 h-32 border border-[#d4b690] rounded-full" />
          </div>
          <p className="text-sm text-center text-[#7a5b3f]">
            Front-view capture pose. Keep your head straight, eyes level, and
            maintain a soft, neutral expression.
          </p>
        </div>
      </div>
    </section>
  );
}
