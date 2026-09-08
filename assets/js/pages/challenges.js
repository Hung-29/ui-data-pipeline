(function () {
  "use strict";

  var state = {
    search: "",
    domain: "",
    species: "",
    status: "",
    datasetId: ""
  };

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function getElements() {
    return {
      form: document.getElementById("challenge-filters"),
      search: document.getElementById("challenge-search"),
      domain: document.getElementById("domain-filter"),
      species: document.getElementById("species-filter"),
      status: document.getElementById("status-filter"),
      clear: document.getElementById("clear-filters"),
      emptyClear: document.getElementById("empty-clear-filters"),
      results: document.getElementById("challenge-results"),
      empty: document.getElementById("challenge-empty-state"),
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

  function findById(collection, id) {
    if (window.ANIOT && typeof window.ANIOT.findById === "function") {
      return window.ANIOT.findById(collection, id);
    }

    return (collection || []).find(function (item) {
      return item.id === id;
    }) || null;
  }

  function getOrganizationName(id) {
    if (window.ANIOT && typeof window.ANIOT.getOrganizationName === "function") {
      return window.ANIOT.getOrganizationName(id);
    }

    return "Không xác định";
  }

  function getRelatedDataset(challenge) {
    return findById(getDemoData().datasets, challenge.datasetId);
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
    var challenges = data.challenges || [];
    var domains = getUniqueValues(challenges.map(function (challenge) {
      return challenge.domain;
    }));
    var species = getUniqueValues(challenges.map(function (challenge) {
      var dataset = getRelatedDataset(challenge);
      return dataset ? dataset.species : "";
    }));
    var statuses = getUniqueValues(challenges.map(function (challenge) {
      return challenge.status;
    }));

    populateSelect(elements.domain, domains);
    populateSelect(elements.species, species);
    populateSelect(elements.status, statuses);
  }

  function applyQueryFilter() {
    var params = new URLSearchParams(window.location.search);
    state.datasetId = params.get("dataset") || "";
  }

  function createSearchText(challenge) {
    var dataset = getRelatedDataset(challenge);
    var organizationName = getOrganizationName(challenge.proposingOrganizationId);
    var parts = [
      challenge.displayName,
      challenge.description,
      organizationName,
      challenge.status,
      challenge.domain,
      dataset ? dataset.displayName : "",
      dataset ? dataset.species : ""
    ];

    return normalizeText(parts.join(" "));
  }

  function challengeMatches(challenge) {
    var dataset = getRelatedDataset(challenge);
    var query = normalizeText(state.search);
    var matchesSearch = !query || createSearchText(challenge).indexOf(query) !== -1;
    var matchesDomain = !state.domain || challenge.domain === state.domain;
    var matchesSpecies = !state.species || (dataset && dataset.species === state.species);
    var matchesStatus = !state.status || challenge.status === state.status;
    var matchesDataset = !state.datasetId || challenge.datasetId === state.datasetId;

    return matchesSearch && matchesDomain && matchesSpecies && matchesStatus && matchesDataset;
  }

  function renderResults(elements) {
    var data = getDemoData();
    var challenges = data.challenges || [];
    var filteredChallenges = challenges.filter(challengeMatches);

    if (!elements.results || !elements.empty) {
      return;
    }

    elements.results.innerHTML = "";
    filteredChallenges.forEach(function (challenge) {
      elements.results.appendChild(createChallengeCard(challenge));
    });

    elements.empty.hidden = filteredChallenges.length !== 0;
    elements.results.hidden = filteredChallenges.length === 0;

    renderCount(elements.count, filteredChallenges.length, challenges.length);
    renderActiveFilters(elements.activeFilters);
  }

  function renderCount(countElement, visibleCount, totalCount) {
    if (!countElement) {
      return;
    }

    countElement.textContent = "Hiển thị " + visibleCount + "/" + totalCount + " bài toán nghiên cứu";
  }

  function renderActiveFilters(container) {
    if (!container) {
      return;
    }

    container.innerHTML = "";

    var filters = [
      { label: "Từ khóa", value: state.search },
      { label: "Miền nghiên cứu", value: state.domain },
      { label: "Phân khúc", value: state.species },
      { label: "Trạng thái", value: state.status }
    ].filter(function (filter) {
      return filter.value;
    });

    if (state.datasetId) {
      var dataset = findById(getDemoData().datasets, state.datasetId);
      filters.unshift({
        label: "Lọc theo bộ dữ liệu",
        value: dataset ? dataset.displayName : "Mã bộ dữ liệu không có trong dữ liệu giả lập",
        isQueryFilter: true
      });
    }

    filters.forEach(function (filter) {
      var chip = document.createElement("span");
      chip.className = "filter-chip" + (filter.isQueryFilter ? " query-chip" : "");
      chip.textContent = filter.label + ": " + filter.value;
      container.appendChild(chip);
    });
  }

  function createChallengeCard(challenge) {
    var dataset = getRelatedDataset(challenge);
    var article = document.createElement("article");
    article.className = "challenge-card aniot-card";

    var header = document.createElement("div");
    header.className = "challenge-card-header";

    var titleWrap = document.createElement("div");
    var title = document.createElement("h3");
    var titleLink = document.createElement("a");
    titleLink.href = "challenge-detail.html?id=" + encodeURIComponent(challenge.id);
    titleLink.textContent = challenge.displayName;
    title.appendChild(titleLink);

    var summary = document.createElement("p");
    summary.className = "challenge-summary";
    summary.textContent = challenge.description || "Bài toán nghiên cứu giả lập dùng để minh họa luồng từ dữ liệu tới tri thức.";

    titleWrap.appendChild(title);
    titleWrap.appendChild(summary);

    var badges = document.createElement("div");
    badges.className = "challenge-badges";
    badges.appendChild(createBadge(getDemoData().prototypeLabels ? getDemoData().prototypeLabels.simulatedData : "Dữ liệu giả lập"));
    badges.appendChild(createBadge(challenge.status));

    header.appendChild(titleWrap);
    header.appendChild(badges);

    var markers = document.createElement("div");
    markers.className = "challenge-markers";
    markers.appendChild(createChallengeMarker(getStatusIconKey(challenge.status), "Trạng thái", challenge.status));
    markers.appendChild(createChallengeMarker(getDomainIconKey(challenge.domain), "Miền nghiên cứu", challenge.domain));

    var metaGrid = document.createElement("div");
    metaGrid.className = "challenge-meta-grid";
    metaGrid.appendChild(createMetaItem("Đơn vị đề xuất", getOrganizationName(challenge.proposingOrganizationId)));
    metaGrid.appendChild(createMetaItem("Miền nghiên cứu", challenge.domain));
    metaGrid.appendChild(createDatasetMetaItem(dataset, challenge.datasetId));
    metaGrid.appendChild(createMetaItem("Nhóm tham gia giả lập", (challenge.simulatedParticipatingTeams || 0) + " nhóm"));

    var footer = document.createElement("div");
    footer.className = "challenge-card-footer";

    var idText = document.createElement("p");
    idText.className = "challenge-id";
    idText.textContent = "Mã bài toán: " + challenge.id;

    var detailLink = document.createElement("a");
    detailLink.className = "btn btn-sm btn-outline-primary";
    detailLink.href = "challenge-detail.html?id=" + encodeURIComponent(challenge.id);
    detailLink.textContent = "Xem chi tiết bài toán";

    footer.appendChild(idText);
    footer.appendChild(detailLink);

    article.appendChild(header);
    article.appendChild(markers);
    article.appendChild(metaGrid);
    article.appendChild(footer);
    return article;
  }

  function createChallengeMarker(iconKey, context, label) {
    var marker = document.createElement("span");
    marker.className = "challenge-marker";
    marker.setAttribute("aria-label", context + ": " + label);

    var icon = document.createElement("span");
    icon.className = "challenge-marker-icon challenge-marker-" + iconKey;
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getChallengeMarkerIcon(iconKey);

    var text = document.createElement("span");
    text.textContent = context + ": " + label;

    marker.appendChild(icon);
    marker.appendChild(text);
    return marker;
  }

  function getStatusIconKey(status) {
    if (status === "Đang mở") {
      return "status-open";
    }
    if (status === "Đang đánh giá") {
      return "status-review";
    }
    if (status === "Đã hoàn thành") {
      return "status-complete";
    }
    return "status-paused";
  }

  function getDomainIconKey(domain) {
    var text = normalizeText(domain);
    if (text.indexOf("moi truong") !== -1 || text.indexOf("nuoc") !== -1) {
      return "domain-environment";
    }
    if (text.indexOf("dinh duong") !== -1 || text.indexOf("fcr") !== -1 || text.indexOf("tang truong") !== -1) {
      return "domain-growth";
    }
    if (text.indexOf("suc khoe") !== -1) {
      return "domain-health";
    }
    return "domain-research";
  }

  function getChallengeMarkerIcon(iconKey) {
    var icons = {
      "status-open": '<svg viewBox="0 0 24 24" focusable="false"><path d="M8 12h8"/><path d="M12 8v8"/><path d="M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"/></svg>',
      "status-review": '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 5h12v14H6z"/><path d="M9 9h6"/><path d="M9 13h3"/><path d="m13 16 1.5 1.5L18 14"/></svg>',
      "status-complete": '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"/><path d="m8.5 12.2 2.1 2.1 4.9-5"/></svg>',
      "status-paused": '<svg viewBox="0 0 24 24" focusable="false"><path d="M8 6v12"/><path d="M16 6v12"/><path d="M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"/></svg>',
      "domain-environment": '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 4v16"/><path d="M6 8c3.5 0 6 2.5 6 6-3.5 0-6-2.5-6-6Z"/><path d="M18 7c-3.5 0-6 2.5-6 6 3.5 0 6-2.5 6-6Z"/></svg>',
      "domain-growth": '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 18h14"/><path d="M7 15v-4"/><path d="M12 15V7"/><path d="M17 15v-2"/><path d="m15 8 2-2 2 2"/></svg>',
      "domain-health": '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 19s-7-4.2-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 4.8-7 9-7 9Z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>',
      "domain-research": '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 18 18 6"/><path d="M7 7h5"/><path d="M12 12h5"/><path d="M7 17h5"/></svg>'
    };

    return icons[iconKey] || icons["domain-research"];
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
    item.className = "challenge-meta-item";

    var labelEl = document.createElement("span");
    labelEl.className = "challenge-meta-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "challenge-meta-value";
    valueEl.textContent = value || "Chưa có dữ liệu";

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function createDatasetMetaItem(dataset, datasetId) {
    var item = document.createElement("div");
    item.className = "challenge-meta-item";

    var labelEl = document.createElement("span");
    labelEl.className = "challenge-meta-label";
    labelEl.textContent = "Bộ dữ liệu liên quan";

    var valueEl = document.createElement("span");
    valueEl.className = "challenge-meta-value";

    if (dataset) {
      var link = document.createElement("a");
      link.href = "dataset-detail.html?id=" + encodeURIComponent(dataset.id);
      link.textContent = dataset.displayName;
      valueEl.appendChild(link);
    } else {
      valueEl.textContent = datasetId || "Chưa có dữ liệu";
    }

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function updateState(elements) {
    state.search = elements.search ? elements.search.value.trim() : "";
    state.domain = elements.domain ? elements.domain.value : "";
    state.species = elements.species ? elements.species.value : "";
    state.status = elements.status ? elements.status.value : "";
  }

  function clearFilters(elements) {
    if (elements.search) {
      elements.search.value = "";
    }
    if (elements.domain) {
      elements.domain.value = "";
    }
    if (elements.species) {
      elements.species.value = "";
    }
    if (elements.status) {
      elements.status.value = "";
    }

    state.datasetId = "";
    updateState(elements);
    renderResults(elements);
  }

  function bindEvents(elements) {
    ["search", "domain", "species", "status"].forEach(function (key) {
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
    applyQueryFilter();
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
