(function () {
  "use strict";

  var state = {
    datasetId: "",
    challengeId: ""
  };

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function findById(collection, id) {
    if (window.ANIOT && typeof window.ANIOT.findById === "function") {
      return window.ANIOT.findById(collection, id);
    }

    return (collection || []).find(function (item) {
      return item.id === id;
    }) || null;
  }

  function getLabels() {
    var labels = getDemoData().prototypeLabels || {};
    return {
      simulatedData: labels.simulatedData || "Dữ liệu giả lập",
      illustrativeNotice: labels.illustrativeNotice || "Số liệu minh họa, không phải kết quả nghiên cứu thực tế",
      simulatedFinding: "Phát hiện giả lập"
    };
  }

  function createBadge(text, variantClass) {
    if (window.ANIOT && typeof window.ANIOT.createBadge === "function") {
      return window.ANIOT.createBadge(text, variantClass || "aniot-badge");
    }

    var badge = document.createElement("span");
    badge.className = "badge " + (variantClass || "aniot-badge");
    badge.textContent = text;
    return badge;
  }

  function createLink(href, text) {
    var link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    return link;
  }

  function getDataset(id) {
    return findById(getDemoData().datasets, id);
  }

  function getChallenge(id) {
    return findById(getDemoData().challenges, id);
  }

  function getRelatedModelsForFinding(finding) {
    return (getDemoData().models || []).filter(function (model) {
      return (model.findingIds || []).indexOf(finding.id) !== -1;
    });
  }

  function getRelatedModelForRelation(relation) {
    var findingIds = relation.findingIds || [];
    return (getDemoData().models || []).find(function (model) {
      return (model.findingIds || []).some(function (findingId) {
        return findingIds.indexOf(findingId) !== -1;
      });
    }) || null;
  }

  function matchesDataset(datasetIds) {
    return !state.datasetId || (datasetIds || []).indexOf(state.datasetId) !== -1;
  }

  function matchesChallenge(challengeId) {
    return !state.challengeId || challengeId === state.challengeId;
  }

  function getVisibleFindings() {
    return (getDemoData().findings || []).filter(function (finding) {
      return matchesDataset(finding.datasetIds) && matchesChallenge(finding.challengeId);
    });
  }

  function getVisibleRelations() {
    return (getDemoData().knowledgeRelations || []).filter(function (relation) {
      return matchesDataset(relation.datasetIds) && matchesChallenge(relation.challengeId);
    });
  }

  function getVisibleModels(visibleFindings) {
    var findingIds = visibleFindings.map(function (finding) {
      return finding.id;
    });

    return (getDemoData().models || []).filter(function (model) {
      var modelFindingIds = model.findingIds || [];
      return matchesChallenge(model.challengeId) && modelFindingIds.some(function (findingId) {
        return findingIds.indexOf(findingId) !== -1;
      });
    });
  }

  function renderContext() {
    var contextPanel = document.getElementById("context-panel");
    var activeContext = document.getElementById("active-context");
    if (!contextPanel || !activeContext) {
      return;
    }

    contextPanel.innerHTML = "";
    activeContext.innerHTML = "";

    var contextType = "";
    var contextEntity = null;
    if (state.datasetId) {
      contextType = "Bộ dữ liệu";
      contextEntity = getDataset(state.datasetId);
    } else if (state.challengeId) {
      contextType = "Bài toán nghiên cứu";
      contextEntity = getChallenge(state.challengeId);
    }

    if (!contextType) {
      var allText = document.createElement("p");
      allText.textContent = "Đang hiển thị toàn bộ tri thức giả lập trong nguyên mẫu trình diễn.";
      contextPanel.appendChild(allText);
      return;
    }

    var safeName = contextEntity ? contextEntity.displayName : "Mã không có trong dữ liệu giả lập";
    var copy = document.createElement("p");
    copy.textContent = "Đang lọc theo " + contextType.toLowerCase() + ": " + safeName + ".";

    var clear = createLink("knowledge.html", "Xóa bộ lọc");
    clear.className = "btn btn-sm btn-outline-primary mt-3";
    contextPanel.appendChild(copy);
    contextPanel.appendChild(clear);

    var chip = document.createElement("span");
    chip.className = "filter-chip";
    chip.textContent = contextType + ": " + safeName + " ";
    chip.appendChild(createLink("knowledge.html", "Xóa"));
    activeContext.appendChild(chip);
  }

  function renderFindings() {
    var container = document.getElementById("findings-list");
    var count = document.getElementById("knowledge-count");
    var empty = document.getElementById("knowledge-empty");
    if (!container || !count || !empty) {
      return [];
    }

    var findings = getVisibleFindings();
    container.innerHTML = "";
    findings.forEach(function (finding) {
      container.appendChild(createFindingCard(finding));
    });

    count.textContent = "Hiển thị " + findings.length + "/" + (getDemoData().findings || []).length + " phát hiện";
    empty.hidden = findings.length !== 0 || getVisibleRelations().length !== 0;
    container.hidden = findings.length === 0;
    return findings;
  }

  function createFindingCard(finding) {
    var labels = getLabels();
    var article = document.createElement("article");
    article.className = "aniot-card finding-card";

    var badges = document.createElement("div");
    badges.className = "d-flex flex-wrap gap-2 mb-3";
    badges.appendChild(createBadge(labels.simulatedFinding));
    badges.appendChild(createBadge("Độ tin cậy giả lập: " + finding.simulatedConfidence));

    var title = document.createElement("h3");
    title.textContent = finding.displayName;

    var note = document.createElement("p");
    note.className = "finding-note";
    note.textContent = "Giới hạn: " + (finding.note || labels.illustrativeNotice);

    var meta = document.createElement("div");
    meta.className = "finding-meta-grid";

    (finding.datasetIds || []).forEach(function (datasetId) {
      var dataset = getDataset(datasetId);
      meta.appendChild(createMetaItem("Bộ dữ liệu nguồn", dataset ? createLink("dataset-detail.html?id=" + encodeURIComponent(dataset.id), dataset.displayName) : "Không xác định"));
    });

    var challenge = getChallenge(finding.challengeId);
    meta.appendChild(createMetaItem("Bài toán nghiên cứu", challenge ? createLink("challenge-detail.html?id=" + encodeURIComponent(challenge.id), challenge.displayName) : "Chưa có bài toán"));

    var models = getRelatedModelsForFinding(finding);
    meta.appendChild(createMetaItem("Mô hình liên quan", models.length ? models.map(function (model) {
      return model.displayName;
    }).join(", ") : "Chưa có mô hình liên quan"));

    meta.appendChild(createMetaItem("Bằng chứng", labels.illustrativeNotice));

    article.appendChild(badges);
    article.appendChild(title);
    article.appendChild(note);
    article.appendChild(meta);
    return article;
  }

  function createMetaItem(label, value) {
    var item = document.createElement("div");
    item.className = "knowledge-meta-item";

    var labelEl = document.createElement("span");
    labelEl.className = "knowledge-meta-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "knowledge-meta-value";
    if (value && value.nodeType) {
      valueEl.appendChild(value);
    } else {
      valueEl.textContent = value || "Chưa có dữ liệu";
    }

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function renderGraph() {
    var graph = document.getElementById("knowledge-graph");
    if (!graph) {
      return;
    }

    var relations = getVisibleRelations();
    graph.innerHTML = "";

    if (relations.length === 0) {
      var empty = document.createElement("p");
      empty.className = "mb-0 text-secondary";
      empty.textContent = "Chưa có quan hệ tri thức phù hợp với ngữ cảnh đang lọc.";
      graph.appendChild(empty);
      renderGraphDetail(null, null, "Không có quan hệ để hiển thị trong ngữ cảnh này.");
      return;
    }

    relations.forEach(function (relation) {
      graph.appendChild(createRelationBlock(relation));
    });

    renderGraphDetail(relations[0], { type: "relation", label: relations[0].label }, "");
  }

  function createRelationBlock(relation) {
    var labels = getLabels();
    var block = document.createElement("section");
    block.className = "relation-block";
    block.setAttribute("aria-labelledby", "relation-" + relation.id);

    var titleWrap = document.createElement("div");
    titleWrap.className = "relation-title";

    var title = document.createElement("h3");
    title.id = "relation-" + relation.id;
    title.textContent = relation.label;

    titleWrap.appendChild(title);
    titleWrap.appendChild(createBadge(labels.simulatedData));
    block.appendChild(titleWrap);

    var chain = document.createElement("div");
    chain.className = "graph-chain";

    (relation.nodes || []).forEach(function (nodeLabel, index) {
      var node = createGraphNodeButton(nodeLabel, index, (relation.nodes || []).length);
      node.addEventListener("click", function () {
        setActiveGraphItem(node);
        renderGraphDetail(relation, { type: "node", label: nodeLabel }, "");
      });
      chain.appendChild(node);

      if (index < (relation.edges || []).length) {
        var edgeLabel = relation.edges[index];
        var edge = createGraphEdgeButton(edgeLabel);
        edge.addEventListener("click", function () {
          setActiveGraphItem(edge);
          renderGraphDetail(relation, { type: "edge", label: edgeLabel }, "");
        });
        chain.appendChild(edge);
      }
    });

    block.appendChild(chain);
    return block;
  }

  function createGraphNodeButton(nodeLabel, index, totalNodes) {
    var node = document.createElement("button");
    node.className = "graph-node";
    node.type = "button";
    node.setAttribute("aria-label", getGraphNodeGroup(index, totalNodes) + ": " + nodeLabel);

    var marker = document.createElement("span");
    marker.className = "graph-node-marker";
    marker.setAttribute("aria-hidden", "true");

    var group = document.createElement("span");
    group.className = "graph-node-group";
    group.textContent = getGraphNodeGroup(index, totalNodes);

    var label = document.createElement("span");
    label.className = "graph-node-label";
    label.textContent = nodeLabel;

    node.appendChild(marker);
    node.appendChild(group);
    node.appendChild(label);
    return node;
  }

  function createGraphEdgeButton(edgeLabel) {
    var edge = document.createElement("button");
    edge.className = "graph-edge";
    edge.type = "button";
    edge.setAttribute("aria-label", "Quan hệ thận trọng: " + edgeLabel);

    var direction = document.createElement("span");
    direction.className = "graph-edge-direction";
    direction.setAttribute("aria-hidden", "true");
    direction.textContent = "→";

    var label = document.createElement("span");
    label.className = "graph-edge-label";
    label.textContent = edgeLabel;

    edge.appendChild(direction);
    edge.appendChild(label);
    return edge;
  }

  function getGraphNodeGroup(index, totalNodes) {
    if (index === 0) {
      return "Tín hiệu dữ liệu";
    }

    if (index === totalNodes - 1) {
      return "Tri thức kiểm tra";
    }

    return index === 1 ? "Diễn giải thận trọng" : "Quan sát liên quan";
  }

  function setActiveGraphItem(activeItem) {
    document.querySelectorAll(".graph-node, .graph-edge").forEach(function (item) {
      item.classList.remove("is-active");
    });
    activeItem.classList.add("is-active");
  }

  function renderGraphDetail(relation, selectedItem, fallbackText) {
    var title = document.getElementById("graph-detail-title");
    var content = document.getElementById("graph-detail-content");
    if (!title || !content) {
      return;
    }

    content.innerHTML = "";
    if (!relation) {
      title.textContent = "Chưa có quan hệ tri thức";
      var fallback = document.createElement("p");
      fallback.textContent = fallbackText || "Không có dữ liệu phù hợp.";
      content.appendChild(fallback);
      return;
    }

    title.textContent = selectedItem && selectedItem.label ? selectedItem.label : relation.label;

    var description = document.createElement("p");
    description.textContent = selectedItem && selectedItem.type === "edge"
      ? "Quan hệ này được diễn đạt thận trọng là “" + selectedItem.label + "”, nhằm gợi ý hướng kiểm tra thêm chứ không khẳng định quan hệ nhân quả."
      : "Nút này thuộc chuỗi quan hệ tri thức giả lập và cần được hiểu trong bối cảnh dữ liệu, bài toán và giới hạn bằng chứng đi kèm.";

    var evidence = document.createElement("p");
    evidence.textContent = "Bằng chứng: " + (relation.demoNotice || getLabels().illustrativeNotice) + ".";

    var list = document.createElement("ul");
    list.className = "detail-link-list";

    (relation.datasetIds || []).forEach(function (datasetId) {
      var dataset = getDataset(datasetId);
      var item = document.createElement("li");
      item.appendChild(document.createTextNode("Bộ dữ liệu nguồn: "));
      item.appendChild(dataset ? createLink("dataset-detail.html?id=" + encodeURIComponent(dataset.id), dataset.displayName) : document.createTextNode("Không xác định"));
      list.appendChild(item);
    });

    var challenge = getChallenge(relation.challengeId);
    var challengeItem = document.createElement("li");
    challengeItem.appendChild(document.createTextNode("Bài toán nghiên cứu: "));
    challengeItem.appendChild(challenge ? createLink("challenge-detail.html?id=" + encodeURIComponent(challenge.id), challenge.displayName) : document.createTextNode("Chưa có bài toán"));
    list.appendChild(challengeItem);

    var model = getRelatedModelForRelation(relation);
    var modelItem = document.createElement("li");
    modelItem.appendChild(document.createTextNode("Mô hình liên quan: "));
    modelItem.appendChild(document.createTextNode(model ? model.displayName : "Chưa có mô hình liên quan"));
    list.appendChild(modelItem);

    content.appendChild(description);
    content.appendChild(evidence);
    content.appendChild(list);
  }

  function renderModels(visibleFindings) {
    var container = document.getElementById("models-list");
    if (!container) {
      return;
    }

    var models = getVisibleModels(visibleFindings);
    container.innerHTML = "";

    if (models.length === 0) {
      var empty = document.createElement("div");
      empty.className = "aniot-card empty-state";
      var title = document.createElement("h3");
      title.textContent = "Chưa có mô hình phù hợp";
      var copy = document.createElement("p");
      copy.textContent = "Ngữ cảnh này chưa có mô hình thử nghiệm liên quan trong dữ liệu giả lập.";
      empty.appendChild(title);
      empty.appendChild(copy);
      container.appendChild(empty);
      return;
    }

    models.forEach(function (model) {
      container.appendChild(createModelCard(model));
    });
  }

  function createModelCard(model) {
    var article = document.createElement("article");
    article.className = "aniot-card model-card";

    var badges = document.createElement("div");
    badges.className = "d-flex flex-wrap gap-2 mb-3";
    badges.appendChild(createBadge("Mô hình"));
    badges.appendChild(createBadge(model.status || "Thử nghiệm"));

    var title = document.createElement("h3");
    title.textContent = model.displayName;

    var note = document.createElement("p");
    note.className = "model-note";
    note.textContent = "Chỉ số mô hình là dữ liệu giả lập, dùng để minh họa cách mô hình được nối lại với phát hiện và bài toán nghiên cứu.";

    var meta = document.createElement("div");
    meta.className = "model-meta-grid";
    meta.appendChild(createMetaItem("Loại mô hình", model.type));

    var challenge = getChallenge(model.challengeId);
    meta.appendChild(createMetaItem("Bài toán nghiên cứu", challenge ? createLink("challenge-detail.html?id=" + encodeURIComponent(challenge.id), challenge.displayName) : "Chưa có bài toán"));
    meta.appendChild(createMetaItem("Chỉ số giả lập", getModelMetrics(model)));
    meta.appendChild(createMetaItem("Phát hiện liên quan", getFindingNames(model.findingIds)));

    article.appendChild(badges);
    article.appendChild(title);
    article.appendChild(note);
    article.appendChild(meta);
    return article;
  }

  function getModelMetrics(model) {
    var metrics = [];
    if (model.simulatedF1) {
      metrics.push("F1-score " + model.simulatedF1);
    }
    if (model.simulatedHighRiskRecall) {
      metrics.push("Recall nhóm nguy cơ cao " + model.simulatedHighRiskRecall);
    }

    return metrics.length ? metrics.join("; ") : "Chỉ số mô phỏng chưa công bố";
  }

  function getFindingNames(findingIds) {
    var names = (findingIds || []).map(function (findingId) {
      var finding = findById(getDemoData().findings, findingId);
      return finding ? finding.displayName : "";
    }).filter(Boolean);

    return names.length ? names.join(", ") : "Chưa có phát hiện";
  }

  function readQueryContext() {
    var params = new URLSearchParams(window.location.search);
    state.datasetId = params.get("dataset") || "";
    state.challengeId = state.datasetId ? "" : (params.get("challenge") || "");
  }

  function init() {
    readQueryContext();
    renderContext();
    var visibleFindings = renderFindings();
    renderGraph();
    renderModels(visibleFindings);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
