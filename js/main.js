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

  // Update the colour-harmony lesson and its preview without affecting the rest of the page.
  function initialiseColourHarmonyPreview() {
    const harmonySection = document.getElementById("harmonies");

    if (!harmonySection) {
      return;
    }

    const harmonyCards = Array.from(harmonySection.querySelectorAll(".harmony-card"));
    const previewName = document.getElementById("harmony-preview-name");
    const previewDescription = document.getElementById("harmony-preview-description");
    const sampleTitle = document.getElementById("harmony-sample-title");
    const sampleDescription = document.getElementById("harmony-sample-description");
    const resetButton = document.getElementById("reset-harmony");

    if (
      harmonyCards.length === 0
      || !previewName
      || !previewDescription
      || !sampleTitle
      || !sampleDescription
      || !resetButton
    ) {
      return;
    }

    const harmonyPalettes = {
      complementary: {
        name: "Complementary",
        colours: ["#245995", "#F2A93B", "#FFF4DF"],
        surface: "#FFF8EB",
        description: "Blue and orange create strong contrast, helping a warm subject stand out clearly against a cooler background.",
        sampleTitle: "Contrast that directs attention",
        sampleDescription: "Use one colour as the main atmosphere and its opposite as a smaller focal accent.",
      },
      analogous: {
        name: "Analogous",
        colours: ["#245995", "#4A89B8", "#76B5C5"],
        surface: "#EDF7F9",
        description: "Neighbouring blues create a calm, connected palette that works well for landscapes, interiors and reflective scenes.",
        sampleTitle: "A calm family of colours",
        sampleDescription: "Let related hues fill most of the frame, then use brightness to separate the subject.",
      },
      monochromatic: {
        name: "Monochromatic",
        colours: ["#76539B", "#9F84BD", "#D4C4E8"],
        surface: "#F2ECF8",
        description: "Variations of one purple hue create a focused visual identity. Changes in brightness keep the subject separate while the palette stays calm and cohesive.",
        sampleTitle: "Focused shades of purple",
        sampleDescription: "Use light and dark versions of one hue to simplify the frame while preserving depth.",
      },
      triadic: {
        name: "Triadic",
        colours: ["#C83A2D", "#F0B82F", "#245995"],
        surface: "#FFF6E3",
        description: "Red, yellow and blue create an energetic balance that can suit lively street scenes, markets and event photography.",
        sampleTitle: "Energy held in balance",
        sampleDescription: "Choose one dominant colour and use the other two more sparingly so the frame stays readable.",
      },
    };

    function selectHarmony(harmonyName) {
      const selectedPalette = harmonyPalettes[harmonyName];

      if (!selectedPalette) {
        return;
      }

      harmonySection.style.setProperty("--harmony-primary", selectedPalette.colours[0]);
      harmonySection.style.setProperty("--harmony-secondary", selectedPalette.colours[1]);
      harmonySection.style.setProperty("--harmony-tertiary", selectedPalette.colours[2]);
      harmonySection.style.setProperty("--harmony-text", "#0b1f3a");
      harmonySection.style.setProperty("--harmony-surface", selectedPalette.surface);

      harmonyCards.forEach((card) => {
        const isSelected = card.dataset.harmony === harmonyName;
        const selectedIndicator = card.querySelector(".harmony-selected-indicator");
        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));

        if (selectedIndicator) {
          selectedIndicator.hidden = !isSelected;
        }
      });

      previewName.textContent = selectedPalette.name;
      previewDescription.textContent = selectedPalette.description;
      sampleTitle.textContent = selectedPalette.sampleTitle;
      sampleDescription.textContent = selectedPalette.sampleDescription;
    }

    harmonyCards.forEach((card) => {
      card.addEventListener("click", () => selectHarmony(card.dataset.harmony));
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        selectHarmony(card.dataset.harmony);
      });
    });

    resetButton.addEventListener("click", () => selectHarmony("monochromatic"));
    selectHarmony("monochromatic");
  }

  // Fetch, filter and render upcoming Frame & Focus practice events.
  function initialisePhotographyEvents() {
    const spinner = document.getElementById("events-spinner");
    const eventsGrid = document.getElementById("events-grid");
    const errorMessage = document.getElementById("events-error");
    const emptyMessage = document.getElementById("events-empty");
    const showAllButton = document.getElementById("show-all-events");
    const filterButtons = Array.from(document.querySelectorAll(".event-filter"));
    const modalElement = document.getElementById("eventDetailsModal");
    const modalType = document.getElementById("event-modal-type");
    const modalTitle = document.getElementById("event-modal-title");
    const modalDate = document.getElementById("event-modal-date");
    const modalTime = document.getElementById("event-modal-time");
    const modalLocation = document.getElementById("event-modal-location");
    const modalDescription = document.getElementById("event-modal-description");

    const requiredElements = [
      spinner,
      eventsGrid,
      errorMessage,
      emptyMessage,
      showAllButton,
      modalElement,
      modalType,
      modalTitle,
      modalDate,
      modalTime,
      modalLocation,
      modalDescription,
    ];

    if (requiredElements.some((element) => !element) || filterButtons.length === 0) {
      return;
    }

    const initialEventLimit = 3;
    const requiredEventFields = ["title", "date", "time", "location", "type", "description"];
    const dateFormatter = new Intl.DateTimeFormat("en-SG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    let upcomingEvents = [];
    let activeFilter = "all";
    let showAllEvents = false;

    function parseLocalDate(dateString) {
      const dateParts = dateString.split("-").map(Number);

      if (dateParts.length !== 3 || dateParts.some((part) => !Number.isInteger(part))) {
        return null;
      }

      const [year, month, day] = dateParts;
      const parsedDate = new Date(year, month - 1, day);

      if (
        parsedDate.getFullYear() !== year
        || parsedDate.getMonth() !== month - 1
        || parsedDate.getDate() !== day
      ) {
        return null;
      }

      return parsedDate;
    }

    function isValidEvent(eventItem) {
      return eventItem
        && typeof eventItem === "object"
        && requiredEventFields.every(
          (field) => typeof eventItem[field] === "string" && eventItem[field].trim() !== "",
        )
        && parseLocalDate(eventItem.date) !== null;
    }

    function eventMatchesFilter(eventItem) {
      if (activeFilter === "all") {
        return true;
      }

      if (activeFilter === "photo-walk") {
        return eventItem.type === "Photo Walk";
      }

      if (activeFilter === "workshop") {
        return eventItem.type === "Workshop";
      }

      if (activeFilter === "challenge") {
        return eventItem.type === "Photography Challenge";
      }

      return !["Photo Walk", "Workshop", "Photography Challenge"].includes(eventItem.type);
    }

    function formatEventDate(eventItem) {
      return dateFormatter.format(parseLocalDate(eventItem.date));
    }

    function openEventModal(eventItem) {
      modalType.textContent = eventItem.type;
      modalTitle.textContent = eventItem.title;
      modalDate.textContent = formatEventDate(eventItem);
      modalTime.textContent = eventItem.time;
      modalLocation.textContent = eventItem.location;
      modalDescription.textContent = eventItem.description;

      if (window.bootstrap && window.bootstrap.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(modalElement).show();
      }
    }

    function createEventCard(eventItem) {
      const column = document.createElement("div");
      const card = document.createElement("article");
      const cardBody = document.createElement("div");
      const typeBadge = document.createElement("span");
      const title = document.createElement("h3");
      const metaList = document.createElement("ul");
      const dateItem = document.createElement("li");
      const timeItem = document.createElement("li");
      const locationItem = document.createElement("li");
      const description = document.createElement("p");
      const detailsButton = document.createElement("button");

      column.className = "col-md-6 col-xl-4";
      card.className = "card event-card h-100";
      cardBody.className = "card-body p-4";
      typeBadge.className = "event-type-badge align-self-start mb-3";
      title.className = "h4";
      metaList.className = "event-meta mb-3";
      description.className = "mb-4";
      detailsButton.className = "btn btn-outline-primary";
      detailsButton.type = "button";

      typeBadge.textContent = eventItem.type;
      title.textContent = eventItem.title;
      dateItem.textContent = `Date: ${formatEventDate(eventItem)}`;
      timeItem.textContent = `Time: ${eventItem.time}`;
      locationItem.textContent = `Location: ${eventItem.location}`;
      description.textContent = eventItem.description;
      detailsButton.textContent = "View Details";
      detailsButton.addEventListener("click", () => openEventModal(eventItem));

      metaList.append(dateItem, timeItem, locationItem);
      cardBody.append(typeBadge, title, metaList, description, detailsButton);
      card.append(cardBody);
      column.append(card);
      return column;
    }

    function renderEvents() {
      const filteredEvents = upcomingEvents.filter(eventMatchesFilter);
      const visibleEvents = showAllEvents
        ? filteredEvents
        : filteredEvents.slice(0, initialEventLimit);

      eventsGrid.replaceChildren();
      emptyMessage.hidden = filteredEvents.length !== 0;
      emptyMessage.textContent = upcomingEvents.length === 0
        ? "No upcoming events are currently listed. Please check back soon."
        : "No upcoming events match this filter. Try another category.";

      const eventCards = document.createDocumentFragment();
      visibleEvents.forEach((eventItem) => eventCards.append(createEventCard(eventItem)));
      eventsGrid.append(eventCards);

      const canExpand = filteredEvents.length > initialEventLimit;
      showAllButton.hidden = !canExpand;
      showAllButton.textContent = showAllEvents ? "Show Fewer Events" : "Show All Events";
      showAllButton.setAttribute("aria-expanded", String(showAllEvents && canExpand));
    }

    async function loadEvents() {
      try {
        const response = await fetch("data/events.json");

        if (!response.ok) {
          throw new Error(`Events request failed with status ${response.status}.`);
        }

        const retrievedEvents = await response.json();

        if (!Array.isArray(retrievedEvents)) {
          throw new Error("The events file does not contain an event list.");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        upcomingEvents = retrievedEvents
          .filter(isValidEvent)
          .filter((eventItem) => parseLocalDate(eventItem.date) >= today)
          .sort((firstEvent, secondEvent) => (
            parseLocalDate(firstEvent.date) - parseLocalDate(secondEvent.date)
          ));

        errorMessage.hidden = true;
        renderEvents();
      } catch (error) {
        eventsGrid.replaceChildren();
        errorMessage.hidden = false;
        emptyMessage.hidden = true;
        showAllButton.hidden = true;
      } finally {
        spinner.hidden = true;
      }
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.eventFilter;
        showAllEvents = false;

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        renderEvents();
      });
    });

    showAllButton.addEventListener("click", () => {
      showAllEvents = !showAllEvents;
      renderEvents();
    });

    loadEvents();
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
    initialiseColourHarmonyPreview();
    initialisePhotographyEvents();
    initialiseGalleryFilters();
    initialiseImageReveals();
  });
})();
