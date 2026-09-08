(function () {
  "use strict";

  var navigationItems = [
    { label: "Tổng quan", href: "index.html", page: "overview" },
    { label: "Khám phá dữ liệu", href: "datasets.html", page: "datasets" },
    { label: "Nghiên cứu", href: "challenges.html", page: "challenges" },
    { label: "Kho tri thức", href: "knowledge.html", page: "knowledge" },
    { label: "Đóng góp dữ liệu", href: "contribute.html", page: "contribute" },
    { label: "Quản trị dữ liệu", href: "governance.html", page: "governance" }
  ];

  function getCurrentPage() {
    var bodyPage = document.body ? document.body.getAttribute("data-page") : "";
    if (bodyPage) {
      return bodyPage;
    }

    var fileName = window.location.pathname.split("/").pop() || "index.html";
    if (fileName === "index.html") {
      return "overview";
    }

    return fileName.replace(".html", "");
  }

  function createNavLink(item, currentPage) {
    var isActive = item.page === currentPage;
    var link = document.createElement("a");
    link.className = "nav-link" + (isActive ? " active" : "");
    link.href = item.href;
    link.textContent = item.label;

    if (isActive) {
      link.setAttribute("aria-current", "page");
    }

    return link;
  }

  function renderHeader() {
    var placeholder = document.getElementById("site-header");
    if (!placeholder) {
      return;
    }

    var currentPage = getCurrentPage();
    var header = document.createElement("header");
    header.className = "site-header";

    var nav = document.createElement("nav");
    nav.className = "navbar navbar-expand-lg";
    nav.setAttribute("aria-label", "Điều hướng chính");

    var container = document.createElement("div");
    container.className = "container-xl";

    var brand = document.createElement("a");
    brand.className = "navbar-brand";
    brand.href = "index.html";
    brand.textContent = "Aniot";

    var toggle = document.createElement("button");
    toggle.className = "navbar-toggler";
    toggle.type = "button";
    toggle.setAttribute("data-bs-toggle", "collapse");
    toggle.setAttribute("data-bs-target", "#siteNavbar");
    toggle.setAttribute("aria-controls", "siteNavbar");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Mở điều hướng");

    var toggleIcon = document.createElement("span");
    toggleIcon.className = "navbar-toggler-icon";
    toggle.appendChild(toggleIcon);

    var collapse = document.createElement("div");
    collapse.className = "collapse navbar-collapse";
    collapse.id = "siteNavbar";

    var navList = document.createElement("ul");
    navList.className = "navbar-nav ms-auto align-items-lg-center";

    navigationItems.forEach(function (item) {
      var listItem = document.createElement("li");
      listItem.className = "nav-item";
      listItem.appendChild(createNavLink(item, currentPage));
      navList.appendChild(listItem);
    });

    collapse.appendChild(navList);
    container.appendChild(brand);
    container.appendChild(toggle);
    container.appendChild(collapse);
    nav.appendChild(container);
    header.appendChild(nav);
    placeholder.replaceChildren(header);
  }

  function renderFooter() {
    var placeholder = document.getElementById("site-footer");
    if (!placeholder) {
      return;
    }

    var footer = document.createElement("footer");
    footer.className = "site-footer";

    var container = document.createElement("div");
    container.className = "container-xl";

    var row = document.createElement("div");
    row.className = "row gy-4 align-items-start";

    var missionCol = document.createElement("div");
    missionCol.className = "col-lg-6";

    var title = document.createElement("p");
    title.className = "footer-title";
    title.textContent = "Aniot Financial Data Commons";

    var mission = document.createElement("p");
    mission.className = "footer-description";
    mission.textContent = "Hạ tầng dữ liệu và tri thức dùng chung giúp cộng đồng biến dữ liệu tài chính - ngân hàng thành nghiên cứu, phát hiện và giá trị ứng dụng.";

    var label = document.createElement("span");
    label.className = "badge text-bg-light border demo-badge";
    label.textContent = "Prototype trình diễn - dữ liệu giả lập";

    missionCol.appendChild(title);
    missionCol.appendChild(mission);
    missionCol.appendChild(label);

    var linksCol = document.createElement("div");
    linksCol.className = "col-lg-6";

    var linksTitle = document.createElement("p");
    linksTitle.className = "footer-links-title";
    linksTitle.textContent = "Liên kết nền tảng";

    var links = document.createElement("div");
    links.className = "footer-links";

    navigationItems.forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      links.appendChild(link);
    });

    linksCol.appendChild(linksTitle);
    linksCol.appendChild(links);
    row.appendChild(missionCol);
    row.appendChild(linksCol);
    container.appendChild(row);
    footer.appendChild(container);
    placeholder.replaceChildren(footer);
  }

  function findById(collection, id) {
    if (!Array.isArray(collection)) {
      return null;
    }

    return collection.find(function (item) {
      return item.id === id;
    }) || null;
  }

  function getOrganizationName(id) {
    var data = window.ANIOT_DEMO || {};
    var organization = findById(data.organizations, id);
    return organization ? organization.displayName : "Không xác định";
  }

  function getAccessPolicyByName(name) {
    var data = window.ANIOT_DEMO || {};
    return (data.accessPolicies || []).find(function (policy) {
      return policy.displayName === name;
    }) || null;
  }

  function createBadge(text, variantClass) {
    var badge = document.createElement("span");
    badge.className = "badge " + (variantClass || "aniot-badge");
    badge.textContent = text;
    return badge;
  }

  function init() {
    renderHeader();
    renderFooter();
  }

  window.ANIOT = {
    navigationItems: navigationItems,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    findById: findById,
    getOrganizationName: getOrganizationName,
    getAccessPolicyByName: getAccessPolicyByName,
    createBadge: createBadge
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
