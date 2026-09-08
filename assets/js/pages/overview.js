(function () {
  "use strict";

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function renderValueLoop() {
    var data = getDemoData();
    var steps = data.valueLoop || [];
    var tabs = document.getElementById("value-loop-tabs");
    var panel = document.getElementById("value-loop-panel");

    if (!tabs || !panel || steps.length === 0) {
      return;
    }

    function renderPanel(step, index) {
      panel.setAttribute("aria-labelledby", "loop-tab-" + step.id);
      panel.innerHTML = "";

      var badge = document.createElement("span");
      badge.className = "badge aniot-badge mb-3";
      badge.textContent = "Bước " + (index + 1);

      var title = document.createElement("h3");
      title.textContent = step.label;

      var description = document.createElement("p");
      description.textContent = step.description;

      var link = document.createElement("a");
      link.className = "loop-panel-link";
      link.href = getStepHref(step.id);
      link.textContent = getStepLinkLabel(step.id);

      panel.appendChild(badge);
      panel.appendChild(title);
      panel.appendChild(description);
      panel.appendChild(link);
    }

    function selectTab(button, step, index) {
      tabs.querySelectorAll(".loop-tab").forEach(function (tab) {
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
      });

      button.setAttribute("aria-selected", "true");
      button.setAttribute("tabindex", "0");
      renderPanel(step, index);
    }

    steps.forEach(function (step, index) {
      var button = document.createElement("button");
      button.className = "loop-tab";
      button.id = "loop-tab-" + step.id;
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", index === 0 ? "true" : "false");
      button.setAttribute("aria-controls", "value-loop-panel");
      button.setAttribute("tabindex", index === 0 ? "0" : "-1");

      var number = document.createElement("span");
      number.className = "loop-number";
      number.textContent = String(index + 1);

      var label = document.createElement("span");
      label.textContent = step.shortLabel;

      button.appendChild(number);
      button.appendChild(label);

      button.addEventListener("click", function () {
        selectTab(button, step, index);
      });

      button.addEventListener("keydown", function (event) {
        var buttons = Array.prototype.slice.call(tabs.querySelectorAll(".loop-tab"));
        var currentIndex = buttons.indexOf(button);
        var nextIndex = currentIndex;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % buttons.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = buttons.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        buttons[nextIndex].focus();
        selectTab(buttons[nextIndex], steps[nextIndex], nextIndex);
      });

      tabs.appendChild(button);
    });

    renderPanel(steps[0], 0);
  }

  function getStepHref(stepId) {
    var hrefs = {
      "farms-businesses": "contribute.html",
      data: "datasets.html",
      research: "challenges.html",
      knowledge: "knowledge.html",
      solution: "knowledge.html"
    };

    return hrefs[stepId] || "index.html";
  }

  function getStepLinkLabel(stepId) {
    var labels = {
      "farms-businesses": "Tìm hiểu cách đóng góp",
      data: "Khám phá dữ liệu",
      research: "Xem bài toán nghiên cứu",
      knowledge: "Khám phá tri thức",
      solution: "Khám phá tri thức"
    };

    return labels[stepId] || "Xem thêm";
  }

  function renderParticipants() {
    var data = getDemoData();
    var grid = document.getElementById("participant-grid");
    var groups = data.participantGroups || [];

    if (!grid || groups.length === 0) {
      return;
    }

    groups.forEach(function (group) {
      var col = document.createElement("div");
      col.className = "col-md-6 col-xl";

      var card = document.createElement("article");
      card.className = "aniot-card participant-card";

      var icon = createParticipantIcon(group.id);

      var title = document.createElement("h3");
      title.textContent = group.displayName;

      var description = document.createElement("p");
      description.textContent = group.description;

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(description);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function renderDatasetValue() {
    var data = getDemoData();
    var container = document.getElementById("dataset-value-card");
    var dataset = (data.datasets || []).find(function (item) {
      return item.id === "giao-dich-the-2024-2025";
    });

    if (!container || !dataset || !window.ANIOT) {
      return;
    }

    var challenge = window.ANIOT.findById(data.challenges, "du-bhệ thống-stress-nhiet-001");
    var finding = window.ANIOT.findById(data.findings, "phat-hien-nhiet-am-001");
    var model = window.ANIOT.findById(data.models, "mo-hinh-stress-nhiet-v1");
    var organizationName = window.ANIOT.getOrganizationName(dataset.contributingOrganizationId);

    container.innerHTML = "";

    var badges = document.createElement("div");
    badges.className = "d-flex flex-wrap gap-2 mb-3";
    badges.appendChild(window.ANIOT.createBadge("Dữ liệu giả lập", "aniot-badge"));
    badges.appendChild(window.ANIOT.createBadge(dataset.accessLevel, "aniot-badge"));

    var title = document.createElement("h3");
    title.textContent = dataset.displayName;

    var summary = document.createElement("p");
    summary.className = "text-secondary mb-3";
    summary.textContent = "Bộ dữ liệu này minh họa cách một nguồn dữ liệu từ " + organizationName + " có thể dẫn tới bài toán nghiên cứu, phát hiện và mô hình thử nghiệm.";

    var metadata = document.createElement("div");
    metadata.className = "metadata-list mb-3";
    metadata.appendChild(createMetadataItem("Quy mô minh họa", dataset.illustrativeScale));
    metadata.appendChild(createMetadataItem("Chất lượng dữ liệu", dataset.simulatedQuality + "/100"));

    var quality = document.createElement("div");
    quality.className = "quality-meter mb-3";
    quality.setAttribute("aria-label", "Chất lượng dữ liệu giả lập " + dataset.simulatedQuality + " trên 100");

    var qualityBar = document.createElement("span");
    qualityBar.style.width = dataset.simulatedQuality + "%";
    quality.appendChild(qualityBar);

    var lineage = document.createElement("div");
    lineage.className = "dataset-lineage-visual";
    lineage.setAttribute("aria-label", "Bộ dữ liệu liên kết tới bài toán nghiên cứu, phát hiện, mô hình và tri thức");

    var root = createLineageItem("Bộ dữ liệu", dataset.displayName, "dataset-lineage-root");
    var branches = document.createElement("div");
    branches.className = "dataset-lineage-branches";
    branches.appendChild(createLineageItem("Bài toán", challenge ? challenge.displayName : "Chưa có bài toán liên quan"));
    branches.appendChild(createLineageItem("Phát hiện", finding ? finding.displayName : "Chưa có phát hiện liên quan"));
    branches.appendChild(createLineageItem("Mô hình", model ? model.displayName : "Chưa có mô hình liên quan"));
    branches.appendChild(createLineageItem("Tri thức", "Quan hệ tri thức có thể truy vết về dữ liệu nguồn"));
    lineage.appendChild(root);
    lineage.appendChild(branches);

    var chain = document.createElement("div");
    chain.className = "value-chain";
    chain.appendChild(createChainItem("Bài toán nghiên cứu", challenge ? challenge.displayName : "Chưa có bài toán liên quan"));
    chain.appendChild(createChainItem("Phát hiện", finding ? finding.displayName : "Chưa có phát hiện liên quan"));
    chain.appendChild(createChainItem("Mô hình", model ? model.displayName : "Chưa có mô hình liên quan"));
    chain.appendChild(createChainItem("Giá trị ứng dụng", "Cảnh báo thử nghiệm và hướng tối ưu hóa vận hành cần được kiểm chứng thêm"));

    var actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2 mt-4";

    var datasetLink = document.createElement("a");
    datasetLink.className = "btn btn-sm btn-outline-primary";
    datasetLink.href = "dataset-detail.html?id=" + encodeURIComponent(dataset.id);
    datasetLink.textContent = "Xem bộ dữ liệu";

    var challengeLink = document.createElement("a");
    challengeLink.className = "btn btn-sm btn-outline-primary";
    challengeLink.href = challenge ? "challenge-detail.html?id=" + encodeURIComponent(challenge.id) : "challenges.html";
    challengeLink.textContent = "Xem bài toán liên quan";

    actions.appendChild(datasetLink);
    actions.appendChild(challengeLink);

    var notice = document.createElement("p");
    notice.className = "small text-secondary mt-3 mb-0";
    notice.textContent = "Số liệu minh họa, không phải kết quả nghiên cứu thực tế.";

    container.appendChild(badges);
    container.appendChild(title);
    container.appendChild(summary);
    container.appendChild(metadata);
    container.appendChild(quality);
    container.appendChild(lineage);
    container.appendChild(chain);
    container.appendChild(actions);
    container.appendChild(notice);
  }

  function createParticipantIcon(groupId) {
    var icons = {
      "businesses-farms": '<path d="M4 20V9l8-5 8 5v11"></path><path d="M8 20v-7h8v7"></path><path d="M3 20h18"></path>',
      researchers: '<path d="M10 4v5l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V4"></path><path d="M8 4h8"></path><path d="M8 15h8"></path>',
      students: '<path d="M4 7l8-4 8 4-8 4-8-4Z"></path><path d="M7 10v5c1.2 1 2.9 1.5 5 1.5s3.8-.5 5-1.5v-5"></path><path d="M20 8v6"></path>',
      experts: '<path d="M12 4a4 4 0 0 1 4 4c0 2.5-4 7-4 7s-4-4.5-4-7a4 4 0 0 1 4-4Z"></path><path d="M9 20h6"></path><path d="M12 15v5"></path>',
      aniot: '<path d="M12 4v16"></path><path d="M5 8c3 0 5 1.5 7 4 2-2.5 4-4 7-4"></path><path d="M5 16c3 0 5-1.5 7-4 2 2.5 4 4 7 4"></path>'
    };

    var wrapper = document.createElement("span");
    wrapper.className = "participant-icon";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML = '<svg viewBox="0 0 24 24" focusable="false">' + (icons[groupId] || icons.aniot) + "</svg>";
    return wrapper;
  }

  function createMetadataItem(label, value) {
    var item = document.createElement("div");
    item.className = "metadata-item";

    var labelEl = document.createElement("span");
    labelEl.className = "metadata-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "metadata-value";
    valueEl.textContent = value;

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function createChainItem(label, value) {
    var item = document.createElement("div");
    item.className = "value-chain-item";

    var labelEl = document.createElement("span");
    labelEl.className = "value-chain-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "value-chain-value";
    valueEl.textContent = value;

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function createLineageItem(label, value, extraClass) {
    var item = document.createElement("div");
    item.className = "dataset-lineage-item" + (extraClass ? " " + extraClass : "");

    var labelEl = document.createElement("span");
    labelEl.className = "dataset-lineage-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "dataset-lineage-value";
    valueEl.textContent = value;

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function init() {
    renderValueLoop();
    renderParticipants();
    renderDatasetValue();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
