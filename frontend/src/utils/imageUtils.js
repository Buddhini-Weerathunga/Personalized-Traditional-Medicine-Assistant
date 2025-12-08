// Convert a webcam data URL (base64) into a File object
export async function dataUrlToFile(dataUrl, fileName = "capture.jpg") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || "image/jpeg" });
}
