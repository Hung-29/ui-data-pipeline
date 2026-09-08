# Aniot Financial Banking MiniApp

Bản Aniot đã chuyển sang ngữ cảnh **tài chính - ngân hàng** và được đóng gói để dễ chạy trong Codex/MiniApp web.

## Chạy trong Codex

```bash
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

Không cần `npm install` vì bản này không phụ thuộc package runtime bên ngoài. Output nằm trong `dist/`.

## Điểm tương thích MiniApp

- Có `package.json` với `dev/build/preview`.
- Asset và navigation dùng đường dẫn tương đối, phù hợp khi app được mount dưới sub-path.
- Bootstrap được đóng gói nội bộ, không cần CDN khi chạy.
- Không cần backend, secret hay dữ liệu ngân hàng thật.
- Có `AGENTS.md` để Codex hiểu cấu trúc và quy tắc khi tiếp tục phát triển.
- Có `miniapp.json` làm metadata trung gian cho MiniApp shell tùy chỉnh. Nếu hệ thống MiniApp của bạn có schema riêng, Codex chỉ cần map file này sang schema đó.

## Trang chính

- `index.html` — Tổng quan
- `datasets.html` / `dataset-detail.html` — Dữ liệu
- `challenges.html` / `challenge-detail.html` — Nghiên cứu
- `knowledge.html` — Kho tri thức
- `contribute.html` — Đóng góp dữ liệu
- `governance.html` — Quản trị dữ liệu
