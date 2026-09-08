(function () {
  "use strict";

  var steps = [
    "Thông tin bộ dữ liệu",
    "Cấu trúc dữ liệu",
    "Ánh xạ cấu trúc dữ liệu",
    "Chính sách truy cập",
    "Xem lại"
  ];

  var stepIconLabels = [
    "Thông tin",
    "Cấu trúc",
    "Ánh xạ",
    "Truy cập",
    "Xem lại"
  ];

  var mappingExamples = [
    {
      source: "TEMP_01",
      schema: "environment.temperature.air",
      explanation: "Chuẩn hóa nhiệt độ không khí để so sánh giữa đơn vị, phân khúc và bộ dữ liệu."
    },
    {
      source: "HUM_01",
      schema: "environment.humidity.relative",
      explanation: "Ánh xạ độ ẩm tương đối sang trường môi trường dùng chung."
    },
    {
      source: "DEAD_QTY",
      schema: "health.mortality.count",
      explanation: "Chuẩn hóa số lượng khách hàng chết thành chỉ số sức khỏe tổng hợp."
    },
    {
      source: "FEED_KG",
      schema: "nutrition.feed.amount_kg",
      explanation: "Giữ đơn vị kg để phục vụ phân tích tiêu thụ hạn mức."
    }
  ];

  var currentStep = 0;

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function getElements() {
    return {
      form: document.getElementById("contribution-form"),
      stepper: document.getElementById("wizard-stepper"),
      status: document.getElementById("wizard-status"),
      back: document.getElementById("back-button"),
      next: document.getElementById("next-button"),
      complete: document.getElementById("complete-button"),
      mappingList: document.getElementById("mapping-list"),
      policyScale: document.getElementById("access-policy-scale"),
      review: document.getElementById("review-summary"),
      completion: document.getElementById("completion-message")
    };
  }

  function renderStepper(elements) {
    if (!elements.stepper) {
      return;
    }

    elements.stepper.innerHTML = "";
    steps.forEach(function (label, index) {
      var item = document.createElement("li");
      item.className = index === currentStep ? "is-active" : "";
      if (index < currentStep) {
        item.className = "is-complete";
      }

      var number = document.createElement("span");
      number.className = "step-number";
      number.textContent = String(index + 1);

      var icon = createStepIcon(index);

      var text = document.createElement("span");
      text.className = "step-label";
      text.textContent = label;

      item.appendChild(number);
      item.appendChild(icon);
      item.appendChild(text);
      elements.stepper.appendChild(item);
    });
  }

  function createStepIcon(index) {
    var icon = document.createElement("span");
    icon.className = "step-icon";
    icon.setAttribute("aria-label", stepIconLabels[index] || "Bước");
    icon.appendChild(createIconSvg(getStepIconPath(index)));
    return icon;
  }

  function getStepIconPath(index) {
    var paths = [
      "M9 5h6M9 9h6M9 13h4M6 4.5h.01M6 8.5h.01M6 12.5h.01",
      "M5 6h14M7 6v12M17 6v12M5 18h14M9 10h6M9 14h6",
      "M5 7h5M14 7h5M10 7h4M5 15h5M14 15h5M10 15h4M12 7v8",
      "M7 10V8a5 5 0 0 1 10 0v2M6 10h12v9H6zM12 14v2",
      "M6 7h12M6 12h8M6 17h6M16 15l2 2 4-5"
    ];
    return paths[index] || paths[0];
  }

  function createIconSvg(pathData) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "1.8");
    svg.appendChild(path);
    return svg;
  }

  function renderMappingExamples(elements) {
    if (!elements.mappingList) {
      return;
    }

    elements.mappingList.innerHTML = "";
    mappingExamples.forEach(function (mapping) {
      var row = document.createElement("article");
      row.className = "mapping-row";

      var source = createMappingBox("Trường nguồn", mapping.source, "");
      var arrow = document.createElement("div");
      arrow.className = "mapping-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.appendChild(createMappingArrowSvg());
      var schema = createMappingBox("Schema chuẩn", mapping.schema, "schema-code");

      var explanation = document.createElement("p");
      explanation.className = "mapping-explanation";
      explanation.textContent = mapping.explanation;

      schema.appendChild(explanation);
      row.appendChild(source);
      row.appendChild(arrow);
      row.appendChild(schema);
      elements.mappingList.appendChild(row);
    });
  }

  function createMappingArrowSvg() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.setAttribute("viewBox", "0 0 64 24");
    svg.setAttribute("focusable", "false");
    line.setAttribute("d", "M6 12h46");
    arrow.setAttribute("d", "M44 5l8 7-8 7");
    [line, arrow].forEach(function (path) {
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("stroke-width", "2.4");
      svg.appendChild(path);
    });
    return svg;
  }

  function createMappingBox(label, value, valueClass) {
    var box = document.createElement("div");
    box.className = label === "Trường nguồn" ? "mapping-field" : "mapping-schema";

    var labelEl = document.createElement("span");
    labelEl.className = "mapping-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "mapping-value " + valueClass;
    valueEl.textContent = value;

    var roleEl = document.createElement("span");
    roleEl.className = "mapping-role";
    roleEl.textContent = label === "Trường nguồn" ? "Không đổi hệ thống nguồn" : "Chuẩn hóa để truy vết và phân tích";

    box.appendChild(labelEl);
    box.appendChild(valueEl);
    box.appendChild(roleEl);
    return box;
  }

  function renderPolicyOptions(elements) {
    if (!elements.policyScale) {
      return;
    }

    var policies = getDemoData().accessPolicies || [];
    renderPolicyScale(elements, policies);
  }

  function renderPolicyScale(elements, policies) {
    if (!elements.policyScale) {
      return;
    }

    elements.policyScale.innerHTML = "";

    var intro = document.createElement("p");
    intro.className = "access-scale-note";
    intro.textContent = "Dữ liệu đóng góp không mặc định công khai; mức truy cập được chọn theo mục đích và thỏa thuận đóng góp.";

    var list = document.createElement("ol");
    list.className = "access-scale-list";

    policies.forEach(function (policy, index) {
      var item = document.createElement("li");
      item.className = "access-scale-item";
      item.dataset.policyId = policy.id;

      var card = document.createElement("label");
      card.className = "access-scale-card";
      card.setAttribute("for", "policy-" + policy.id);

      var input = document.createElement("input");
      input.className = "access-scale-input";
      input.type = "radio";
      input.name = "access-policy";
      input.id = "policy-" + policy.id;
      input.value = policy.displayName;
      input.required = true;
      input.checked = policy.displayName === "Dành cho nghiên cứu";

      var marker = document.createElement("span");
      marker.className = "access-scale-marker";
      marker.textContent = String(index + 1);

      var label = document.createElement("span");
      label.className = "access-scale-label";
      label.textContent = policy.displayName;

      var description = document.createElement("span");
      description.className = "access-scale-description";
      description.textContent = policy.description;

      var selected = document.createElement("span");
      selected.className = "access-scale-selected";
      selected.textContent = "Đang chọn";

      card.appendChild(input);
      card.appendChild(marker);
      card.appendChild(label);
      card.appendChild(description);
      card.appendChild(selected);
      item.appendChild(card);
      list.appendChild(item);
    });

    elements.policyScale.appendChild(intro);
    elements.policyScale.appendChild(list);
  }

  function showStep(elements) {
    document.querySelectorAll(".wizard-step").forEach(function (step) {
      step.hidden = Number(step.getAttribute("data-step")) !== currentStep;
    });

    renderStepper(elements);
    if (elements.back) {
      elements.back.disabled = currentStep === 0;
    }
    if (elements.next) {
      elements.next.hidden = currentStep === steps.length - 1;
    }
    if (elements.complete) {
      elements.complete.hidden = currentStep !== steps.length - 1;
    }
    if (elements.status) {
      elements.status.textContent = "";
    }
    if (currentStep === steps.length - 1) {
      renderReview(elements);
    } else if (elements.completion) {
      elements.completion.hidden = true;
      elements.completion.textContent = "";
    }
  }

  function getFieldsForStep(stepIndex) {
    return Array.prototype.slice.call(document.querySelectorAll('.wizard-step[data-step="' + stepIndex + '"] input, .wizard-step[data-step="' + stepIndex + '"] select, .wizard-step[data-step="' + stepIndex + '"] textarea'));
  }

  function validateCurrentStep(elements) {
    var fields = getFieldsForStep(currentStep);
    var invalid = fields.filter(function (field) {
      return field.required && !field.checkValidity();
    });

    fields.forEach(function (field) {
      field.classList.toggle("is-invalid", invalid.indexOf(field) !== -1);
    });

    if (invalid.length) {
      if (elements.status) {
        elements.status.textContent = "Vui lòng hoàn thành các trường bắt buộc trước khi tiếp tục.";
      }
      invalid[0].focus();
      return false;
    }

    if (elements.status) {
      elements.status.textContent = "";
    }
    return true;
  }

  function getValue(id) {
    var element = document.getElementById(id);
    return element ? element.value.trim() : "";
  }

  function getSelectedPolicy() {
    var selected = document.querySelector('input[name="access-policy"]:checked');
    return selected ? selected.value : "";
  }

  function renderReview(elements) {
    if (!elements.review) {
      return;
    }

    elements.review.innerHTML = "";
    [
      ["Đơn vị đóng góp dữ liệu", getValue("organization-name")],
      ["Tên bộ dữ liệu", getValue("dataset-name")],
      ["Phân khúc", getValue("species")],
      ["Giai đoạn dữ liệu", getValue("period")],
      ["Nhóm dữ liệu", getValue("data-category")],
      ["Hệ thống nguồn", getValue("source-system")],
      ["Tần suất cập nhật", getValue("update-frequency")],
      ["Trường nguồn minh họa", getValue("source-fields")],
      ["Chính sách truy cập", getSelectedPolicy()]
    ].forEach(function (item) {
      elements.review.appendChild(createReviewItem(item[0], item[1]));
    });
  }

  function createReviewItem(label, value) {
    var item = document.createElement("div");
    item.className = "review-item";

    var labelEl = document.createElement("span");
    labelEl.className = "review-label";
    labelEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "review-value";
    valueEl.textContent = value || "Chưa có dữ liệu";

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function completeSimulation(elements) {
    if (!elements.completion) {
      return;
    }

    elements.completion.hidden = false;
    elements.completion.textContent = "Đã hoàn tất mô phỏng đóng góp dữ liệu. Không có tệp thật được tải lên, không có dữ liệu được gửi tới máy chủ và không có API nào được gọi.";
  }

  function bindEvents(elements) {
    if (elements.next) {
      elements.next.addEventListener("click", function () {
        if (!validateCurrentStep(elements)) {
          return;
        }
        currentStep = Math.min(currentStep + 1, steps.length - 1);
        showStep(elements);
      });
    }

    if (elements.back) {
      elements.back.addEventListener("click", function () {
        currentStep = Math.max(currentStep - 1, 0);
        showStep(elements);
      });
    }

    if (elements.form) {
      elements.form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (validateCurrentStep(elements)) {
          renderReview(elements);
          completeSimulation(elements);
        }
      });

      elements.form.addEventListener("input", function (event) {
        if (event.target && event.target.classList) {
          event.target.classList.remove("is-invalid");
        }
        if (elements.completion) {
          elements.completion.hidden = true;
          elements.completion.textContent = "";
        }
      });

      elements.form.addEventListener("change", function (event) {
        if (event.target && event.target.classList) {
          event.target.classList.remove("is-invalid");
        }
        if (currentStep === steps.length - 1) {
          renderReview(elements);
        }
      });
    }
  }

  function init() {
    var elements = getElements();
    renderMappingExamples(elements);
    renderPolicyOptions(elements);
    bindEvents(elements);
    showStep(elements);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
