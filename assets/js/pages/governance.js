(function () {
  "use strict";

  var selectedPolicyId = "";

  var policyDetails = {
    mo: {
      access: "Người dùng có thể xem metadata và dữ liệu mẫu công khai trong phạm vi được phép hiển thị.",
      approval: "Không cần phê duyệt từng yêu cầu xem metadata công khai; quyền tải hoặc dùng sâu hơn vẫn có thể được giới hạn theo thiết kế nguyên mẫu.",
      visible: "Tên bộ dữ liệu, mô tả, từ điển dữ liệu, dữ liệu mẫu và thông tin nguồn ở mức đã được đơn vị đóng góp đồng ý.",
      attribution: "Khi dùng trong nghiên cứu hoặc bài toán, kết quả nên ghi nhận bộ dữ liệu và đơn vị đóng góp dữ liệu theo quy ước của nền tảng."
    },
    "can-dang-ky": {
      access: "Người dùng có tài khoản giả định hoặc hồ sơ nghiên cứu phù hợp có thể gửi yêu cầu truy cập.",
      approval: "Cần bước đăng ký hoặc xác nhận mục đích sử dụng ở mức khái niệm; nguyên mẫu không tạo đăng nhập thật.",
      visible: "Metadata chính có thể hiển thị rộng hơn, còn dữ liệu mẫu hoặc trường chi tiết có thể chỉ hiển thị sau khi được chấp thuận.",
      attribution: "Kết quả phân tích cần nhắc rõ nguồn dữ liệu và giữ liên kết truy vết về bộ dữ liệu gốc."
    },
    "danh-cho-nghien-cuu": {
      access: "Nhà nghiên cứu, sinh viên hoặc nhóm chuyên môn có mục tiêu nghiên cứu rõ ràng có thể yêu cầu truy cập.",
      approval: "Cần mô tả mục tiêu nghiên cứu và được phê duyệt theo chính sách của bộ dữ liệu.",
      visible: "Có thể hiển thị metadata, từ điển dữ liệu và phạm vi sử dụng; bản dữ liệu nghiên cứu chỉ mở cho nhóm được duyệt.",
      attribution: "Phát hiện, mô hình và kết quả gửi lên cần ghi nhận bộ dữ liệu nguồn và đơn vị đóng góp dữ liệu."
    },
    "han-che": {
      access: "Chỉ dự án, nhóm hoặc vai trò được chỉ định mới có thể xem dữ liệu ở phạm vi được cấp.",
      approval: "Cần phê duyệt cụ thể theo từng mục đích và có thể yêu cầu ẩn danh sâu hơn hoặc giới hạn trường dữ liệu.",
      visible: "Metadata có thể bị rút gọn; dữ liệu mẫu và trường nhạy cảm chỉ hiển thị khi phù hợp với phạm vi được duyệt.",
      attribution: "Kết quả liên quan vẫn cần giữ nguồn gốc dữ liệu, nhưng mức hiển thị tên đơn vị hoặc chi tiết nguồn phụ thuộc thỏa thuận đóng góp."
    },
    "rieng-tu": {
      access: "Chỉ đơn vị đóng góp dữ liệu và các bên được chỉ định theo thỏa thuận mới có thể tiếp cận.",
      approval: "Mọi truy cập đều cần quyết định rõ từ bên đóng góp hoặc quy trình phê duyệt được thống nhất trước.",
      visible: "Metadata có thể không công khai hoặc chỉ hiển thị tối thiểu để tránh lộ bối cảnh dữ liệu.",
      attribution: "Việc ghi nhận nguồn, công bố kết quả hoặc trích dẫn phụ thuộc vào thỏa thuận với đơn vị đóng góp dữ liệu."
    }
  };

  var councilRoles = [
    {
      id: "aniot",
      title: "Aniot",
      description: "Vận hành hạ tầng, chuẩn hóa siêu dữ liệu, quản trị quyền truy cập, nguồn gốc và luồng xử lý dữ liệu."
    },
    {
      id: "contributor",
      title: "Doanh nghiệp / Tổ chức tài chính",
      description: "Xác định phạm vi chia sẻ, chính sách truy cập, mức ghi nhận nguồn và các giới hạn sử dụng dữ liệu."
    },
    {
      id: "expert",
      title: "Chuyên gia tài chính - ngân hàng / quản trị rủi ro",
      description: "Góp ý ý nghĩa chuyên môn, rủi ro diễn giải và yêu cầu ẩn danh phù hợp với bối cảnh sản xuất."
    },
    {
      id: "academic",
      title: "Đại diện học thuật",
      description: "Đề xuất cách dùng dữ liệu cho nghiên cứu, đào tạo, bài toán mở và kiểm tra khả năng tái sử dụng tri thức."
    },
    {
      id: "ethics",
      title: "Chuyên gia dữ liệu / đạo đức",
      description: "Rà soát nguyên tắc truy cập theo nhu cầu, minh bạch phiên bản, truy vết và hạn chế sử dụng ngoài mục đích."
    }
  ];

  var principles = [
    {
      title: "Mục đích rõ ràng",
      description: "Mỗi yêu cầu truy cập cần nêu mục tiêu sử dụng dữ liệu để đơn vị đóng góp và Aniot hiểu dữ liệu sẽ phục vụ việc gì."
    },
    {
      title: "Truy cập theo nhu cầu",
      description: "Người dùng chỉ nên tiếp cận phần dữ liệu phù hợp với mục tiêu đã nêu, không mặc định mở toàn bộ bộ dữ liệu."
    },
    {
      title: "Ẩn danh phù hợp",
      description: "Thông tin nhận diện tổ chức, khu nuôi hoặc cá thể cần được xử lý ở mức phù hợp với chính sách truy cập."
    },
    {
      title: "Truy vết nguồn gốc",
      description: "Bộ dữ liệu, phiên bản, bước chuẩn hóa và kết quả nghiên cứu cần được nối lại để người dùng hiểu tri thức đến từ đâu."
    },
    {
      title: "Ghi nhận đơn vị đóng góp",
      description: "Khi dữ liệu tạo ra phát hiện, mô hình hoặc kết quả nghiên cứu, nền tảng cần giữ cơ chế ghi nhận nguồn đóng góp phù hợp."
    },
    {
      title: "Minh bạch thay đổi phiên bản",
      description: "Khi dữ liệu hoặc schema thay đổi, người dùng cần biết phiên bản nào đã được dùng cho phân tích và kết quả liên quan."
    }
  ];

  function getDemoData() {
    return window.ANIOT_DEMO || {};
  }

  function renderPolicies() {
    var tabs = document.getElementById("policy-tabs");
    var policies = getDemoData().accessPolicies || [];
    if (!tabs) {
      return;
    }

    tabs.innerHTML = "";
    policies.forEach(function (policy, index) {
      var button = document.createElement("button");
      button.className = "policy-tab";
      button.type = "button";
      button.id = "policy-tab-" + policy.id;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "policy-detail");
      button.setAttribute("aria-selected", index === 0 ? "true" : "false");

      var title = document.createElement("span");
      title.className = "policy-tab-title";
      title.textContent = policy.displayName;

      var copy = document.createElement("span");
      copy.className = "policy-tab-copy";
      copy.textContent = policy.description;

      button.appendChild(title);
      button.appendChild(copy);
      button.addEventListener("click", function () {
        selectPolicy(policy.id);
      });
      button.addEventListener("keydown", function (event) {
        handlePolicyKeydown(event, policy.id);
      });
      tabs.appendChild(button);
    });

    if (policies.length) {
      selectPolicy(policies[0].id);
    }
    renderPolicyMatrix(policies);
  }

  function handlePolicyKeydown(event, policyId) {
    var policies = getDemoData().accessPolicies || [];
    var ids = policies.map(function (policy) {
      return policy.id;
    });
    var currentIndex = ids.indexOf(policyId);
    var nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % ids.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + ids.length) % ids.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = ids.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectPolicy(ids[nextIndex]);
    var nextButton = document.getElementById("policy-tab-" + ids[nextIndex]);
    if (nextButton) {
      nextButton.focus();
    }
  }

  function selectPolicy(policyId) {
    selectedPolicyId = policyId;
    document.querySelectorAll(".policy-tab").forEach(function (button) {
      var isActive = button.id === "policy-tab-" + selectedPolicyId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    renderPolicyDetail();
  }

  function renderPolicyDetail() {
    var detail = document.getElementById("policy-detail");
    var policy = (getDemoData().accessPolicies || []).find(function (item) {
      return item.id === selectedPolicyId;
    });
    if (!detail || !policy) {
      return;
    }

    var extra = policyDetails[policy.id] || {};
    detail.innerHTML = "";

    var badge = document.createElement("span");
    badge.className = "badge aniot-badge mb-3";
    badge.textContent = "Chính sách truy cập";

    var title = document.createElement("h3");
    title.id = "policy-detail-title";
    title.textContent = policy.displayName;

    var description = document.createElement("p");
    description.textContent = policy.description;

    var list = document.createElement("ul");
    list.className = "policy-detail-list";
    list.appendChild(createDetailItem("Ai có thể truy cập", extra.access));
    list.appendChild(createDetailItem("Yêu cầu phê duyệt", extra.approval));
    list.appendChild(createDetailItem("Thông tin có thể hiển thị", extra.visible));
    list.appendChild(createDetailItem("Ghi nhận nguồn / trích dẫn", extra.attribution));

    if (policy.notes && policy.notes.length) {
      list.appendChild(createDetailItem("Ghi chú mô phỏng", policy.notes.join(" ")));
    }

    detail.appendChild(badge);
    detail.appendChild(title);
    detail.appendChild(description);
    detail.appendChild(list);
  }

  function renderPolicyMatrix(policies) {
    var container = document.getElementById("policy-matrix");
    if (!container) {
      return;
    }

    container.innerHTML = "";

    var table = document.createElement("table");
    table.className = "policy-matrix-table";

    var caption = document.createElement("caption");
    caption.className = "visually-hidden";
    caption.textContent = "So sánh mức truy cập, yêu cầu phê duyệt, phạm vi hiển thị và kỳ vọng ghi nhận nguồn";

    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    ["Mức truy cập", "Ai có thể truy cập", "Phê duyệt", "Có thể hiển thị", "Ghi nhận nguồn"].forEach(function (label) {
      var th = document.createElement("th");
      th.scope = "col";
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    var tbody = document.createElement("tbody");
    policies.forEach(function (policy) {
      var detail = policyDetails[policy.id] || {};
      var row = document.createElement("tr");
      row.appendChild(createPolicyHeaderCell(policy));
      row.appendChild(createTableCell(detail.access));
      row.appendChild(createTableCell(detail.approval));
      row.appendChild(createTableCell(detail.visible));
      row.appendChild(createTableCell(detail.attribution));
      tbody.appendChild(row);
    });

    table.appendChild(caption);
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  }

  function createPolicyHeaderCell(policy) {
    var cell = document.createElement("th");
    var badge = document.createElement("span");
    var description = document.createElement("span");
    cell.scope = "row";
    badge.className = "policy-matrix-badge";
    badge.textContent = policy.displayName;
    description.className = "policy-matrix-description";
    description.textContent = policy.description;
    cell.appendChild(badge);
    cell.appendChild(description);
    return cell;
  }

  function createTableCell(value) {
    var cell = document.createElement("td");
    cell.textContent = value || "Chưa có mô tả";
    return cell;
  }

  function createDetailItem(label, value) {
    var item = document.createElement("li");
    var labelEl = document.createElement("span");
    labelEl.className = "detail-label";
    labelEl.textContent = label;
    var valueEl = document.createElement("span");
    valueEl.textContent = value || "Chưa có mô tả";
    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function renderCardGrid(containerId, items, cardClass) {
    var container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    container.innerHTML = "";
    items.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "aniot-card " + cardClass;
      if (cardClass === "role-card") {
        card.appendChild(createRoleIcon(item.id));
      }
      var title = document.createElement("h3");
      title.textContent = item.title;
      var description = document.createElement("p");
      description.textContent = item.description;
      card.appendChild(title);
      card.appendChild(description);
      container.appendChild(card);
    });
  }

  function createRoleIcon(roleId) {
    var icon = document.createElement("span");
    icon.className = "role-icon role-icon-" + roleId;
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(createIconSvg(getRoleIconPath(roleId)));
    return icon;
  }

  function createIconSvg(pathData) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("focusable", "false");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "1.8");
    svg.appendChild(path);
    return svg;
  }

  function getRoleIconPath(roleId) {
    var paths = {
      aniot: "M12 4l7 4v5c0 4-3 6-7 7-4-1-7-3-7-7V8l7-4zM9 12h6M12 9v6",
      contributor: "M5 11h14M7 11v8M17 11v8M8 8l4-3 4 3M10 15h4",
      expert: "M8 4h8M12 4v5M7 20h10M9 9h6l2 11H7l2-11z",
      academic: "M4 8l8-4 8 4-8 4-8-4zM7 11v4c2.5 2 7.5 2 10 0v-4",
      ethics: "M12 4v16M6 8h12M8 8l-3 5h6L8 8zM16 8l-3 5h6l-3-5z"
    };
    return paths[roleId] || paths.aniot;
  }

  function init() {
    renderPolicies();
    renderCardGrid("council-roles", councilRoles, "role-card");
    renderCardGrid("principles-list", principles, "principle-card");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
