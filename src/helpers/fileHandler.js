export function handleFileUpload(file, callback) {
  if (!file || !(file instanceof File)) return;
  const url = URL.createObjectURL(file);
  callback(url);
}

export function handleDropEvent(e, callback) {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (file) handleFileUpload(file, callback);
}

export function handlePasteEvent(e, callback) {
  const fileItem = [...(e.clipboardData?.items || [])].find(
    (i) => i.kind === "file"
  );
  const file = fileItem?.getAsFile();
  if (file) handleFileUpload(file, callback);
}
