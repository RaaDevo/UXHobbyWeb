"use strict";

(() => {
  // Fetch and display a random beginner photography tip.
  function initialisePhotographyTips() {
    const spinner = document.getElementById("tip-spinner");
    const content = document.getElementById("tip-content");
    const category = document.getElementById("tip-category");
    const title = document.getElementById("tip-title");
    const description = document.getElementById("tip-description");
    const newTipButton = document.getElementById("new-tip-button");
    const errorMessage = document.getElementById("tip-error");

    const requiredElements = [
      spinner,
      content,
      category,
      title,
      description,
      newTipButton,
      errorMessage,
    ];

    if (requiredElements.some((element) => !element)) {
      return;
    }

    let photographyTips = [];
    let currentTipIndex = -1;

    function displayRandomTip() {
      if (photographyTips.length === 0) {
        return;
      }

      let nextTipIndex = Math.floor(Math.random() * photographyTips.length);

      if (photographyTips.length > 1 && currentTipIndex >= 0) {
        nextTipIndex = Math.floor(Math.random() * (photographyTips.length - 1));

        if (nextTipIndex >= currentTipIndex) {
          nextTipIndex += 1;
        }
      }

      currentTipIndex = nextTipIndex;
      const selectedTip = photographyTips[currentTipIndex];

      category.textContent = selectedTip.category;
      title.textContent = selectedTip.title;
      description.textContent = selectedTip.tip;
      content.hidden = false;
      errorMessage.hidden = true;
    }

    async function loadPhotographyTips() {
      try {
        const response = await fetch("data/photography-tips.json");

        if (!response.ok) {
          throw new Error(`Photography tips request failed with status ${response.status}.`);
        }

        const retrievedTips = await response.json();

        if (!Array.isArray(retrievedTips) || retrievedTips.length === 0) {
          throw new Error("The photography tips file does not contain a usable tip list.");
        }

        photographyTips = retrievedTips;
        displayRandomTip();
      } catch (error) {
        content.hidden = true;
        errorMessage.hidden = false;
      } finally {
        spinner.hidden = true;
      }
    }

    newTipButton.addEventListener("click", displayRandomTip);
    loadPhotographyTips();
  }

  // Filter gallery cards in place and keep button state accessible.
  function initialiseGalleryFilters() {
    const filterButtons = Array.from(document.querySelectorAll(".gallery-filter"));
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

    if (filterButtons.length === 0 || galleryItems.length === 0) {
      return;
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        galleryItems.forEach((item) => {
          const shouldShow = selectedFilter === "all" || item.dataset.category === selectedFilter;
          const itemContainer = item.closest(".gallery-item-container") || item;
          itemContainer.classList.toggle("is-filtered-out", !shouldShow);
          itemContainer.setAttribute("aria-hidden", String(!shouldShow));
        });
      });
    });
  }

  // Reveal supporting images as they approach the viewport.
  function initialiseImageReveals() {
    const revealImages = Array.from(document.querySelectorAll(".reveal-image"));

    if (revealImages.length === 0) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealImages.forEach((image) => image.classList.add("is-visible"));
      return;
    }

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px 120px 0px", threshold: 0.1 },
    );

    revealImages.forEach((image) => {
      image.classList.add("reveal-pending");
      imageObserver.observe(image);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initialisePhotographyTips();
    initialiseGalleryFilters();
    initialiseImageReveals();
  });
})();
