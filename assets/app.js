// Simple form handler that posts to Formspree (or any POST endpoint).
// Replace FORM_ENDPOINT with your Formspree endpoint (or other endpoint).
const FORM_ENDPOINT = "https://formspree.io/f/your-form-id"; // <-- replace this

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lead-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const clearBtn = document.getElementById("clear-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);
    const payload = {};
    formData.forEach((v,k) => payload[k] = v);

    // Basic client-side validation
    if (!payload.name || !payload.email || !payload.phone) {
      status.textContent = "Please fill name, email and phone.";
      status.style.color = "crimson";
      submitBtn.disabled = false;
      submitBtn.textContent = "Request Demo";
      return;
    }

    try {
      // Primary route: send to Formspree (replace FORM_ENDPOINT)
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        status.style.color = "green";
        status.textContent = "Thanks — we received your request. We'll contact you soon.";
        form.reset();
        // store locally for quick reference (optional)
        try { localStorage.setItem("lastLead", JSON.stringify(payload)); } catch(e){}
      } else {
        // Fallback: try sending as URL-encoded to the same endpoint
        const res2 = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(payload).toString()
        });
        if (res2.ok) {
          status.style.color = "green";
          status.textContent = "Thanks — we received your request. We'll contact you soon.";
          form.reset();
        } else {
          throw new Error("Form submission failed");
        }
      }
    } catch (err) {
      console.error("Submit error", err);
      status.style.color = "crimson";
      status.innerHTML = "Submission failed. As a temporary fallback, you can email <a href='mailto:hello@voigen.ai'>hello@voigen.ai</a>";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Request Demo";
    }
  });

  clearBtn.addEventListener("click", () => {
    form.reset();
    status.textContent = "";
  });
});
