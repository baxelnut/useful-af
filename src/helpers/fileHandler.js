export function handleFileUpload(file, callback) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  callback(url);
}
