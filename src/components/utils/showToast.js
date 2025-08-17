export const showToast = (msg) => {
  // Create overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9998,
  });

  // Create toast
  const t = document.createElement("div");
  t.textContent = msg;
  Object.assign(t.style, {
    background: "var(--text)",
    color: "var(--bg)",
    padding: "8px 12px",
    borderRadius: "0.25rem",
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  });

  overlay.appendChild(t);
  document.body.appendChild(overlay);

  setTimeout(() => overlay.remove(), 1000);
};
