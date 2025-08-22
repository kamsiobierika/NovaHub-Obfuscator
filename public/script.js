const form = document.getElementById("uploadForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "Uploading & obfuscating...";

  const formData = new FormData(form);
  try {
    const response = await fetch("/obfuscate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Obfuscation failed.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "obfuscated.lua";
    document.body.appendChild(a);
    a.click();
    a.remove();

    status.textContent = "✅ Obfuscation complete!";
  } catch (err) {
    status.textContent = "❌ Error: " + err.message;
  }
});
