const root = document.documentElement;
const canvas = document.querySelector("#networkCanvas");
const ctx = canvas.getContext("2d");
const cursor = document.querySelector("#cursor");
const loader = document.querySelector("#loader");
const themeToggle = document.querySelector("#themeToggle");
const form = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const submitInquiry = document.querySelector("#submitInquiry");
const calendlyFrame = document.querySelector("#calendlyFrame");
const calendlyLoading = document.querySelector("#calendlyLoading");
const projectCards = document.querySelectorAll(".project-card");
const projectModal = document.querySelector("#projectModal");
const projectModalVideo = document.querySelector("#projectModalVideo");
const projectModalTitle = document.querySelector("#projectModalTitle");
const projectModalCopy = document.querySelector("#projectModalCopy");
const projectModalTags = document.querySelector("#projectModalTags");
const projectModalLink = document.querySelector("#projectModalLink");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let width = 0;
let height = 0;
let pointer = { x: -9999, y: -9999 };
let lastProjectTrigger = null;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  const particleCount = Math.min(90, Math.max(36, Math.floor(width / 18)));
  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.36,
    vy: (Math.random() - 0.5) * 0.36,
    r: Math.random() * 1.8 + 0.6
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = root.classList.contains("light") ? "rgba(0, 92, 120, 0.55)" : "rgba(0, 245, 255, 0.78)";
  ctx.strokeStyle = root.classList.contains("light") ? "rgba(0, 92, 120, 0.14)" : "rgba(0, 245, 255, 0.13)";

  particles.forEach((particle, index) => {
    if (!prefersReducedMotion) {
      particle.x += particle.vx;
      particle.y += particle.vy;
    }

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const distance = Math.hypot(particle.x - next.x, particle.y - next.y);

      if (distance < 145) {
        ctx.globalAlpha = 1 - distance / 145;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
    if (pointerDistance < 170) {
      ctx.globalAlpha = 1 - pointerDistance / 170;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(pointer.x, pointer.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });

  requestAnimationFrame(drawNetwork);
}

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

function observeReveals() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

function openProjectModal(projectCard) {
  const videoShell = projectCard.querySelector(".video-shell");
  const iframe = videoShell.querySelector("iframe");
  const projectInfo = projectCard.querySelector(".project-info");
  const title = projectInfo.querySelector("h3");
  const details = projectInfo.querySelectorAll("p");
  const tags = projectInfo.querySelectorAll(".tool-list span");

  lastProjectTrigger = document.activeElement;
  projectModalTitle.textContent = title.textContent;
  projectModalCopy.replaceChildren(...Array.from(details, (detail) => detail.cloneNode(true)));
  projectModalTags.replaceChildren(...Array.from(tags, (tag) => tag.cloneNode(true)));
  projectModalLink.href = videoShell.href;
  projectModalVideo.replaceChildren();

  const modalIframe = document.createElement("iframe");
  modalIframe.src = iframe.src;
  modalIframe.title = iframe.title;
  modalIframe.allowFullscreen = true;
  modalIframe.loading = "eager";
  projectModalVideo.append(modalIframe);

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  projectModal.querySelector(".project-modal-close").focus();
}

function closeProjectModal() {
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  projectModalVideo.replaceChildren();
  document.body.style.overflow = "";

  if (lastProjectTrigger) {
    lastProjectTrigger.focus();
    lastProjectTrigger = null;
  }
}

projectCards.forEach((card) => {
  card.setAttribute("role", "button");
  card.tabIndex = 0;
});

document.querySelector("#projects").addEventListener("click", (event) => {
  const card = event.target.closest(".project-card");
  if (!card) return;

  event.preventDefault();
  openProjectModal(card);
});

document.querySelector("#projects").addEventListener("keydown", (event) => {
  const card = event.target.closest(".project-card");
  if (!card || !["Enter", " "].includes(event.key)) return;

  event.preventDefault();
  openProjectModal(card);
});

projectModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-modal-close]")) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal.classList.contains("is-open")) {
    closeProjectModal();
  }
});

window.addEventListener("load", () => {
  loader.classList.add("is-hidden");
});

window.addEventListener("resize", () => {
  resizeCanvas();
});

window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

document.querySelectorAll("a, button, input, textarea").forEach((element) => {
  element.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
  element.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
});

themeToggle.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("portfolio-theme", root.classList.contains("light") ? "light" : "dark");
});

function setFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.classList.remove("is-error", "is-success");
  if (type) formStatus.classList.add(type);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    setFormStatus("Please complete every field before sending.", "is-error");
    return;
  }

  const formData = new FormData(form);

  if (formData.get("botcheck")) return;

  console.log("Submission started");
  submitInquiry.disabled = true;
  submitInquiry.textContent = "Sending...";
  setFormStatus("Sending your inquiry...", "");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Submission failed");
    }

    form.reset();
    console.log("Submission successful");
    setFormStatus("Thank you! Your inquiry has been sent successfully. I will get back to you soon.", "is-success");
  } catch (error) {
    console.log("Submission failed", error);
    setFormStatus("Something went wrong. Please try again later.", "is-error");
  } finally {
    submitInquiry.disabled = false;
    submitInquiry.textContent = "Send Project Inquiry";
  }
});

if (calendlyFrame && calendlyLoading) {
  calendlyFrame.addEventListener("load", () => {
    calendlyLoading.classList.add("is-hidden");
  });
}

if (localStorage.getItem("portfolio-theme") === "light") {
  root.classList.add("light");
}

document.querySelector("#year").textContent = new Date().getFullYear();

resizeCanvas();
observeReveals();
animateCounters();
drawNetwork();
