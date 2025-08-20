// helper that does the network POST and returns an object URL for the response blob
export async function removeBackground(file, endpoint) {
  if (!file) throw new Error("No file provided");
  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch(endpoint, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  return url;
}
