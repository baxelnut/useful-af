import QRCodeLib from "qrcode";
// Utility Component
import { showToast } from "../../components/utils/showToast";

// serialize an SVG element to string and ensure xmlns attr
function svgElementToString(svgEl) {
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgEl);
  if (!svgString.match(/^<svg[^>]+xmlns="http/)) {
    svgString = svgString.replace(
      /^<svg/,
      `<svg xmlns="http://www.w3.org/2000/svg"`
    );
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
}

// convert SVG string to data URL
function svgToDataUrl(svgString) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
}

// draw SVG (string) into canvas at given size and background color
function rasterizeSvgToCanvas(svgString, size, bgColor) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);
        } else {
          ctx.clearRect(0, 0, size, size);
        }

        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(e);
    img.crossOrigin = "anonymous";
    img.src = svgToDataUrl(svgString);
  });
}

// --------- Public helpers ---------

export const downloadQRCode = async (
  input,
  format,
  resolution,
  qrDom,
  fgColor = "#000000",
  bgColor = "#ffffff"
) => {
  if (!input?.trim()) return;

  try {
    // If preview SVG exists, serialize that and export from it (preserves styling)
    if (qrDom) {
      const svgEl = qrDom.querySelector("svg");
      if (svgEl) {
        // Make sure svg has width/height attributes if user wants rasterized version at custom resolution:
        // clone and set preserveAspectRatio/viewBox doesn't get lost by serializer
        const cloned = svgEl.cloneNode(true);
        // if resolution is requested for raster, we don't change produced SVG for download (SVG is resolution independent)
        const svgString = svgElementToString(cloned);

        if (format === "svg") {
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

        // raster formats: render SVG -> canvas -> toDataURL
        const canvas = await rasterizeSvgToCanvas(
          svgString,
          resolution,
          bgColor
        );
        const mime =
          format === "jpg" || format === "jpeg"
            ? "image/jpeg"
            : `image/${format}`;
        const dataUrl = canvas.toDataURL(mime);
        const a = document.createElement("a");
        a.href = dataUrl;
        const ext = format === "jpeg" ? "jpg" : format;
        a.download = `${(input || "qrcode").slice(0, 40)}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
    }

    // fallback to qrcode lib (no styling) but include colors
    if (format === "svg") {
      const svgString = await QRCodeLib.toString(input, {
        type: "svg",
        margin: 2,
        color: { dark: fgColor, light: bgColor },
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

    const mime =
      format === "jpg" || format === "jpeg" ? "image/jpeg" : `image/${format}`;
    const dataUrl = await QRCodeLib.toDataURL(input, {
      type: mime,
      width: resolution,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    });

    const a = document.createElement("a");
    a.href = dataUrl;
    const ext = format === "jpeg" ? "jpg" : format;
    a.download = `${(input || "qrcode").slice(0, 40)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("QR download error:", err);
    alert("Failed to generate QR for download — check console.");
  }
};

export const copyQRCode = async (
  input,
  format,
  resolution,
  qrDom,
  fgColor = "#000000",
  bgColor = "#ffffff"
) => {
  if (!input?.trim()) return;

  try {
    if (qrDom) {
      const svgEl = qrDom.querySelector("svg");
      if (svgEl) {
        const svgString = svgElementToString(svgEl);

        if (format === "svg") {
          const blob = new Blob([svgString], { type: "image/svg+xml" });
          if (navigator.clipboard?.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/svg+xml": blob }),
            ]);
            showToast("Image copied!");
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "qrcode.svg";
          a.click();
          URL.revokeObjectURL(url);
          return;
        }

        // raster copy: render canvas then clipboard
        const canvas = await rasterizeSvgToCanvas(
          svgString,
          resolution,
          bgColor
        );
        if (navigator.clipboard?.write) {
          const blob = await new Promise((res) =>
            canvas.toBlob(res, `image/${format}`, 1)
          );
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
          ]);
          showToast("Image copied!");
          return;
        }

        // fallback download
        const dataUrl = canvas.toDataURL(`image/${format}`);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `qrcode.${format === "jpeg" ? "jpg" : format}`;
        a.click();
        return;
      }
    }

    // fallback to qrcode lib path — include colors here
    if (format === "svg") {
      const svgString = await QRCodeLib.toString(input, {
        type: "svg",
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/svg+xml": blob }),
        ]);
        showToast("Image copied!");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const mime =
      format === "jpg" || format === "jpeg" ? "image/jpeg" : `image/${format}`;
    const dataUrl = await QRCodeLib.toDataURL(input, {
      type: mime,
      width: resolution,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
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
    // fallback download
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode.${format === "jpeg" ? "jpg" : format}`;
    a.click();
  } catch (err) {
    console.error("QR copy error:", err);
    alert("Copy image failed - check console.");
  }
};

export const shareQRCode = async (
  input,
  format,
  resolution,
  qrDom,
  fgColor = "#000000",
  bgColor = "#ffffff",
  downloadFallback
) => {
  if (!input?.trim()) return;
  try {
    if (qrDom) {
      const svgEl = qrDom.querySelector("svg");
      if (svgEl) {
        const svgString = svgElementToString(svgEl);

        if (format === "svg") {
          const blob = new Blob([svgString], { type: "image/svg+xml" });
          const file = new File([blob], "qrcode.svg", { type: blob.type });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "QR Code",
              text: input,
            });
            return;
          }
          if (navigator.share) {
            await navigator.share({ title: "QR Code", text: input });
            return;
          }
          downloadFallback && downloadFallback(format);
          return;
        }

        const canvas = await rasterizeSvgToCanvas(
          svgString,
          resolution,
          bgColor
        );
        const blob = await new Promise((res) =>
          canvas.toBlob(res, `image/${format}`, 1)
        );
        const file = new File(
          [blob],
          `qrcode.${format === "jpeg" ? "jpg" : format}`,
          { type: blob.type }
        );

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "QR Code",
            text: input,
          });
          return;
        }
        if (navigator.share) {
          await navigator.share({ title: "QR Code", text: input });
          return;
        }

        downloadFallback && downloadFallback(format);
        return;
      }
    }

    // fallback: use QRCodeLib (include color)
    let blob;
    if (format === "svg") {
      const svgString = await QRCodeLib.toString(input, {
        type: "svg",
        margin: 2,
        color: { dark: fgColor, light: bgColor },
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
        color: { dark: fgColor, light: bgColor },
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
      return;
    }
    if (navigator.share) {
      await navigator.share({ title: "QR Code", text: input });
      return;
    }

    if (downloadFallback) downloadFallback(format);
  } catch (err) {
    console.error("QR share error:", err);
    alert("Share failed - check console.");
  }
};
