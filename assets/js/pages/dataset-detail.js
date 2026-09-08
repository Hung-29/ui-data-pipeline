(function () {
  "use strict";

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function getDatasetId() {
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
    var detailView = document.getElementById("dataset-detail-view");
    var safeState = document.getElementById("dataset-not-found");

    if (detailView) {
      detailView.hidden = true;
    }
    if (safeState) {
      safeState.hidden = false;
    }
  }

  function showDetailState() {
    var detailView = document.getElementById("dataset-detail-view");
    var safeState = document.getElementById("dataset-not-found");

    if (safeState) {
      safeState.hidden = true;
    }
    if (detailView) {
      detailView.hidden = false;
    }
  }

  function renderDataset(dataset) {
    showDetailState();
    document.title = dataset.displayName + " | Aniot";
    renderHeader(dataset);
    renderMetadata(dataset);
    renderOverview(dataset);
    renderDictionary(dataset);
    renderSampleData(dataset);
    renderQuality(dataset);
    renderVersions(dataset);
    renderLineage(dataset);
    renderRelatedResearch(dataset);
    renderAccessPolicy(dataset);
  }

  function renderHeader(dataset) {
    var data = getDemoData();
    var badges = document.getElementById("dataset-badges");
    var title = document.getElementById("dataset-title");
    var summary = document.getElementById("dataset-summary");

    if (badges) {
      badges.innerHTML = "";
      badges.appendChild(createBadge(data.prototypeLabels ? data.prototypeLabels.simulatedData : "Dữ liệu giả lập"));
      badges.appendChild(createBadge(dataset.accessLevel));
      badges.appendChild(createBadge("Phiên bản " + dataset.version));
    }

    if (title) {
      title.textContent = dataset.displayName;
    }

    if (summary) {
      summary.textContent = dataset.note || "Bộ dữ liệu giả lập được quản trị bằng siêu dữ liệu, cấu trúc trường, chất lượng dữ liệu, phiên bản và quan hệ nghiên cứu.";
    }
  }

  function renderMetadata(dataset) {
    var container = document.getElementById("dataset-metadata");
    if (!container) {
      return;
    }

    container.innerHTML = "";
    [
      { label: "Đơn vị đóng góp dữ liệu", value: getOrganizationName(dataset.contributingOrganizationId) },
      { label: "Phân khúc", value: dataset.species },
      { label: "Giai đoạn", value: dataset.period },
      { label: "Chính sách truy cập", value: dataset.accessLevel },
      { label: "Phiên bản", value: dataset.version },
      { label: "Quy mô minh họa", value: dataset.illustrativeScale },
      { label: "Nhóm dữ liệu", value: (dataset.dataCategories || []).join(", ") },
      { label: "Mã bộ dữ liệu", value: dataset.id }
    ].forEach(function (item) {
      var card = document.createElement("div");
      card.className = "summary-card aniot-card";

      var label = document.createElement("span");
      label.className = "summary-label";
      label.textContent = item.label;

      var value = document.createElement("span");
      value.className = "summary-value";
      value.textContent = item.value || "Chưa có dữ liệu";

      card.appendChild(label);
      card.appendChild(value);
      container.appendChild(card);
    });
  }

  function renderOverview(dataset) {
    var panel = document.getElementById("overview-panel");
    if (!panel) {
      return;
    }

    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Tổng quan bộ dữ liệu", "Bộ dữ liệu trên Aniot được mô tả như một tài sản dữ liệu có nguồn gốc, cấu trúc, chất lượng, phiên bản và quan hệ nghiên cứu rõ ràng."));

    var grid = document.createElement("div");
    grid.className = "detail-grid";
    grid.appendChild(createInfoCard("Phạm vi dữ liệu", [
      "Phân khúc: " + dataset.species,
      "Giai đoạn: " + dataset.period,
      "Quy mô minh họa: " + dataset.illustrativeScale
    ]));
    grid.appendChild(createInfoCard("Nhóm dữ liệu", dataset.dataCategories || []));
    grid.appendChild(createInfoCard("Tần suất / mô tả thu thập", [
      dataset.frequency || "Tần suất thu thập được mô phỏng theo từng bộ dữ liệu trong nguyên mẫu trình diễn."
    ]));
    grid.appendChild(createInfoCard("Vai trò trong vòng tri thức", [
      "Bộ dữ liệu này có thể được dùng để tạo bài toán nghiên cứu, phát hiện, mô hình và tri thức liên quan."
    ]));

    panel.appendChild(grid);
  }

  function renderDictionary(dataset) {
    var panel = document.getElementById("dictionary-panel");
    if (!panel) {
      return;
    }

    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Từ điển dữ liệu", "Các trường dưới đây được lấy từ cấu trúc dữ liệu giả lập dùng chung. Kiểu dữ liệu và ghi chú là phần mô phỏng để minh họa cách Aniot quản trị siêu dữ liệu."));

    var table = createTable(["Tên trường", "Nhãn hiển thị", "Kiểu dữ liệu minh họa", "Ghi chú quản trị"], (dataset.mainFields || []).map(function (field) {
      var fieldType = inferFieldType(field.name, field.label);
      return [
        createFieldCell(field.name, fieldType),
        field.label,
        createFieldCell(fieldType, fieldType),
        inferFieldNote(field.name, field.label)
      ];
    }));

    panel.appendChild(table);
  }

  function renderSampleData(dataset) {
    var panel = document.getElementById("sample-panel");
    if (!panel) {
      return;
    }

    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Dữ liệu mẫu", "Các bản ghi dưới đây chỉ minh họa hình dạng dữ liệu, không phải bản ghi thật từ tổ chức tài chính, doanh nghiệp hoặc nghiên cứu."));

    var fields = dataset.mainFields || [];
    var rows = [0, 1, 2].map(function (rowIndex) {
      return fields.map(function (field) {
        return getSampleValue(dataset, field, rowIndex);
      });
    });

    panel.appendChild(createTable(fields.map(function (field) {
      return createFieldCell(field.label, inferFieldType(field.name, field.label));
    }), rows));

    var notice = document.createElement("p");
    notice.className = "notice-text mt-3 mb-0";
    notice.textContent = "Dữ liệu mẫu được tạo để kiểm tra giao diện và minh họa quy ước trường dữ liệu; không dùng như bằng chứng khoa học.";
    panel.appendChild(notice);
  }

  function renderQuality(dataset) {
    var panel = document.getElementById("quality-panel");
    if (!panel) {
      return;
    }

    var score = dataset.simulatedQuality || 0;
    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Chất lượng dữ liệu", "Điểm chất lượng là số liệu minh họa để trình diễn cách Aniot có thể theo dõi tính đầy đủ, nhất quán và khả năng dùng cho nghiên cứu."));

    var summary = document.createElement("div");
    summary.className = "quality-summary";

    var scoreBlock = document.createElement("div");
    scoreBlock.className = "quality-score-block";

    var scoreNumber = document.createElement("span");
    scoreNumber.className = "quality-score-number";
    scoreNumber.textContent = score + "/100";

    var scoreLabel = document.createElement("span");
    scoreLabel.textContent = "Điểm chất lượng giả lập";

    scoreBlock.appendChild(scoreNumber);
    scoreBlock.appendChild(scoreLabel);

    var meter = document.createElement("div");
    meter.className = "quality-meter";
    meter.setAttribute("aria-label", "Chất lượng dữ liệu giả lập " + score + " trên 100");
    var bar = document.createElement("span");
    bar.style.width = score + "%";
    meter.appendChild(bar);

    summary.appendChild(scoreBlock);
    summary.appendChild(meter);
    panel.appendChild(summary);

    var checks = [
      "Kiểm tra thiếu dữ liệu ở các trường chính",
      "Đối chiếu đơn vị đo và miền giá trị hợp lý",
      "Theo dõi trường ẩn danh để giảm rủi ro định danh",
      "Tách phiên bản nghiên cứu khỏi dữ liệu thô"
    ];
    panel.appendChild(createInfoCard("Các kiểm tra minh họa", checks));
  }

  function renderVersions(dataset) {
    var panel = document.getElementById("versions-panel");
    if (!panel) {
      return;
    }

    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Phiên bản", "Phiên bản giúp người dùng biết bộ dữ liệu nào đang được dùng trong nghiên cứu, mô hình hoặc phát hiện liên quan."));

    var currentVersion = dataset.version || "1.0";
    var rows = [
      [currentVersion, "Đang dùng trong nguyên mẫu trình diễn", "Chuẩn hóa siêu dữ liệu, cập nhật chất lượng dữ liệu và liên kết nghiên cứu."],
      [getPreviousVersion(currentVersion), "Lưu vết", "Phiên bản trước dùng để minh họa lịch sử thay đổi."],
      ["1.0", "Khởi tạo", "Đưa bộ dữ liệu vào danh mục dữ liệu giả lập."]
    ];

    panel.appendChild(createTable(["Phiên bản", "Trạng thái", "Ghi chú"], rows));
  }

  function renderLineage(dataset) {
    var panel = document.getElementById("lineage-panel");
    if (!panel) {
      return;
    }

    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Nguồn gốc và luồng xử lý dữ liệu", "Luồng này minh họa cách dữ liệu từ đơn vị đóng góp được chuẩn hóa, kiểm tra và chuyển thành phiên bản nghiên cứu."));

    var flow = document.createElement("div");
    flow.className = "lineage-flow";

    [
      {
        icon: "raw",
        title: "Dữ liệu thô",
        description: "Dữ liệu ban đầu từ " + getOrganizationName(dataset.contributingOrganizationId) + " trong phạm vi " + dataset.period + "."
      },
      {
        icon: "standard",
        title: "Chuẩn hóa",
        description: "Aniot chuẩn hóa tên trường, đơn vị đo, siêu dữ liệu và cấu trúc danh mục."
      },
      {
        icon: "quality",
        title: "Kiểm tra chất lượng",
        description: "Kiểm tra thiếu dữ liệu, miền giá trị, tính nhất quán và yêu cầu ẩn danh."
      },
      {
        icon: "version",
        title: "Phiên bản nghiên cứu",
        description: "Phát hành phiên bản " + dataset.version + " theo chính sách truy cập: " + dataset.accessLevel + "."
      },
      {
        icon: "model",
        title: "Phân tích / Mô hình",
        description: "Nhà nghiên cứu dùng dữ liệu để tạo phát hiện, bài toán hoặc mô hình thử nghiệm."
      }
    ].forEach(function (step, index) {
      var item = document.createElement("article");
      item.className = "lineage-step";

      var number = document.createElement("span");
      number.className = "lineage-step-number";
      number.textContent = String(index + 1);

      var icon = document.createElement("span");
      icon.className = "lineage-step-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = getLineageIcon(step.icon);

      var title = document.createElement("h3");
      title.textContent = step.title;

      var description = document.createElement("p");
      description.textContent = step.description;

      item.appendChild(number);
      item.appendChild(icon);
      item.appendChild(title);
      item.appendChild(description);
      flow.appendChild(item);
    });

    panel.appendChild(flow);
  }

  function renderRelatedResearch(dataset) {
    var data = getDemoData();
    var panel = document.getElementById("research-panel");
    if (!panel) {
      return;
    }

    var challenges = (data.challenges || []).filter(function (challenge) {
      return challenge.datasetId === dataset.id;
    });

    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Nghiên cứu liên quan", "Các bài toán nghiên cứu được lấy từ dữ liệu giả lập dùng chung và chỉ hiển thị khi liên kết trực tiếp tới bộ dữ liệu hiện tại."));

    if (challenges.length === 0) {
      panel.appendChild(createInfoCard("Chưa có bài toán nghiên cứu liên quan", [
        "Bộ dữ liệu này hiện chưa có bài toán nghiên cứu được liên kết trong nguyên mẫu trình diễn."
      ]));
    } else {
      var grid = document.createElement("div");
      grid.className = "detail-grid";
      challenges.forEach(function (challenge) {
        var card = document.createElement("article");
        card.className = "related-card";

        var title = document.createElement("h3");
        title.textContent = challenge.displayName;

        var description = document.createElement("p");
        description.textContent = challenge.description;

        var meta = document.createElement("p");
        meta.className = "notice-text";
        meta.textContent = challenge.domain + " · " + challenge.status + " · " + challenge.simulatedParticipatingTeams + " nhóm tham gia giả lập";

        var link = document.createElement("a");
        link.className = "btn btn-sm btn-outline-primary";
        link.href = "challenge-detail.html?id=" + encodeURIComponent(challenge.id);
        link.textContent = "Xem bài toán liên quan";

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(meta);
        card.appendChild(link);
        grid.appendChild(card);
      });
      panel.appendChild(grid);
    }

    var knowledgeLink = document.createElement("a");
    knowledgeLink.className = "btn btn-primary mt-3";
    knowledgeLink.href = "knowledge.html?dataset=" + encodeURIComponent(dataset.id);
    knowledgeLink.textContent = "Xem tri thức liên quan";
    panel.appendChild(knowledgeLink);
  }

  function renderAccessPolicy(dataset) {
    var data = getDemoData();
    var panel = document.getElementById("access-panel");
    if (!panel) {
      return;
    }

    var policy = null;
    if (window.ANIOT && typeof window.ANIOT.getAccessPolicyByName === "function") {
      policy = window.ANIOT.getAccessPolicyByName(dataset.accessLevel);
    }
    if (!policy) {
      policy = (data.accessPolicies || []).find(function (item) {
        return item.displayName === dataset.accessLevel;
      }) || null;
    }

    panel.innerHTML = "";
    panel.appendChild(createSectionHeading("Chính sách truy cập", "Chính sách truy cập cho biết người dùng có thể xem siêu dữ liệu, dữ liệu mẫu hoặc yêu cầu quyền nghiên cứu theo điều kiện nào."));

    if (!policy) {
      panel.appendChild(createInfoCard(dataset.accessLevel || "Chưa xác định", [
        "Chưa có mô tả chính sách truy cập trong dữ liệu giả lập."
      ]));
      return;
    }

    var card = document.createElement("div");
    card.className = "detail-info-card";

    var badgeWrap = document.createElement("div");
    badgeWrap.className = "d-flex flex-wrap gap-2 mb-3";
    badgeWrap.appendChild(createBadge(policy.badgeLabel || policy.displayName));

    var title = document.createElement("h3");
    title.textContent = policy.displayName;

    var description = document.createElement("p");
    description.textContent = policy.description;

    var notes = document.createElement("ul");
    (policy.notes || []).forEach(function (note) {
      var item = document.createElement("li");
      item.textContent = note;
      notes.appendChild(item);
    });

    card.appendChild(badgeWrap);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(notes);
    panel.appendChild(card);
  }

  function createSectionHeading(title, copy) {
    var fragment = document.createDocumentFragment();
    var heading = document.createElement("h2");
    heading.className = "tab-section-title";
    heading.textContent = title;

    var description = document.createElement("p");
    description.className = "tab-section-copy";
    description.textContent = copy;

    fragment.appendChild(heading);
    fragment.appendChild(description);
    return fragment;
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
    table.className = "table detail-table align-middle";

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
      row.forEach(function (cell) {
        var td = document.createElement("td");
        appendCellContent(td, cell);
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

  function createFieldCell(text, fieldType) {
    var wrapper = document.createElement("span");
    wrapper.className = "field-marker-cell";

    var marker = document.createElement("span");
    marker.className = "field-marker " + getFieldMarkerClass(fieldType);
    marker.textContent = getFieldMarkerLabel(fieldType);

    var value = document.createElement("span");
    value.textContent = text;

    wrapper.appendChild(marker);
    wrapper.appendChild(value);
    return wrapper;
  }

  function getFieldMarkerClass(fieldType) {
    if (fieldType === "Thời gian") {
      return "field-marker-time";
    }
    if (fieldType === "Mã ẩn danh") {
      return "field-marker-id";
    }
    if (fieldType === "Nhãn phân loại") {
      return "field-marker-label";
    }
    if (fieldType === "Chỉ số môi trường") {
      return "field-marker-environment";
    }
    return "field-marker-measure";
  }

  function getFieldMarkerLabel(fieldType) {
    if (fieldType === "Thời gian") {
      return "TG";
    }
    if (fieldType === "Mã ẩn danh") {
      return "ID";
    }
    if (fieldType === "Nhãn phân loại") {
      return "Nhãn";
    }
    if (fieldType === "Chỉ số môi trường") {
      return "MT";
    }
    return "Đo";
  }

  function getLineageIcon(iconKey) {
    var icons = {
      raw: '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 5h12v14H6z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>',
      standard: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 7h14"/><path d="M8 12h8"/><path d="M10 17h4"/><path d="m16 5 3 2-3 2"/></svg>',
      quality: '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 4 19 7v5c0 4.2-2.8 6.8-7 8-4.2-1.2-7-3.8-7-8V7l7-3Z"/><path d="m8.8 12 2.1 2.1 4.4-4.6"/></svg>',
      version: '<svg viewBox="0 0 24 24" focusable="false"><path d="M7 7h10v10H7z"/><path d="M4 11h3"/><path d="M17 11h3"/><path d="M12 4v3"/><path d="M12 17v3"/></svg>',
      model: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 17h14"/><path d="M7 14v-4"/><path d="M12 14V7"/><path d="M17 14v-2"/><path d="M6 6h4"/><path d="M14 6h4"/></svg>'
    };

    return icons[iconKey] || icons.raw;
  }

  function inferFieldType(name, label) {
    var fieldText = (name + " " + label).toLowerCase();
    if (fieldText.indexOf("timestamp") !== -1 || fieldText.indexOf("ngay") !== -1 || fieldText.indexOf("thời điểm") !== -1) {
      return "Thời gian";
    }
    if (fieldText.indexOf("_id") !== -1 || fieldText.indexOf("mã") !== -1) {
      return "Mã ẩn danh";
    }
    if (fieldText.indexOf("ghi_nhan") !== -1 || fieldText.indexOf("nhãn") !== -1) {
      return "Nhãn phân loại";
    }
    if (
      fieldText.indexOf("nhiet_do") !== -1 ||
      fieldText.indexOf("độ ẩm") !== -1 ||
      fieldText.indexOf("do_am") !== -1 ||
      fieldText.indexOf("co2") !== -1 ||
      fieldText.indexOf("nh3") !== -1 ||
      fieldText.indexOf("pm25") !== -1 ||
      fieldText.indexOf("ph") !== -1 ||
      fieldText.indexOf("oxy_hoa_tan") !== -1 ||
      fieldText.indexOf("do_man") !== -1
    ) {
      return "Chỉ số môi trường";
    }
    return "Số đo";
  }

  function inferFieldNote(name, label) {
    var fieldText = (name + " " + label).toLowerCase();
    if (fieldText.indexOf("_id") !== -1 || fieldText.indexOf("mã") !== -1) {
      return "Cần giữ ẩn danh trong phiên bản nghiên cứu.";
    }
    if (fieldText.indexOf("co2") !== -1 || fieldText.indexOf("nh3") !== -1 || fieldText.indexOf("pm25") !== -1) {
      return "Cần thống nhất đơn vị đo và kiểm tra miền giá trị.";
    }
    if (fieldText.indexOf("fcr") !== -1) {
      return "Chỉ dùng để phân tích khi có đủ bối cảnh phân khúc.";
    }
    return "Trường minh họa trong cấu trúc dữ liệu giả lập.";
  }

  function getSampleValue(dataset, field, rowIndex) {
    var name = field.name;
    var speciesPrefix = getSpeciesPrefix(dataset.species);
    var sequence = rowIndex + 1;

    if (name.indexOf("timestamp") !== -1) {
      return "2025-06-" + padNumber(10 + rowIndex) + " 0" + (8 + rowIndex) + ":00";
    }
    if (name === "ngay") {
      return "2025-06-" + padNumber(10 + rowIndex);
    }
    if (name === "ngay_tuoi") {
      return String(28 + rowIndex);
    }
    if (name.indexOf("_id") !== -1 || name === "bo_id") {
      return speciesPrefix + "-ẩn-danh-" + padNumber(sequence);
    }
    if (name.indexOf("nhiet_do") !== -1) {
      return String(27 + rowIndex).replace(".", ",");
    }
    if (name.indexOf("do_am") !== -1) {
      return String(68 + rowIndex * 2);
    }
    if (name.indexOf("co2") !== -1) {
      return String(820 + rowIndex * 35);
    }
    if (name.indexOf("nh3") !== -1) {
      return name.indexOf("mg_l") !== -1 ? "0," + (12 + rowIndex) : String(9 + rowIndex);
    }
    if (name.indexOf("pm25") !== -1) {
      return String(22 + rowIndex * 3);
    }
    if (name.indexOf("thuc_an") !== -1) {
      return String(145 + rowIndex * 8);
    }
    if (name.indexOf("nuoc") !== -1) {
      return String(320 + rowIndex * 18);
    }
    if (name.indexOf("khoi_luong") !== -1) {
      return name.indexOf("_g") !== -1 ? String(980 + rowIndex * 55) : String(62 + rowIndex * 2);
    }
    if (name.indexOf("chet") !== -1) {
      return String(rowIndex);
    }
    if (name.indexOf("ph") !== -1) {
      return "7," + (4 + rowIndex);
    }
    if (name.indexOf("do_man") !== -1) {
      return String(12 + rowIndex);
    }
    if (name.indexOf("oxy_hoa_tan") !== -1) {
      return "5," + (8 - rowIndex);
    }
    if (name.indexOf("ty_le_song") !== -1) {
      return String(91 - rowIndex) + "%";
    }
    if (name.indexOf("ty_le_chet") !== -1) {
      return "0," + (8 + rowIndex) + "%";
    }
    if (name.indexOf("san_luong_sua") !== -1) {
      return String(22 + rowIndex) + ",5";
    }
    if (name.indexOf("so_buoc") !== -1) {
      return String(4100 + rowIndex * 230);
    }
    if (name.indexOf("ghi_nhan_suc_khoe") !== -1) {
      return rowIndex === 2 ? "Cần theo dõi" : "Bình thường";
    }
    if (name.indexOf("san_luong_trung") !== -1) {
      return String(960 + rowIndex * 24);
    }
    if (name.indexOf("fcr") !== -1) {
      return "1," + (61 + rowIndex);
    }

    return "Giá trị minh họa " + sequence;
  }

  function getSpeciesPrefix(species) {
    if (species === "Heo") {
      return "đơn vị";
    }
    if (species === "Tôm thẻ chân trắng") {
      return "hệ thống";
    }
    if (species === "Bò sữa") {
      return "bò";
    }
    return "khu";
  }

  function padNumber(value) {
    return String(value).padStart(2, "0");
  }

  function getPreviousVersion(version) {
    var parts = String(version || "1.0").split(".");
    var major = parseInt(parts[0], 10) || 1;
    var minor = parseInt(parts[1], 10) || 0;
    if (minor > 0) {
      return major + "." + (minor - 1);
    }
    if (major > 1) {
      return (major - 1) + ".0";
    }
    return "0.9";
  }

  function init() {
    var data = getDemoData();
    var datasetId = getDatasetId();
    var dataset = findById(data.datasets, datasetId);

    if (!dataset) {
      showSafeState();
      return;
    }

    renderDataset(dataset);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
