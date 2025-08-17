import QRCodeLib from "qrcode";
// Utility Component
import { showToast } from "../../components/utils/showToast";

export const downloadQRCode = async (input, format, resolution) => {
  if (!input?.trim()) return;
  try {
    if (format === "svg") {
      const svgString = await QRCodeLib.toString(input, {
        type: "svg",
        margin: 2,
      });
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(input || "qrcode").slice(0, 40)}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return;
    }

    const type =
      format === "jpg" || format === "jpeg" ? "image/jpeg" : `image/${format}`;
    const dataUrl = await QRCodeLib.toDataURL(input, {
      type,
      width: resolution,
      margin: 2,
    });

    const a = document.createElement("a");
    a.href = dataUrl;
    const ext = format === "jpeg" ? "jpg" : format;
    a.download = `${(input || "qrcode").slice(0, 40)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error(err);
    alert("Download failed - check console.");
  }
};

export const copyQRCode = async (input, format, resolution) => {
  if (!input?.trim()) return;
  try {
    if (format === "svg") {
      const svgString = await QRCodeLib.toString(input, {
        type: "svg",
        margin: 2,
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/svg+xml": blob }),
        ]);
        showToast("Image copied!");
        return;
      }
    } else {
      const mime =
        format === "jpg" || format === "jpeg"
          ? "image/jpeg"
          : `image/${format}`;
      const dataUrl = await QRCodeLib.toDataURL(input, {
        type: mime,
        width: resolution,
        margin: 2,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        showToast("Image copied!");
        return;
      }
    }
  } catch (err) {
    console.error(err);
    alert("Copy image failed - check console.");
  }
};

export const shareQRCode = async (
  input,
  format,
  resolution,
  downloadFallback
) => {
  if (!input?.trim()) return;
  try {
    let blob;
    if (format === "svg") {
      const svgString = await QRCodeLib.toString(input, {
        type: "svg",
        margin: 2,
      });
      blob = new Blob([svgString], { type: "image/svg+xml" });
    } else {
      const mime =
        format === "jpg" || format === "jpeg"
          ? "image/jpeg"
          : `image/${format}`;
      const dataUrl = await QRCodeLib.toDataURL(input, {
        type: mime,
        width: resolution,
        margin: 2,
      });
      const res = await fetch(dataUrl);
      blob = await res.blob();
    }

    const file = new File(
      [blob],
      `qrcode.${format === "jpeg" ? "jpg" : format}`,
      { type: blob.type }
    );

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "QR Code", text: input });
    } else if (navigator.share) {
      await navigator.share({ title: "QR Code", text: input });
    } else {
      downloadFallback(format);
    }
  } catch (err) {
    console.error(err);
    alert("Share failed - check console.");
  }
};
