(function () {
  "use strict";

  var currentChallenge = null;

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function getChallengeId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
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

  function createBadge(label) {
    if (window.ANIOT && typeof window.ANIOT.createBadge === "function") {
      return window.ANIOT.createBadge(label, "aniot-badge");
    }

    var badge = document.createElement("span");
    badge.className = "badge aniot-badge";
    badge.textContent = label;
    return badge;
  }

  function showSafeState() {
    var detailView = document.getElementById("challenge-detail-view");
    var safeState = document.getElementById("challenge-not-found");

    if (detailView) {
      detailView.hidden = true;
    }
    if (safeState) {
      safeState.hidden = false;
    }
  }

  function showDetailState() {
    var detailView = document.getElementById("challenge-detail-view");
    var safeState = document.getElementById("challenge-not-found");

    if (safeState) {
      safeState.hidden = true;
    }
    if (detailView) {
      detailView.hidden = false;
    }
  }

  function renderChallenge(challenge) {
    currentChallenge = challenge;
    showDetailState();
    document.title = challenge.displayName + " | Aniot";
    renderHeader(challenge);
    renderChallengeFlow(challenge);
    renderMetadata(challenge);
    renderProblem(challenge);
    renderDatasets(challenge);
    renderEvaluation(challenge);
    renderParticipants(challenge);
    renderLeaderboard(challenge);
    renderKnowledgeLinks(challenge);
    bindInteractions();
  }

  function renderHeader(challenge) {
    var data = getDemoData();
    var badges = document.getElementById("challenge-badges");
    var title = document.getElementById("challenge-title");
    var summary = document.getElementById("challenge-summary");
    var dataset = getChallengeDataset(challenge);
    var datasetLink = document.getElementById("hero-dataset-link");
    var knowledgeLink = document.getElementById("hero-knowledge-link");

    if (badges) {
      badges.innerHTML = "";
      badges.appendChild(createBadge(data.prototypeLabels ? data.prototypeLabels.simulatedData : "Dữ liệu giả lập"));
      badges.appendChild(createBadge(challenge.status));
      badges.appendChild(createBadge(challenge.domain));
    }

    if (title) {
      title.textContent = challenge.displayName;
    }
    if (summary) {
      summary.textContent = challenge.description;
    }
    if (datasetLink && dataset) {
      datasetLink.href = "dataset-detail.html?id=" + encodeURIComponent(dataset.id);
    }
    if (knowledgeLink && hasRelatedKnowledge(challenge)) {
      knowledgeLink.hidden = false;
      knowledgeLink.href = "knowledge.html?challenge=" + encodeURIComponent(challenge.id);
    }
  }

  function renderChallengeFlow(challenge) {
    var container = document.getElementById("challenge-flow-diagram");
    var dataset = getChallengeDataset(challenge);
    var hasKnowledge = hasRelatedKnowledge(challenge);

    if (!container) {
      return;
    }

    container.innerHTML = "";
    [
      {
        icon: "challenge",
        label: "Bài toán",
        value: challenge.status
      },
      {
        icon: "dataset",
        label: "Bộ dữ liệu",
        value: dataset ? dataset.species : "Chưa có dữ liệu",
        href: dataset ? "dataset-detail.html?id=" + encodeURIComponent(dataset.id) : ""
      },
      {
        icon: "team",
        label: "Nhóm nghiên cứu",
        value: (challenge.simulatedParticipatingTeams || 0) + " nhóm giả lập"
      },
      {
        icon: "leaderboard",
        label: "Bảng xếp hạng",
        value: "Điểm số minh họa"
      },
      {
        icon: "knowledge",
        label: "Kho tri thức",
        value: hasKnowledge ? "Có liên kết" : "Chờ kết quả",
        href: hasKnowledge ? "knowledge.html?challenge=" + encodeURIComponent(challenge.id) : ""
      }
    ].forEach(function (item) {
      container.appendChild(createFlowNode(item));
    });
  }

  function createFlowNode(item) {
    var node = document.createElement(item.href ? "a" : "div");
    node.className = "challenge-flow-node";
    if (item.href) {
      node.href = item.href;
    }

    var icon = document.createElement("span");
    icon.className = "challenge-flow-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getFlowIcon(item.icon);

    var text = document.createElement("span");
    text.className = "challenge-flow-text";

    var label = document.createElement("span");
    label.className = "challenge-flow-label";
    label.textContent = item.label;

    var value = document.createElement("span");
    value.className = "challenge-flow-value";
    value.textContent = item.value;

    text.appendChild(label);
    text.appendChild(value);
    node.appendChild(icon);
    node.appendChild(text);
    return node;
  }

  function renderMetadata(challenge) {
    var container = document.getElementById("challenge-metadata");
    var dataset = getChallengeDataset(challenge);

    if (!container) {
      return;
    }

    container.innerHTML = "";
    [
      { label: "Đơn vị đề xuất", value: getOrganizationName(challenge.proposingOrganizationId) },
      { label: "Trạng thái", value: challenge.status },
      { label: "Miền nghiên cứu", value: challenge.domain },
      { label: "Nhóm tham gia giả lập", value: (challenge.simulatedParticipatingTeams || 0) + " nhóm" },
      { label: "Bộ dữ liệu", value: dataset ? dataset.displayName : "Chưa có dữ liệu", href: dataset ? "dataset-detail.html?id=" + encodeURIComponent(dataset.id) : "" },
      { label: "Phân khúc", value: dataset ? dataset.species : "Chưa có dữ liệu" },
      { label: "Chính sách truy cập", value: dataset ? dataset.accessLevel : "Chưa có dữ liệu" },
      { label: "Mã bài toán", value: challenge.id }
    ].forEach(function (item) {
      container.appendChild(createSummaryCard(item));
    });
  }

  function renderProblem(challenge) {
    var description = document.getElementById("problem-description");
    var questions = document.getElementById("research-questions");

    if (description) {
      description.textContent = challenge.description;
    }
    if (!questions) {
      return;
    }

    questions.innerHTML = "";
    var heading = document.createElement("h3");
    heading.textContent = "Câu hỏi nghiên cứu";
    questions.appendChild(heading);

    var list = document.createElement("ol");
    getResearchQuestions(challenge).forEach(function (question) {
      var item = document.createElement("li");
      item.textContent = question;
      list.appendChild(item);
    });
    questions.appendChild(list);
  }

  function renderDatasets(challenge) {
    var container = document.getElementById("challenge-datasets");
    var dataset = getChallengeDataset(challenge);

    if (!container) {
      return;
    }

    container.innerHTML = "";
    if (!dataset) {
      container.appendChild(createInfoCard("Chưa tìm thấy bộ dữ liệu", [
        "Mã bộ dữ liệu liên kết chưa có trong dữ liệu giả lập."
      ]));
      return;
    }

    var card = document.createElement("article");
    card.className = "dataset-used-card";

    var badges = document.createElement("div");
    badges.className = "d-flex flex-wrap gap-2 mb-3";
    badges.appendChild(createBadge(dataset.accessLevel));
    badges.appendChild(createBadge("Chất lượng giả lập " + dataset.simulatedQuality + "/100"));

    var title = document.createElement("h3");
    var link = document.createElement("a");
    link.href = "dataset-detail.html?id=" + encodeURIComponent(dataset.id);
    link.textContent = dataset.displayName;
    title.appendChild(link);

    var copy = document.createElement("p");
    copy.textContent = "Bộ dữ liệu " + dataset.species + " giai đoạn " + dataset.period + " được dùng làm nguồn dữ liệu cho bài toán nghiên cứu này.";

    var meta = document.createElement("p");
    meta.className = "mb-0";
    meta.textContent = "Nhóm dữ liệu: " + (dataset.dataCategories || []).join(", ");

    card.appendChild(badges);
    card.appendChild(title);
    card.appendChild(copy);
    card.appendChild(meta);
    container.appendChild(card);
  }

  function renderEvaluation(challenge) {
    var container = document.getElementById("evaluation-criteria");
    if (!container) {
      return;
    }

    container.innerHTML = "";
    var list = document.createElement("ul");
    getEvaluationCriteria(challenge).forEach(function (criterion) {
      var item = document.createElement("li");
      item.textContent = criterion;
      list.appendChild(item);
    });
    container.appendChild(list);
  }

  function renderParticipants(challenge) {
    var container = document.getElementById("participant-summary");
    if (!container) {
      return;
    }

    container.innerHTML = "";
    container.appendChild(createInfoCard("Cộng đồng nghiên cứu giả lập", [
      (challenge.simulatedParticipatingTeams || 0) + " nhóm tham gia giả lập",
      "Nhà nghiên cứu, sinh viên và chuyên gia có thể phân tích dữ liệu theo chính sách truy cập.",
      "Kết quả gửi lên trong trang này chỉ là mô phỏng để trình diễn quy trình đánh giá."
    ]));
  }

  function renderLeaderboard(challenge) {
    var container = document.getElementById("leaderboard-table");
    if (!container) {
      return;
    }

    var rows = getLeaderboardRows(challenge);
    container.innerHTML = "";
    container.appendChild(createTable(["Hạng", "Nhóm nghiên cứu", "Điểm giả lập", "Chỉ số chính giả lập", "Ghi chú"], rows.map(function (row) {
      return [
        row.rank,
        row.teamName,
        createMetricBar(row.score, getScorePercent(row.score), "Điểm giả lập"),
        createMetricBar(row.metric, getMetricPercent(row.metric), "Chỉ số chính giả lập"),
        row.note
      ];
    })));
  }

  function renderKnowledgeLinks(challenge) {
    var container = document.getElementById("knowledge-links");
    var findings = getRelatedFindings(challenge);
    var models = getRelatedModels(challenge, findings);

    if (!container) {
      return;
    }

    container.innerHTML = "";
    if (findings.length === 0 && models.length === 0) {
      container.appendChild(createInfoCard("Chưa có tri thức liên quan", [
        "Bài toán này chưa có phát hiện hoặc mô hình liên kết trong dữ liệu giả lập."
      ]));
      return;
    }

    var card = document.createElement("div");
    card.className = "knowledge-card";

    var title = document.createElement("h3");
    title.textContent = "Tri thức liên quan trong kho tri thức";

    var list = document.createElement("ul");
    findings.forEach(function (finding) {
      var item = document.createElement("li");
      item.textContent = "Phát hiện: " + finding.displayName + " (" + finding.simulatedConfidence + ")";
      list.appendChild(item);
    });
    models.forEach(function (model) {
      var item = document.createElement("li");
      item.textContent = "Mô hình: " + model.displayName + " - " + model.status;
      list.appendChild(item);
    });

    var link = document.createElement("a");
    link.className = "btn btn-primary mt-3";
    link.href = "knowledge.html?challenge=" + encodeURIComponent(challenge.id);
    link.textContent = "Khám phá tri thức";

    card.appendChild(title);
    card.appendChild(list);
    card.appendChild(link);
    container.appendChild(card);
  }

  function bindInteractions() {
    var form = document.getElementById("join-challenge-form");
    var validateButton = document.getElementById("validate-result-button");

    if (form && !form.dataset.bound) {
      form.dataset.bound = "true";
      form.addEventListener("submit", handleJoinSubmit);
    }

    if (validateButton && !validateButton.dataset.bound) {
      validateButton.dataset.bound = "true";
      validateButton.addEventListener("click", handleValidation);
    }
  }

  function handleJoinSubmit(event) {
    event.preventDefault();
    var teamInput = document.getElementById("team-name");
    var focusInput = document.getElementById("research-focus");
    var status = document.getElementById("join-form-status");
    var teamName = teamInput ? teamInput.value.trim() : "";
    var focus = focusInput ? focusInput.value.trim() : "";

    if (!teamName || !focus) {
      if (status) {
        status.textContent = "Vui lòng nhập tên nhóm nghiên cứu và hướng tiếp cận dự kiến.";
      }
      return;
    }

    if (status) {
      status.textContent = "Đã ghi nhận đăng ký mô phỏng cho " + teamName + ". Dữ liệu không được gửi tới máy chủ.";
    }
  }

  function handleValidation() {
    var status = document.getElementById("validation-status");
    var challengeName = currentChallenge ? currentChallenge.displayName : "bài toán nghiên cứu";

    if (!status) {
      return;
    }

    status.textContent = "Kết quả kiểm tra mô phỏng: cấu trúc kết quả phù hợp với " + challengeName + ", điểm số vẫn là dữ liệu giả lập cần được đánh giá lại bởi chuyên gia.";
  }

  function createSummaryCard(item) {
    var card = document.createElement("div");
    card.className = "summary-card aniot-card";

    var label = document.createElement("span");
    label.className = "summary-label";
    label.textContent = item.label;

    var value = document.createElement("span");
    value.className = "summary-value";

    if (item.href) {
      var link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.value || "Chưa có dữ liệu";
      value.appendChild(link);
    } else {
      value.textContent = item.value || "Chưa có dữ liệu";
    }

    card.appendChild(label);
    card.appendChild(value);
    return card;
  }

  function createInfoCard(title, items) {
    var card = document.createElement("article");
    card.className = "detail-info-card";

    var heading = document.createElement("h3");
    heading.textContent = title;
    card.appendChild(heading);

    var list = document.createElement("ul");
    (items || []).forEach(function (item) {
      var listItem = document.createElement("li");
      listItem.textContent = item;
      list.appendChild(listItem);
    });

    card.appendChild(list);
    return card;
  }

  function createTable(headers, rows) {
    var wrapper = document.createElement("div");
    wrapper.className = "table-responsive";

    var table = document.createElement("table");
    table.className = "table leaderboard-table align-middle";

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    headers.forEach(function (header) {
      var th = document.createElement("th");
      th.scope = "col";
      appendCellContent(th, header);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    var tbody = document.createElement("tbody");
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (cell, index) {
        var td = document.createElement("td");
        if (index === 0) {
          var rank = document.createElement("span");
          rank.className = "rank-pill";
          rank.textContent = cell;
          td.appendChild(rank);
        } else {
          appendCellContent(td, cell);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
  }

  function appendCellContent(cell, content) {
    if (content && content.nodeType) {
      cell.appendChild(content);
      return;
    }

    cell.textContent = content;
  }

  function createMetricBar(label, percent, ariaPrefix) {
    var wrapper = document.createElement("span");
    wrapper.className = "metric-bar-cell";

    var text = document.createElement("span");
    text.className = "metric-bar-label";
    text.textContent = label;

    var track = document.createElement("span");
    track.className = "metric-bar-track";
    track.setAttribute("aria-label", ariaPrefix + ": " + label + ", số liệu minh họa");

    var bar = document.createElement("span");
    bar.style.width = Math.max(8, Math.min(100, percent)) + "%";
    track.appendChild(bar);

    wrapper.appendChild(text);
    wrapper.appendChild(track);
    return wrapper;
  }

  function getScorePercent(score) {
    var match = String(score || "").match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function getMetricPercent(metric) {
    var match = String(metric || "").match(/0,(\d+)/);
    if (!match) {
      return 0;
    }

    var value = parseInt(match[1], 10);
    if (String(metric).indexOf("Sai số") !== -1) {
      return 100 - value;
    }

    return value;
  }

  function getFlowIcon(iconKey) {
    var icons = {
      challenge: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 6h14v10H8l-3 3V6Z"/><path d="M9 10h6"/><path d="M9 13h4"/></svg>',
      dataset: '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 5h12v14H6z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>',
      team: '<svg viewBox="0 0 24 24" focusable="false"><path d="M8 10a4 4 0 1 1 8 0"/><path d="M5 19c1.4-3 4-4.5 7-4.5s5.6 1.5 7 4.5"/></svg>',
      leaderboard: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 18h14"/><path d="M7 15v-4"/><path d="M12 15V7"/><path d="M17 15v-6"/></svg>',
      knowledge: '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 4v16"/><path d="M6 8c3.5 0 6 2.5 6 6-3.5 0-6-2.5-6-6Z"/><path d="M18 7c-3.5 0-6 2.5-6 6 3.5 0 6-2.5 6-6Z"/></svg>'
    };

    return icons[iconKey] || icons.challenge;
  }

  function getChallengeDataset(challenge) {
    return findById(getDemoData().datasets, challenge.datasetId);
  }

  function getResearchQuestions(challenge) {
    if (Array.isArray(challenge.researchQuestions) && challenge.researchQuestions.length > 0) {
      return challenge.researchQuestions;
    }

    return [
      "Những biến dữ liệu nào có liên hệ rõ nhất với vấn đề được nêu?",
      "Có thể xây dựng mô hình hoặc phân tích thử nghiệm đủ ổn định trên dữ liệu giả lập không?",
      "Kết quả có thể giải thích cho đơn vị tài chính - ngân hàng và chuyên gia nghiệp vụ tài chính không?"
    ];
  }

  function getEvaluationCriteria(challenge) {
    if (Array.isArray(challenge.demoEvaluationCriteria) && challenge.demoEvaluationCriteria.length > 0) {
      return challenge.demoEvaluationCriteria.map(function (criterion) {
        return criterion + " (giả lập)";
      });
    }

    return [
      "Độ ổn định của kết quả trên dữ liệu giả lập",
      "Khả năng giải thích cho chuyên gia và đơn vị tài chính - ngân hàng",
      "Mức độ liên kết giữa kết quả, bộ dữ liệu và câu hỏi nghiên cứu"
    ];
  }

  function getRelatedFindings(challenge) {
    return (getDemoData().findings || []).filter(function (finding) {
      return finding.challengeId === challenge.id;
    });
  }

  function getRelatedModels(challenge, findings) {
    var findingIds = (findings || []).map(function (finding) {
      return finding.id;
    });

    return (getDemoData().models || []).filter(function (model) {
      var matchesChallenge = model.challengeId === challenge.id;
      var matchesFinding = (model.findingIds || []).some(function (id) {
        return findingIds.indexOf(id) !== -1;
      });
      return matchesChallenge || matchesFinding;
    });
  }

  function hasRelatedKnowledge(challenge) {
    return getRelatedFindings(challenge).length > 0 || getRelatedModels(challenge, getRelatedFindings(challenge)).length > 0;
  }

  function getLeaderboardRows(challenge) {
    var offset = getStableOffset(challenge.id);
    var teams = [
      "Nhóm Dữ liệu Tài chính - Ngân hàng Mở",
      "Nhóm Sinh viên Phân tích Tài chính",
      "Phòng thí nghiệm Vi khí hậu Ứng dụng",
      "Nhóm AI Tài chính Việt",
      "Nhóm Tri thức Tài chính Số"
    ];

    return teams.map(function (teamName, index) {
      var rank = index + 1;
      var score = (86 - index * 3 - offset).toString();
      var metric = getPrimaryMetric(challenge, index, offset);
      return {
        rank: String(rank),
        teamName: teamName,
        score: score + "/100",
        metric: metric,
        note: index === 0 ? "Kết quả giả lập có khả năng giải thích tốt hơn" : "Kết quả minh họa cần kiểm chứng thêm"
      };
    });
  }

  function getPrimaryMetric(challenge, index, offset) {
    if (challenge.id === "toi-uu-fcr-ga-002") {
      return "Sai số FCR giả lập: 0," + (18 + index + offset);
    }
    if (challenge.id === "bat-thuong-bo-sua-004") {
      return "Recall nhóm cần theo dõi giả lập: 0," + (83 - index - offset);
    }
    if (challenge.id === "canh-bhệ thống-oxy-tom-003") {
      return "Recall cảnh báo giả lập: 0," + (84 - index - offset);
    }
    return "F1-score giả lập: 0," + (86 - index - offset);
  }

  function getStableOffset(id) {
    var sum = 0;
    String(id || "").split("").forEach(function (char) {
      sum += char.charCodeAt(0);
    });
    return sum % 3;
  }

  function init() {
    var data = getDemoData();
    var challengeId = getChallengeId();
    var challenge = findById(data.challenges, challengeId);

    if (!challenge) {
      showSafeState();
      return;
    }

    renderChallenge(challenge);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
