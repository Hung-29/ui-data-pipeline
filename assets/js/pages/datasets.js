(function () {
  "use strict";

  var state = {
    search: "",
    species: "",
    category: "",
    accessLevel: ""
  };

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function getElements() {
    return {
      form: document.getElementById("dataset-filters"),
      search: document.getElementById("dataset-search"),
      species: document.getElementById("species-filter"),
      category: document.getElementById("category-filter"),
      access: document.getElementById("access-filter"),
      clear: document.getElementById("clear-filters"),
      emptyClear: document.getElementById("empty-clear-filters"),
      results: document.getElementById("dataset-results"),
      empty: document.getElementById("dataset-empty-state"),
      count: document.getElementById("result-count"),
      activeFilters: document.getElementById("active-filter-list")
    };
  }

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getUniqueValues(values) {
    return values.filter(function (value, index, array) {
      return value && array.indexOf(value) === index;
    }).sort(function (a, b) {
      return a.localeCompare(b, "vi");
    });
  }

  function populateSelect(select, values) {
    if (!select) {
      return;
    }

    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function populateFilters(elements) {
    var data = getDemoData();
    var datasets = data.datasets || [];
    var species = getUniqueValues(datasets.map(function (dataset) {
      return dataset.species;
    }));
    var categories = getUniqueValues(datasets.reduce(function (items, dataset) {
      return items.concat(dataset.dataCategories || []);
    }, []));
    var accessLevels = getUniqueValues(datasets.map(function (dataset) {
      return dataset.accessLevel;
    }));

    populateSelect(elements.species, species);
    populateSelect(elements.category, categories);
    populateSelect(elements.access, accessLevels);
  }

  function getOrganizationName(dataset) {
    if (window.ANIOT && typeof window.ANIOT.getOrganizationName === "function") {
      return window.ANIOT.getOrganizationName(dataset.contributingOrganizationId);
    }

    return "Không xác định";
  }

  function createSearchText(dataset) {
    var organizationName = getOrganizationName(dataset);
    var parts = [
      dataset.displayName,
      organizationName,
      dataset.species,
      dataset.period,
      dataset.illustrativeScale,
      dataset.accessLevel,
      dataset.frequency,
      dataset.note,
      (dataset.dataCategories || []).join(" "),
      (dataset.mainFields || []).map(function (field) {
        return field.label;
      }).join(" ")
    ];

    return normalizeText(parts.join(" "));
  }

  function datasetMatches(dataset) {
    var query = normalizeText(state.search);
    var matchesSearch = !query || createSearchText(dataset).indexOf(query) !== -1;
    var matchesSpecies = !state.species || dataset.species === state.species;
    var matchesCategory = !state.category || (dataset.dataCategories || []).indexOf(state.category) !== -1;
    var matchesAccess = !state.accessLevel || dataset.accessLevel === state.accessLevel;

    return matchesSearch && matchesSpecies && matchesCategory && matchesAccess;
  }

  function renderResults(elements) {
    var data = getDemoData();
    var datasets = data.datasets || [];
    var filteredDatasets = datasets.filter(datasetMatches);

    if (!elements.results || !elements.empty) {
      return;
    }

    elements.results.innerHTML = "";
    filteredDatasets.forEach(function (dataset) {
      elements.results.appendChild(createDatasetCard(dataset));
    });

    elements.empty.hidden = filteredDatasets.length !== 0;
    elements.results.hidden = filteredDatasets.length === 0;

    renderCount(elements.count, filteredDatasets.length, datasets.length);
    renderActiveFilters(elements.activeFilters);
  }

  function renderCount(countElement, visibleCount, totalCount) {
    if (!countElement) {
      return;
    }

    countElement.textContent = "Hiển thị " + visibleCount + "/" + totalCount + " bộ dữ liệu";
  }

  function renderActiveFilters(container) {
    if (!container) {
      return;
    }

    container.innerHTML = "";

    var filters = [
      { label: "Từ khóa", value: state.search },
      { label: "Phân khúc", value: state.species },
      { label: "Nhóm dữ liệu", value: state.category },
      { label: "Chính sách truy cập", value: state.accessLevel }
    ].filter(function (filter) {
      return filter.value;
    });

    filters.forEach(function (filter) {
      var chip = document.createElement("span");
      chip.className = "filter-chip";
      chip.textContent = filter.label + ": " + filter.value;
      container.appendChild(chip);
    });
  }

  function createDatasetCard(dataset) {
    var article = document.createElement("article");
    article.className = "dataset-card aniot-card";

    var header = document.createElement("div");
    header.className = "dataset-card-header";

    var titleWrap = document.createElement("div");
    var title = document.createElement("h3");
    var titleLink = document.createElement("a");
    titleLink.href = "dataset-detail.html?id=" + encodeURIComponent(dataset.id);
    titleLink.textContent = dataset.displayName;
    title.appendChild(titleLink);

    var summary = document.createElement("p");
    summary.className = "dataset-summary";
    summary.textContent = dataset.note || dataset.frequency || "Bộ dữ liệu giả lập dùng để minh họa danh mục dữ liệu tài chính - ngân hàng.";

    titleWrap.appendChild(title);
    titleWrap.appendChild(summary);

    var badges = document.createElement("div");
    badges.className = "dataset-badges";
    badges.appendChild(createBadge(getDemoData().prototypeLabels ? getDemoData().prototypeLabels.simulatedData : "Dữ liệu giả lập"));
    badges.appendChild(createBadge(dataset.accessLevel));

    header.appendChild(titleWrap);
    header.appendChild(badges);

    var visualTags = document.createElement("div");
    visualTags.className = "dataset-visual-tags";
    visualTags.appendChild(createVisualTag(getSpeciesIconKey(dataset.species), dataset.species, "Phân khúc"));
    (dataset.dataCategories || []).slice(0, 3).forEach(function (category) {
      visualTags.appendChild(createVisualTag(getCategoryIconKey(category), category, "Nhóm dữ liệu"));
    });

    var metaGrid = document.createElement("div");
    metaGrid.className = "dataset-meta-grid";
    metaGrid.appendChild(createMetaItem("Phân khúc", dataset.species));
    metaGrid.appendChild(createMetaItem("Đơn vị đóng góp", getOrganizationName(dataset)));
    metaGrid.appendChild(createMetaItem("Giai đoạn", dataset.period));
    metaGrid.appendChild(createMetaItem("Nhóm dữ liệu", (dataset.dataCategories || []).join(", ")));

    var quality = document.createElement("div");
    quality.className = "quality-row";

    var qualityLabel = document.createElement("span");
    qualityLabel.className = "quality-label";
    qualityLabel.textContent = "Chất lượng dữ liệu";

    var meter = document.createElement("div");
    meter.className = "quality-meter";
    meter.setAttribute("aria-label", "Chất lượng dữ liệu giả lập " + dataset.simulatedQuality + " trên 100");

    var bar = document.createElement("span");
    bar.style.width = String(dataset.simulatedQuality || 0) + "%";
    meter.appendChild(bar);

    var score = document.createElement("span");
    score.className = "quality-score";
    score.textContent = (dataset.simulatedQuality || 0) + "/100";

    quality.appendChild(qualityLabel);
    quality.appendChild(meter);
    quality.appendChild(score);

    var footer = document.createElement("div");
    footer.className = "dataset-card-footer";

    var idText = document.createElement("p");
    idText.className = "dataset-id";
    idText.textContent = "Mã bộ dữ liệu: " + dataset.id;

    var detailLink = document.createElement("a");
    detailLink.className = "btn btn-sm btn-outline-primary";
    detailLink.href = "dataset-detail.html?id=" + encodeURIComponent(dataset.id);
    detailLink.textContent = "Xem chi tiết";

    footer.appendChild(idText);
    footer.appendChild(detailLink);

    article.appendChild(header);
    article.appendChild(visualTags);
    article.appendChild(metaGrid);
    article.appendChild(quality);
    article.appendChild(footer);
    return article;
  }

  function createVisualTag(iconKey, label, context) {
    var tag = document.createElement("span");
    tag.className = "dataset-visual-tag";
    tag.setAttribute("aria-label", context + ": " + label);

    var icon = document.createElement("span");
    icon.className = "dataset-visual-icon dataset-visual-icon-" + iconKey;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getVisualIcon(iconKey);

    var text = document.createElement("span");
    text.textContent = label;

    tag.appendChild(icon);
    tag.appendChild(text);
    return tag;
  }

  function getSpeciesIconKey(species) {
    if (species === "Heo") {
      return "pig";
    }
    if (species === "Tôm thẻ chân trắng") {
      return "shrimp";
    }
    if (species === "Bò sữa") {
      return "cow";
    }
    return "bird";
  }

  function getCategoryIconKey(category) {
    var text = normalizeText(category);
    if (text.indexOf("moi truong") !== -1 || text.indexOf("khong khi") !== -1 || text.indexOf("nuoc") !== -1) {
      return "environment";
    }
    if (text.indexOf("suc khoe") !== -1 || text.indexOf("song") !== -1) {
      return "health";
    }
    if (text.indexOf("dinh duong") !== -1 || text.indexOf("thuc an") !== -1 || text.indexOf("fcr") !== -1) {
      return "nutrition";
    }
    if (text.indexOf("tang truong") !== -1 || text.indexOf("san luong") !== -1) {
      return "growth";
    }
    return "dataset";
  }

  function getVisualIcon(iconKey) {
    var icons = {
      pig: '<svg viewBox="0 0 24 24" focusable="false"><path d="M6.5 13.5c0-3 2.4-5.5 5.5-5.5s5.5 2.5 5.5 5.5-2.4 5.5-5.5 5.5-5.5-2.5-5.5-5.5Z"/><path d="M8 9 6.2 6.8 5.4 10"/><path d="m16 9 1.8-2.2.8 3.2"/><path d="M9.5 14.2h5"/><path d="M10 12.4h.1"/><path d="M14 12.4h.1"/></svg>',
      bird: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 14.5c2.7-5.6 8.6-7.6 14-4.2-3.2.5-5.2 2-6.2 4.5"/><path d="M7 15.5c2.2 2.4 5.5 2.7 8.5.8"/><path d="M16.8 9.4 20 8.5"/><path d="M11.5 18.2v2.1"/><path d="M14.2 17.8v2.5"/></svg>',
      shrimp: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 11.5c2.8-4.2 9.8-4.5 13.2-.8 2.2 2.4.7 6.1-2.8 6.7"/><path d="M8.2 10.2c1.6 2.3 1.3 5.4-.9 7.1"/><path d="M11.2 9.2c1.1 2.4.8 5.4-.8 7.4"/><path d="M14.2 9.4c.6 2 .4 4.4-.8 6.2"/><path d="M18.7 10.9 21 9.6"/><path d="M17.8 12.9h.1"/></svg>',
      cow: '<svg viewBox="0 0 24 24" focusable="false"><path d="M6.5 11.2c0-2.5 2.4-4.2 5.5-4.2s5.5 1.7 5.5 4.2v3.1c0 2.3-2.4 4.2-5.5 4.2s-5.5-1.9-5.5-4.2v-3.1Z"/><path d="m7.8 8.2-2.4-2v3.7"/><path d="m16.2 8.2 2.4-2v3.7"/><path d="M10 14.6h4"/><path d="M9.7 11.5h.1"/><path d="M14.2 11.5h.1"/></svg>',
      environment: '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 4v16"/><path d="M6 8c3.5 0 6 2.5 6 6-3.5 0-6-2.5-6-6Z"/><path d="M18 7c-3.5 0-6 2.5-6 6 3.5 0 6-2.5 6-6Z"/></svg>',
      health: '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 19s-7-4.2-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 4.8-7 9-7 9Z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>',
      nutrition: '<svg viewBox="0 0 24 24" focusable="false"><path d="M7 4v7"/><path d="M5 4v5c0 1.2.8 2 2 2s2-.8 2-2V4"/><path d="M7 11v9"/><path d="M15 4c2.2 1.5 3.2 4 2.5 7H15v9"/></svg>',
      growth: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 18h14"/><path d="M7 16v-4"/><path d="M12 16V8"/><path d="M17 16V5"/><path d="m15 7 2-2 2 2"/></svg>',
      dataset: '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 6h12v12H6z"/><path d="M9 9h6"/><path d="M9 12h6"/><path d="M9 15h4"/></svg>'
    };

    return icons[iconKey] || icons.dataset;
  }

  function createBadge(label) {
    if (window.ANIOT && typeof window.ANIOT.createBadge === "function") {
      return window.ANIOT.createBadge(label, "aniot-badge");
    }

    var badge = document.createElement("span");
    badge.className = "badge aniot-badge";
    badge.textContent = label;
    return badge;
  }

  function createMetaItem(label, value) {
    var item = document.createElement("div");
    item.className = "dataset-meta-item";

    var labelEl = document.createElement("span");
    labelEl.className = "dataset-meta-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "dataset-meta-value";
    valueEl.textContent = value || "Chưa có dữ liệu";

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function updateState(elements) {
    state.search = elements.search ? elements.search.value.trim() : "";
    state.species = elements.species ? elements.species.value : "";
    state.category = elements.category ? elements.category.value : "";
    state.accessLevel = elements.access ? elements.access.value : "";
  }

  function clearFilters(elements) {
    if (elements.search) {
      elements.search.value = "";
    }
    if (elements.species) {
      elements.species.value = "";
    }
    if (elements.category) {
      elements.category.value = "";
    }
    if (elements.access) {
      elements.access.value = "";
    }

    updateState(elements);
    renderResults(elements);
  }

  function bindEvents(elements) {
    ["search", "species", "category", "access"].forEach(function (key) {
      var element = elements[key];
      if (!element) {
        return;
      }

      element.addEventListener(key === "search" ? "input" : "change", function () {
        updateState(elements);
        renderResults(elements);
      });
    });

    if (elements.clear) {
      elements.clear.addEventListener("click", function () {
        clearFilters(elements);
      });
    }

    if (elements.emptyClear) {
      elements.emptyClear.addEventListener("click", function () {
        clearFilters(elements);
        if (elements.search) {
          elements.search.focus();
        }
      });
    }

    if (elements.form) {
      elements.form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    }
  }

  function init() {
    var elements = getElements();
    populateFilters(elements);
    updateState(elements);
    bindEvents(elements);
    renderResults(elements);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
