(function () {
  "use strict";

  var organizations = [
    { id:"org-aniot", displayName:"Aniot", type:"Đơn vị vận hành nền tảng", role:"Quản trị hạ tầng dữ liệu và tri thức tài chính" },
    { id:"org-vietcapital-demo", displayName:"Ngân hàng Thịnh Vượng Demo", type:"Ngân hàng thương mại giả lập", region:"Việt Nam", note:"Tổ chức giả lập" },
    { id:"org-fintech-demo", displayName:"FinPay Demo", type:"Công ty công nghệ tài chính giả lập", region:"Việt Nam", note:"Tổ chức giả lập" },
    { id:"org-insight-demo", displayName:"Credit Insight Lab", type:"Đơn vị phân tích rủi ro giả lập", region:"Việt Nam", note:"Tổ chức giả lập" },
    { id:"org-securities-demo", displayName:"Chứng khoán Horizon Demo", type:"Công ty chứng khoán giả lập", region:"Việt Nam", note:"Tổ chức giả lập" },
    { id:"org-university-demo", displayName:"Nhóm nghiên cứu FinTech Mở", type:"Nhóm nghiên cứu đại học giả lập", region:"Việt Nam", note:"Không đại diện cho một trường thật" }
  ];

  var datasets = [
    { id:"giao-dich-the-2024-2025", displayName:"Bộ dữ liệu giao dịch thẻ và hành vi thanh toán 2024–2025", contributingOrganizationId:"org-vietcapital-demo", species:"Ngân hàng bán lẻ", period:"01/2024–12/2025", illustrativeScale:"1,8 triệu khách hàng, 42 triệu giao dịch", dataCategories:["Giao dịch","Thanh toán","Hành vi khách hàng"], accessLevel:"Dành cho nghiên cứu", frequency:"Theo giao dịch; tổng hợp chỉ số theo ngày", mainFields:[{name:"timestamp",label:"Thời điểm giao dịch"},{name:"customer_id",label:"Mã khách hàng ẩn danh"},{name:"transaction_id",label:"Mã giao dịch"},{name:"amount_vnd",label:"Giá trị giao dịch (VND)"},{name:"channel",label:"Kênh giao dịch"},{name:"merchant_category",label:"Nhóm đơn vị chấp nhận thanh toán"},{name:"risk_score",label:"Điểm rủi ro giao dịch"},{name:"is_fraud",label:"Nhãn gian lận giả lập"}], simulatedQuality:96, version:"2.1", note:"Dữ liệu khách hàng và giao dịch đã được ẩn danh trong môi trường nghiên cứu giả lập." },
    { id:"tin-dung-ca-nhan-2025", displayName:"Bộ dữ liệu tín dụng cá nhân và lịch sử trả nợ 2025", contributingOrganizationId:"org-insight-demo", species:"Tín dụng cá nhân", period:"01/2025–12/2025", illustrativeScale:"620.000 hồ sơ tín dụng", dataCategories:["Tín dụng","Rủi ro","Khả năng trả nợ"], accessLevel:"Cần đăng ký", mainFields:[{name:"application_id",label:"Mã hồ sơ ẩn danh"},{name:"customer_id",label:"Mã khách hàng ẩn danh"},{name:"income_band",label:"Nhóm thu nhập"},{name:"loan_amount",label:"Số tiền vay"},{name:"tenor_months",label:"Kỳ hạn (tháng)"},{name:"credit_score",label:"Điểm tín dụng"},{name:"dpd_30",label:"Trễ hạn trên 30 ngày"},{name:"default_flag",label:"Nhãn vỡ nợ giả lập"}], simulatedQuality:94, version:"1.4" },
    { id:"chuyen-khoan-so-2024-2025", displayName:"Bộ dữ liệu chuyển khoản số và phát hiện bất thường 2024–2025", contributingOrganizationId:"org-fintech-demo", species:"Ngân hàng số", period:"05/2024–12/2025", illustrativeScale:"28 triệu giao dịch số", dataCategories:["Chuyển khoản","Gian lận","Thiết bị & kênh số"], accessLevel:"Hạn chế", mainFields:[{name:"timestamp",label:"Thời điểm"},{name:"account_id",label:"Mã tài khoản ẩn danh"},{name:"transaction_id",label:"Mã giao dịch"},{name:"amount_vnd",label:"Số tiền"},{name:"device_id",label:"Mã thiết bị ẩn danh"},{name:"channel",label:"Kênh số"},{name:"velocity_1h",label:"Tần suất giao dịch 1 giờ"},{name:"anomaly_score",label:"Điểm bất thường"}], simulatedQuality:92, version:"1.8" },
    { id:"danh-muc-dau-tu-2025", displayName:"Bộ dữ liệu danh mục đầu tư và biến động thị trường 2025", contributingOrganizationId:"org-securities-demo", species:"Đầu tư & chứng khoán", period:"01/2025–12/2025", illustrativeScale:"85.000 danh mục, 6,2 triệu bản ghi", dataCategories:["Danh mục đầu tư","Thị trường","Rủi ro"], accessLevel:"Dành cho nghiên cứu", mainFields:[{name:"portfolio_id",label:"Mã danh mục ẩn danh"},{name:"ngay",label:"Ngày"},{name:"asset_class",label:"Nhóm tài sản"},{name:"market_value",label:"Giá trị thị trường"},{name:"daily_return",label:"Lợi suất ngày"},{name:"volatility_30d",label:"Biến động 30 ngày"},{name:"var_95",label:"VaR 95%"}], simulatedQuality:95, version:"1.2" },
    { id:"khach-hang-so-2025-2026", displayName:"Bộ dữ liệu hành vi khách hàng trên ngân hàng số 2025–2026", contributingOrganizationId:"org-vietcapital-demo", species:"Khách hàng số", period:"07/2025–06/2026", illustrativeScale:"2,4 triệu phiên sử dụng", dataCategories:["Hành vi số","Trải nghiệm khách hàng","Sản phẩm"], accessLevel:"Mở", mainFields:[{name:"timestamp",label:"Thời điểm"},{name:"customer_id",label:"Mã khách hàng ẩn danh"},{name:"session_id",label:"Mã phiên"},{name:"channel",label:"Kênh truy cập"},{name:"feature_used",label:"Tính năng sử dụng"},{name:"session_duration",label:"Thời lượng phiên"},{name:"conversion_flag",label:"Nhãn chuyển đổi giả lập"}], simulatedQuality:90, version:"1.0" }
  ];

  var challenges = [
    { id:"fraud-card-001", displayName:"Phát hiện giao dịch thẻ có nguy cơ gian lận theo thời gian thực", proposingOrganizationId:"org-vietcapital-demo", status:"Đang mở", datasetId:"giao-dich-the-2024-2025", domain:"Gian lận và thanh toán", description:"Xây dựng mô hình nhận diện sớm giao dịch bất thường để hỗ trợ cảnh báo và kiểm soát rủi ro.", researchQuestions:["Những tín hiệu nào có giá trị cảnh báo gian lận tốt nhất?","Có thể giảm cảnh báo sai mà vẫn giữ recall nhóm rủi ro cao không?","Mô hình có ổn định giữa các kênh giao dịch không?"], demoEvaluationCriteria:["F1-score","Recall nhóm rủi ro cao","Khả năng giải thích"], simulatedParticipatingTeams:14 },
    { id:"credit-risk-002", displayName:"Dự báo nguy cơ trễ hạn của khách hàng tín dụng cá nhân", proposingOrganizationId:"org-insight-demo", status:"Đang mở", datasetId:"tin-dung-ca-nhan-2025", domain:"Rủi ro tín dụng", description:"Phân tích các yếu tố liên quan đến khả năng trễ hạn và xây dựng mô hình chấm điểm thử nghiệm.", simulatedParticipatingTeams:9 },
    { id:"transfer-anomaly-003", displayName:"Cảnh báo sớm chuỗi chuyển khoản số bất thường", proposingOrganizationId:"org-fintech-demo", status:"Đang đánh giá", datasetId:"chuyen-khoan-so-2024-2025", domain:"AML và giao dịch bất thường", description:"Xây dựng tín hiệu cảnh báo để hỗ trợ rà soát các chuỗi giao dịch có hành vi bất thường.", simulatedParticipatingTeams:7 },
    { id:"portfolio-risk-004", displayName:"Phát hiện sớm danh mục có mức rủi ro tăng nhanh", proposingOrganizationId:"org-securities-demo", status:"Đã hoàn thành", datasetId:"danh-muc-dau-tu-2025", domain:"Quản trị rủi ro thị trường", description:"Tìm tín hiệu biến động và mức tập trung có thể hỗ trợ sàng lọc danh mục cần được kiểm tra thêm.", simulatedParticipatingTeams:11 }
  ];

  var researchProjects=[
    {id:"research-fraud-a",displayName:"Phân tích hành vi giao dịch và tín hiệu gian lận",teamOrganizationId:"org-university-demo",challengeId:"fraud-card-001",datasetId:"giao-dich-the-2024-2025",status:"Đang thực hiện"},
    {id:"research-credit-b",displayName:"Mô hình giải thích biến động rủi ro tín dụng",teamOrganizationId:"org-university-demo",challengeId:"credit-risk-002",datasetId:"tin-dung-ca-nhan-2025",status:"Đang thực hiện"}
  ];
  var findings=[
    {id:"finding-fraud-001",displayName:"Tần suất giao dịch tăng đột biến kết hợp thay đổi kênh có liên hệ với nhóm giao dịch rủi ro cao",simulatedConfidence:"Trung bình",datasetIds:["giao-dich-the-2024-2025"],challengeId:"fraud-card-001",projectId:"research-fraud-a",note:"Cần kiểm chứng thêm theo phân khúc và thời gian."},
    {id:"finding-credit-002",displayName:"Tỷ lệ sử dụng hạn mức và lịch sử trễ hạn có liên hệ với biến động xác suất vỡ nợ",simulatedConfidence:"Trung bình",datasetIds:["tin-dung-ca-nhan-2025"],challengeId:"credit-risk-002",projectId:"research-credit-b",note:"Mối liên hệ minh họa, không phải quyết định cấp tín dụng."},
    {id:"finding-transfer-003",displayName:"Một số chuỗi chuyển khoản bất thường có tín hiệu tăng tần suất và thay đổi thiết bị trước cảnh báo",simulatedConfidence:"Trung bình",datasetIds:["chuyen-khoan-so-2024-2025"],challengeId:"transfer-anomaly-003",note:"Dữ liệu giả lập cho mục đích minh họa đồ thị tri thức."}
  ];
  var models=[
    {id:"model-fraud-v1",displayName:"Mô hình cảnh báo gian lận giao dịch thử nghiệm v1",type:"Mô hình phân loại",challengeId:"fraud-card-001",findingIds:["finding-fraud-001"],status:"Thử nghiệm",simulatedF1:"0,84",simulatedHighRiskRecall:"0,89"},
    {id:"model-credit-v1",displayName:"Mô hình giải thích rủi ro tín dụng thử nghiệm v1",type:"Mô hình phân loại / giải thích",challengeId:"credit-risk-002",findingIds:["finding-credit-002"],status:"Thử nghiệm"}
  ];
  var knowledgeRelations=[
    {id:"relation-fraud-demo",label:"Chuỗi quan hệ rủi ro giao dịch minh họa",demoNotice:"Số liệu minh họa, không phải kết quả nghiên cứu thực tế",nodes:["Tần suất giao dịch tăng","Điểm bất thường tăng","Nguy cơ gian lận tăng","Cần rà soát"],edges:["có thể liên quan","có thể liên quan","cần kiểm tra"],datasetIds:["giao-dich-the-2024-2025"],challengeId:"fraud-card-001",findingIds:["finding-fraud-001"]},
    {id:"relation-credit-demo",label:"Chuỗi quan hệ rủi ro tín dụng minh họa",demoNotice:"Số liệu minh họa, không phải kết quả nghiên cứu thực tế",nodes:["Trễ hạn tăng","Điểm tín dụng giảm","Rủi ro tín dụng tăng"],edges:["có thể liên quan","có thể liên quan"],datasetIds:["tin-dung-ca-nhan-2025"],challengeId:"credit-risk-002",findingIds:["finding-credit-002"]}
  ];
  var accessPolicies=[
    {id:"mo",displayName:"Mở",badgeLabel:"Dữ liệu mở",description:"Người dùng có thể xem metadata và dữ liệu mẫu công khai.",notes:["Dữ liệu hiển thị là dữ liệu giả lập, không chứa thông tin khách hàng thật."]},
    {id:"can-dang-ky",displayName:"Cần đăng ký",badgeLabel:"Cần đăng ký",description:"Cần có tài khoản giả định trên nền tảng.",notes:["Nguyên mẫu trình diễn không có đăng nhập thật."]},
    {id:"danh-cho-nghien-cuu",displayName:"Dành cho nghiên cứu",badgeLabel:"Dành cho nghiên cứu",description:"Cần mô tả mục tiêu nghiên cứu và được phê duyệt.",notes:["Có thể yêu cầu trích dẫn nguồn dữ liệu."]},
    {id:"han-che",displayName:"Hạn chế",badgeLabel:"Hạn chế",description:"Chỉ cho dự án hoặc nhóm được chỉ định.",notes:["Có thể yêu cầu ẩn danh sâu hơn và giới hạn trường dữ liệu."]},
    {id:"rieng-tu",displayName:"Riêng tư",badgeLabel:"Riêng tư",description:"Metadata có thể không công khai hoặc chỉ hiển thị tối thiểu.",notes:["Quyền truy cập thuộc bên đóng góp theo thỏa thuận giả định."]}
  ];
  var participantGroups=[
    {id:"businesses-farms",displayName:"Ngân hàng / Tổ chức tài chính",description:"Đóng góp dữ liệu nghiệp vụ, nêu bài toán vận hành và nhận lại phân tích, mô hình rủi ro hoặc ý tưởng tối ưu hóa."},
    {id:"researchers",displayName:"Nhà nghiên cứu",description:"Khám phá bộ dữ liệu, phân tích dữ liệu và liên kết phát hiện trở lại nguồn dữ liệu."},
    {id:"students",displayName:"Sinh viên",description:"Tham gia bài toán nghiên cứu, học từ dữ liệu tài chính giả lập có cấu trúc và thử nghiệm mô hình."},
    {id:"experts",displayName:"Chuyên gia tài chính",description:"Định hình câu hỏi, phản biện kết quả, đánh giá ý nghĩa nghiệp vụ và quản trị rủi ro."},
    {id:"aniot",displayName:"Aniot",description:"Xây dựng hạ tầng, chuẩn hóa siêu dữ liệu, quản trị quyền truy cập và tích lũy tri thức có thể tái sử dụng."}
  ];
  var valueLoop=[
    {id:"farms-businesses",label:"Ngân hàng / Tổ chức tài chính",shortLabel:"Tổ chức tài chính",description:"Các đơn vị tài chính nêu vấn đề thực tế, cung cấp bối cảnh nghiệp vụ và xác định phạm vi chia sẻ dữ liệu."},
    {id:"data",label:"Dữ liệu tài chính",shortLabel:"Dữ liệu",description:"Dữ liệu giao dịch, tín dụng, khách hàng, rủi ro và kênh số được Aniot chuẩn hóa, lập danh mục và quản trị truy cập."},
    {id:"research",label:"Nhà nghiên cứu / Chuyên gia phân tích",shortLabel:"Phân tích",description:"Cộng đồng phân tích khai phá dữ liệu, xây dựng mô hình và công bố phát hiện có liên kết bằng chứng."},
    {id:"knowledge",label:"Phát hiện / Mô hình / Tri thức",shortLabel:"Tri thức",description:"Phát hiện, mô hình và tri thức được tích lũy cùng nguồn dữ liệu, bài toán và mức độ tin cậy minh họa."},
    {id:"solution",label:"Giải pháp tài chính ứng dụng",shortLabel:"Giải pháp",description:"Tri thức quay lại tổ chức tài chính dưới dạng cảnh báo rủi ro, chấm điểm thử nghiệm, benchmark hoặc ý tưởng tối ưu vận hành."}
  ];
  window.ANIOT_DEMO={prototypeLabels:{simulatedData:"Dữ liệu giả lập",prototype:"Prototype trình diễn",illustrativeNotice:"Số liệu minh họa, không phải kết quả nghiên cứu thực tế"},organizations:organizations,farms:organizations.filter(function(o){return o.type&&o.type.indexOf("Ngân hàng")!==-1;}),datasets:datasets,challenges:challenges,researchProjects:researchProjects,findings:findings,models:models,knowledgeRelations:knowledgeRelations,accessPolicies:accessPolicies,participantGroups:participantGroups,valueLoop:valueLoop};
})();
