// Client-side file handling for document uploads. Files are stored on the
// application as data URLs; images are downscaled so they stay small.

export const ACCEPT = ".pdf,.jpg,.jpeg,.png";
export const MAX_FILE_BYTES = 1.5 * 1024 * 1024;
export const MAX_FILES = 10;

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("Could not read that file."));
    r.readAsDataURL(file);
  });
}

function shrinkImage(dataUrl, maxSide = 1400, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// Returns { name, size, type, dataUrl } or throws an Error with a user-facing message.
export async function prepareFile(file) {
  const okType = /^(application\/pdf|image\/(jpeg|png))$/.test(file.type) || /\.(pdf|jpe?g|png)$/i.test(file.name);
  if (!okType) throw new Error("Upload a PDF, JPG or PNG file.");
  let dataUrl = await readAsDataUrl(file);
  let type = file.type || "application/octet-stream";
  if (type.startsWith("image/")) {
    dataUrl = await shrinkImage(dataUrl);
    type = "image/jpeg";
  }
  const size = Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);
  if (size > MAX_FILE_BYTES) throw new Error(`${file.name} is too large. The limit is ${formatSize(MAX_FILE_BYTES)} per file.`);
  return { name: file.name, size, type, dataUrl };
}

async function toBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function openDocument(doc) {
  const blob = await toBlob(doc.dataUrl);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export async function downloadDocument(doc) {
  const blob = await toBlob(doc.dataUrl);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = doc.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
