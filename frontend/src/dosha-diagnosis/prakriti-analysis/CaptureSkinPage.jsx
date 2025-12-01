// frontend/src/pages/CaptureSkinPage.jsx
import { Link } from "react-router-dom";

export default function CaptureSkinPage() {
  return (
    <section className="pt-6 pb-10">
      <h1 className="text-2xl font-semibold text-[#3e2b20] mb-4">
        Prakriti Analysis – Skin Texture Capture
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#cfae87] bg-[#fdf7ef] flex items-center justify-center text-[#a07b52] text-sm shadow-inner">
            Webcam Preview – Skin Texture
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#5a402c]">Skin:</label>
            <select className="text-sm px-3 py-1.5 rounded-full border border-[#d7c1a5] bg-[#fdf7ef]">
              <option>Face skin zones</option>
            </select>
          </div>

          <p className="text-sm text-[#7a5b3f]">
            <strong>Instructions:</strong> Position your face towards the camera
            in good lighting to capture skin texture.
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#6f4725]">
              Capture
            </button>
            <button className="px-4 py-2 rounded-full bg-[#fdf7ef] border border-[#d7c1a5] text-sm font-medium text-[#5a402c] hover:bg-[#f2e4d3]">
              Reset
            </button>
          </div>

          <div className="flex justify-between text-xs text-[#8b6b4b]">
            <Link to="/prakriti/capture/mouth" className="underline">
              &laquo; Back to mouth/teeth
            </Link>
            <Link
              to="/prakriti/capture/profile"
              className="underline text-[#8b5d33]"
            >
              Next: profile view &raquo;
            </Link>
          </div>
        </div>

        <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-6 flex flex-col items-center justify-center">
          <div className="w-40 h-52 border-2 border-[#d4b690] rounded-3xl relative mb-4">
            <div className="absolute inset-4 border border-dashed border-[#d4b690] rounded-3xl" />
            <div className="absolute top-8 left-12 w-6 h-6 rounded-full border border-[#d4b690]" />
            <div className="absolute top-24 left-8 w-28 h-10 border border-[#d4b690] rounded-full opacity-60" />
          </div>
          <p className="text-sm text-center text-[#7a5b3f]">
            Different facial zones (forehead, cheeks, chin) help assess skin
            type and texture for dosha evaluation.
          </p>
        </div>
      </div>
    </section>
  );
}
