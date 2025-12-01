// frontend/src/pages/CaptureEyesPage.jsx
import { Link } from "react-router-dom";

export default function CaptureEyesPage() {
  return (
    <section className="pt-6 pb-10">
      <h1 className="text-2xl font-semibold text-[#3e2b20] mb-4">
        Prakriti Analysis – Eyes Capture
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#cfae87] bg-[#fdf7ef] flex items-center justify-center text-[#a07b52] text-sm shadow-inner">
            Webcam Preview – Eyes
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#5a402c]">
              Eyes:
            </label>
            <select className="text-sm px-3 py-1.5 rounded-full border border-[#d7c1a5] bg-[#fdf7ef]">
              <option>Eyes region</option>
            </select>
          </div>

          <p className="text-sm text-[#7a5b3f]">
            <strong>Instructions:</strong> Look directly at the camera with eyes
            fully open.
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#6f4725]">
              Capture
            </button>
          </div>

          <div className="flex justify-between text-xs text-[#8b6b4b]">
            <Link to="/prakriti/capture/face" className="underline">
              &laquo; Back to face capture
            </Link>
            <Link
              to="/prakriti/capture/mouth"
              className="underline text-[#8b5d33]"
            >
              Next: mouth / teeth &raquo;
            </Link>
          </div>
        </div>

        {/* Right illustration */}
        <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-6 flex flex-col items-center justify-center">
          <div className="w-40 h-52 flex items-center justify-center mb-4">
            <div className="w-32 h-20 border-2 border-[#d4b690] rounded-3xl flex items-center justify-center">
              <div className="w-10 h-10 border border-[#d4b690] rounded-full" />
            </div>
          </div>
          <p className="text-sm text-center text-[#7a5b3f]">
            Focus on the eye region. Ensure both eyes are clearly visible and
            well-lit.
          </p>
        </div>
      </div>
    </section>
  );
}
