(function setupTransitions(){
  const links = document.querySelectorAll(".transition-link");
  if (!links.length) return;

  links.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.dataset.link;
      if (!target) return;
      window.location.href = target;
    });
  });
})();

(function createCOCRain(){
  const rain = document.getElementById("cocRain");
  if (!rain) return;

  function drop() {
    const el = document.createElement("div");
    el.className = "coc-drop";
    el.textContent = "C.O.C";
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${2.8 + Math.random() * 2.2}s`;
    el.style.fontSize = `${0.9 + Math.random() * 0.8}rem`;
    rain.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 6000);
  }

  for (let i = 0; i < 12; i++) {
    setTimeout(drop, i * 160);
  }

  setInterval(drop, 320);
})();

(function setupHeroParallax(){
  const wrap = document.getElementById("titleWrap");
  if (!wrap) return;

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    wrap.style.transform = `translate(${x}px, ${y}px)`;
  });
})();

(function revealOnScroll(){
  const items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.18 });

  items.forEach(item => observer.observe(item));
})();

function createImagePile(containerId, imageSources, maxImages = 10, interval = 4200) {
  const container = document.getElementById(containerId);
  if (!container || !imageSources || imageSources.length === 0) return;

  let count = 0;

  function addImage() {
    const img = document.createElement("img");
    img.className = "pile-image";
    img.src = imageSources[count % imageSources.length];
    img.alt = "";

    const rect = container.getBoundingClientRect();
    const maxX = Math.max(40, rect.width - 240);
    const maxY = Math.max(40, rect.height - 180);

    img.style.left = `${Math.random() * maxX}px`;
    img.style.top = `${Math.random() * maxY}px`;
    img.style.setProperty("--rot", `${(Math.random() * 18 - 9).toFixed(2)}deg`);

    container.appendChild(img);
    count += 1;

    if (container.children.length > maxImages) {
      container.removeChild(container.children[0]);
    }
  }

  for (let i = 0; i < 2; i++) {
    setTimeout(addImage, i * 1800);
  }

  setInterval(() => {
    const delay = Math.random() * 3000 + 1500;
    setTimeout(addImage, delay);
  }, interval);
}

const errorPileImages = [
  "file_icon_18.png",
  "file_icon_14.png",
  "file_icon_15.png",
  "file_icon_16.png",
  "file_icon_17.png"
];

const incompletePileImages = [
  "in-1-01.png",
  "in-1-02.png",
  "in-1-03.png",
  "in-1-04.png",
  "in-1-05.png",
  "in-1-06.png"
];

createImagePile("errorPileArea", errorPileImages, 8, 5000);
createImagePile("incompletePileArea", incompletePileImages, 8, 5000);

(function setupCarousel(){
  const track = document.getElementById("usageTrack");
  const prev = document.getElementById("usagePrev");
  const next = document.getElementById("usageNext");
  const carousel = document.getElementById("usageCarousel");

  if (!track || !prev || !next || !carousel) return;

  let current = 0;
  const slides = track.children.length;

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  prev.addEventListener("click", () => {
    current = (current - 1 + slides) % slides;
    update();
  });

  next.addEventListener("click", () => {
    current = (current + 1) % slides;
    update();
  });

  let startX = 0;
  let endX = 0;

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        current = (current + 1) % slides;
      } else {
        current = (current - 1 + slides) % slides;
      }
      update();
    }
  }, { passive: true });

  update();
})();

(function setupDraggableGallery(){
  const gallery = document.getElementById("errorGallery");
  if (!gallery) return;

  const items = gallery.querySelectorAll(".draggable-item");
  let z = 10;

  items.forEach((item) => {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const onPointerDown = (e) => {
      if (window.innerWidth <= 700) return;

      dragging = true;
      z += 1;
      item.style.zIndex = z;
      item.classList.add("dragging");

      const rect = item.getBoundingClientRect();
      const parentRect = gallery.getBoundingClientRect();

      startX = e.clientX;
      startY = e.clientY;
      offsetX = rect.left - parentRect.left;
      offsetY = rect.top - parentRect.top;

      item.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      item.style.left = `${offsetX + dx}px`;
      item.style.top = `${offsetY + dy}px`;
      item.style.right = "auto";
      item.style.transform = "none";
    };

    const onPointerUp = (e) => {
      dragging = false;
      item.classList.remove("dragging");
      if (item.hasPointerCapture(e.pointerId)) {
        item.releasePointerCapture(e.pointerId);
      }
    };

    item.addEventListener("pointerdown", onPointerDown);
    item.addEventListener("pointermove", onPointerMove);
    item.addEventListener("pointerup", onPointerUp);
    item.addEventListener("pointercancel", onPointerUp);
  });
})();