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
    const sampleImage = document.getElementById("harmony-sample-image");
    const colourValues = Array.from(harmonySection.querySelectorAll(".harmony-colour-value"));
    const resetButton = document.getElementById("reset-harmony");

    if (
      harmonyCards.length === 0
      || !previewName
      || !previewDescription
      || !sampleTitle
      || !sampleDescription
      || !sampleImage
      || colourValues.length !== 3
      || !resetButton
    ) {
      return;
    }

    const harmonyPalettes = {
      complementary: {
        name: "Complementary",
        colours: ["#245995", "#F2A93B", "#FFF4DF"],
        surface: "#FFF8EB",
        tertiaryText: "#0B1F3A",
        description: "Blue and orange create strong contrast, helping a warm subject stand out clearly against a cooler background.",
        sampleTitle: "Contrast that directs attention",
        sampleDescription: "Use one colour as the main atmosphere and its opposite as a smaller focal accent.",
      },
      analogous: {
        name: "Analogous",
        colours: ["#245995", "#4A89B8", "#76B5C5"],
        surface: "#EDF7F9",
        tertiaryText: "#0B1F3A",
        description: "Neighbouring blues create a calm, connected palette that works well for landscapes, interiors and reflective scenes.",
        sampleTitle: "A calm family of colours",
        sampleDescription: "Let related hues fill most of the frame, then use brightness to separate the subject.",
      },
      monochromatic: {
        name: "Monochromatic",
        colours: ["#76539B", "#9F84BD", "#D4C4E8"],
        surface: "#F2ECF8",
        tertiaryText: "#0B1F3A",
        description: "Variations of one purple hue create a focused visual identity. Changes in brightness keep the subject separate while the palette stays calm and cohesive.",
        sampleTitle: "Focused shades of purple",
        sampleDescription: "Use light and dark versions of one hue to simplify the frame while preserving depth.",
      },
      triadic: {
        name: "Triadic",
        colours: ["#C83A2D", "#F0B82F", "#245995"],
        surface: "#FFF6E3",
        tertiaryText: "#FFFFFF",
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
      harmonySection.style.setProperty("--harmony-tertiary-text", selectedPalette.tertiaryText);
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
      sampleImage.alt = `Desk lamp against an interior wall tinted to demonstrate a ${selectedPalette.name.toLowerCase()} colour harmony`;

      colourValues.forEach((colourValue, index) => {
        colourValue.textContent = selectedPalette.colours[index];
      });
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
      const cardLayout = document.createElement("div");
      const datePanel = document.createElement("div");
      const dateIcon = document.createElement("i");
      const dateDay = document.createElement("span");
      const dateMonth = document.createElement("span");
      const dateYear = document.createElement("span");
      const cardBody = document.createElement("div");
      const typeBadge = document.createElement("span");
      const typeIcon = document.createElement("i");
      const typeText = document.createElement("span");
      const title = document.createElement("h3");
      const metaList = document.createElement("ul");
      const timeItem = document.createElement("li");
      const locationItem = document.createElement("li");
      const description = document.createElement("p");
      const detailsButton = document.createElement("button");
      const detailsIcon = document.createElement("i");
      const parsedEventDate = parseLocalDate(eventItem.date);
      const monthFormatter = new Intl.DateTimeFormat("en-SG", { month: "short" });

      column.className = "col-md-6 col-xl-4";
      card.className = "card event-card card-accent-navy h-100";
      cardLayout.className = "event-card-layout";
      datePanel.className = "event-date-panel";
      dateIcon.className = "bi bi-calendar-event mb-2";
      dateIcon.setAttribute("aria-hidden", "true");
      dateDay.className = "event-date-day";
      dateMonth.className = "event-date-month";
      dateYear.className = "event-date-year";
      cardBody.className = "card-body p-4";
      typeBadge.className = "event-type-badge align-self-start mb-3";
      typeIcon.className = "bi bi-camera me-2";
      typeIcon.setAttribute("aria-hidden", "true");
      title.className = "h4";
      metaList.className = "event-meta mb-3";
      description.className = "mb-4";
      detailsButton.className = "btn btn-outline-primary";
      detailsButton.type = "button";
      detailsIcon.className = "bi bi-arrow-right-circle me-2";
      detailsIcon.setAttribute("aria-hidden", "true");

      dateDay.textContent = String(parsedEventDate.getDate()).padStart(2, "0");
      dateMonth.textContent = monthFormatter.format(parsedEventDate);
      dateYear.textContent = String(parsedEventDate.getFullYear());
      typeText.textContent = eventItem.type;
      title.textContent = eventItem.title;
      description.textContent = eventItem.description;

      function addMetaContent(listItem, iconName, label, value) {
        const icon = document.createElement("i");
        const text = document.createElement("span");
        icon.className = `bi ${iconName}`;
        icon.setAttribute("aria-hidden", "true");
        text.textContent = `${label}: ${value}`;
        listItem.append(icon, text);
      }

      addMetaContent(timeItem, "bi-clock", "Time", eventItem.time);
      addMetaContent(locationItem, "bi-geo-alt", "Location", eventItem.location);
      detailsButton.addEventListener("click", () => openEventModal(eventItem));

      datePanel.append(dateIcon, dateDay, dateMonth, dateYear);
      typeBadge.append(typeIcon, typeText);
      detailsButton.append(detailsIcon, document.createTextNode("View Details"));
      metaList.append(timeItem, locationItem);
      cardBody.append(typeBadge, title, metaList, description, detailsButton);
      cardLayout.append(datePanel, cardBody);
      card.append(cardLayout);
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

  // Add consistent visual labels to existing learning cards without changing their content.
  function initialiseCardVisualSystem() {
    const sections = Array.from(document.querySelectorAll("main section"));
    const findSection = (headingText) => sections.find(
      (section) => section.querySelector("h2")?.textContent.trim() === headingText,
    );

    function decorateCard(card, iconName, accentClass, badgeClass) {
      const heading = card.querySelector("h3");

      if (!heading || heading.parentElement.querySelector(".card-heading-row")) {
        return;
      }

      const headingRow = document.createElement("div");
      const iconBadge = document.createElement("span");
      const icon = document.createElement("i");
      headingRow.className = "card-heading-row";
      iconBadge.className = `icon-badge ${badgeClass}`;
      icon.className = `bi ${iconName}`;
      icon.setAttribute("aria-hidden", "true");
      iconBadge.append(icon);
      heading.before(headingRow);
      headingRow.append(iconBadge, heading);
      card.classList.add("content-card", accentClass, "technique-card");
    }

    const compositionSection = document.getElementById("composition-techniques");
    const compositionIcons = {
      "Rule of thirds": "bi-grid-3x3",
      "Leading lines": "bi-arrow-up-right",
      Framing: "bi-bounding-box",
      Symmetry: "bi-symmetry-vertical",
      "Negative space": "bi-square",
      "Depth and layering": "bi-layers",
      "Patterns and repetition": "bi-grid",
      "Perspective and angle": "bi-eye",
    };

    if (compositionSection) {
      compositionSection.querySelectorAll("article.card").forEach((card) => {
        const title = card.querySelector("h3")?.textContent.trim();
        if (compositionIcons[title]) {
          decorateCard(card, compositionIcons[title], "card-accent-purple", "icon-badge-blue");
        }
      });
    }

    const lightingIcons = {
      "Natural light": ["bi-sun", "lighting-natural", "icon-badge-teal"],
      "Golden hour": ["bi-sunset", "lighting-golden", "icon-badge-orange"],
      "Blue hour": ["bi-moon-stars", "lighting-blue", "icon-badge-blue"],
      "Harsh midday light": ["bi-brightness-high", "lighting-midday", "icon-badge-orange"],
      "Soft light": ["bi-cloud-sun", "lighting-soft", "icon-badge-purple"],
      "Hard light": ["bi-lightning", "lighting-hard", "icon-badge-navy"],
      "Front lighting": ["bi-lightbulb", "lighting-front", "icon-badge-blue"],
      "Side lighting": ["bi-circle-half", "lighting-side", "icon-badge-purple"],
      Backlighting: ["bi-sunrise", "lighting-back", "icon-badge-orange"],
    };

    [findSection("Read the light before you press the shutter"), findSection("Front, side, and backlighting")]
      .filter(Boolean)
      .forEach((section) => {
        section.querySelectorAll(".card").forEach((card) => {
          const title = card.querySelector("h3")?.textContent.trim();
          const settings = lightingIcons[title];
          if (settings) {
            decorateCard(card, settings[0], settings[1], settings[2]);
          }
        });
      });

    const colourBasicsSection = findSection("Describe what you see");
    if (colourBasicsSection) {
      const accents = ["card-accent-purple", "card-accent-blue", "card-accent-teal"];
      colourBasicsSection.querySelectorAll(".card").forEach((card, index) => {
        card.classList.add("content-card", accents[index % accents.length]);
      });
    }

    const practiceSection = document.getElementById("practice-title")?.closest("section");
    if (practiceSection) {
      const accents = ["card-accent-purple", "card-accent-blue", "card-accent-teal", "card-accent-orange", "card-accent-navy"];
      practiceSection.querySelectorAll(".card").forEach((card, index) => {
        card.classList.add("content-card", accents[index % accents.length]);
      });
    }

    const mistakesAccordion = document.getElementById("mistakesAccordion");
    if (mistakesAccordion) {
      mistakesAccordion.classList.add("mistakes-accordion");
      mistakesAccordion.querySelectorAll(".accordion-item").forEach((item, index) => {
        const button = item.querySelector(".accordion-button");
        const body = item.querySelector(".accordion-body");

        if (!button || !body) {
          return;
        }

        const originalTitle = button.textContent.trim();
        const warningIcon = document.createElement("i");
        const titleGroup = document.createElement("span");
        const numberLabel = document.createElement("span");
        const title = document.createElement("span");
        warningIcon.className = "bi bi-exclamation-triangle";
        warningIcon.setAttribute("aria-hidden", "true");
        numberLabel.className = "mistake-number";
        title.className = "mistake-title";
        numberLabel.textContent = `Common mistake ${String(index + 1).padStart(2, "0")}`;
        title.textContent = originalTitle;
        titleGroup.append(numberLabel, title);
        button.replaceChildren(warningIcon, titleGroup);

        const bodyText = body.textContent.trim();
        const sentenceBreak = bodyText.indexOf(".");
        const problemText = sentenceBreak >= 0 ? bodyText.slice(0, sentenceBreak + 1) : bodyText;
        const solutionText = sentenceBreak >= 0 ? bodyText.slice(sentenceBreak + 1).trim() : bodyText;
        const improvementBox = document.createElement("div");
        const improvementHeading = document.createElement("strong");
        const checkIcon = document.createElement("i");
        improvementBox.className = "improvement-box";
        checkIcon.className = "bi bi-check-circle me-2";
        checkIcon.setAttribute("aria-hidden", "true");
        improvementHeading.append(checkIcon, document.createTextNode("How to improve it"));
        improvementBox.append(improvementHeading, document.createTextNode(solutionText));
        body.replaceChildren(document.createTextNode(problemText), improvementBox);
      });
    }
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

  // Provide consistent, accessible feedback for the challenge form across browsers.
  function initialiseChallengeFormValidation() {
    const form = document.getElementById("challenge-form");
    const summary = document.getElementById("form-validation-summary");

    if (!form || !summary) {
      return;
    }

    const groups = [
      { controls: [document.getElementById("name")], errorId: "name-error" },
      { controls: [document.getElementById("email")], errorId: "email-error" },
      { controls: Array.from(form.elements.experience || []), errorId: "experience-error" },
      { controls: [document.getElementById("genre")], errorId: "genre-error" },
      { controls: [document.getElementById("technique")], errorId: "technique-error" },
      { controls: Array.from(form.elements.equipment || []), errorId: "equipment-error" },
      { controls: [document.getElementById("plan")], errorId: "plan-error" },
      { controls: [document.getElementById("consent")], errorId: "consent-error" },
    ];

    if (groups.some((group) => group.controls.length === 0 || group.controls.some((control) => !control))) {
      return;
    }

    let validationAttempted = false;

    function updateCustomConstraints() {
      [form.elements.name, form.elements.plan].forEach((control) => {
        control.setCustomValidity(control.value.trim() === "" ? "This field is required." : "");
      });
    }

    function groupIsValid(group) {
      if (group.controls[0].type === "radio") {
        return group.controls.some((control) => control.checked);
      }

      return group.controls[0].validity.valid;
    }

    function displayValidationState() {
      updateCustomConstraints();
      let firstInvalidControl = null;

      groups.forEach((group) => {
        const isValid = groupIsValid(group);
        const error = document.getElementById(group.errorId);

        group.controls.forEach((control) => {
          control.classList.toggle("is-invalid", !isValid);
          control.setAttribute("aria-invalid", String(!isValid));
        });

        if (error) {
          error.hidden = isValid;
        }

        if (!isValid && !firstInvalidControl) {
          firstInvalidControl = group.controls[0];
        }
      });

      summary.hidden = firstInvalidControl === null;
      return firstInvalidControl;
    }

    form.addEventListener("submit", (event) => {
      validationAttempted = true;
      const firstInvalidControl = displayValidationState();

      if (firstInvalidControl) {
        event.preventDefault();
        event.stopPropagation();
        firstInvalidControl.focus();
      }
    });

    form.addEventListener("input", () => {
      if (validationAttempted) {
        displayValidationState();
      }
    });

    form.addEventListener("change", () => {
      if (validationAttempted) {
        displayValidationState();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initialisePhotographyTips();
    initialiseColourHarmonyPreview();
    initialisePhotographyEvents();
    initialiseGalleryFilters();
    initialiseCardVisualSystem();
    initialiseImageReveals();
    initialiseChallengeFormValidation();
  });
})();
