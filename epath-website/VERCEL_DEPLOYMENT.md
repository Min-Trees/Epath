# EPath Website - Vercel Deployment Guide

Hướng dẫn triển khai website EPath trên Vercel.

## Prerequisites

- Tài khoản Vercel (vercel.com)
- Git repository đã được kết nối với Vercel

## Các bước triển khai

### 1. Kết nối Repository với Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Click "New Project"
3. Chọn repository chứa code EPath
4. Import project

### 2. Cấu hình Environment Variables

Trong Vercel Dashboard > Project > Settings > Environment Variables, thêm:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `GROQ_API_KEY` | (from console.groq.com/keys) | Production, Preview, Development |

### 3. Deploy

1. Click "Deploy" hoặc push code lên branch đã kết nối
2. Vercel sẽ tự động build và deploy

## Cấu hình Domain (tùy chọn)

1. Vào Project Settings > Domains
2. Thêm domain tùy chỉnh (ví dụ: `epath.edu.vn`)
3. Cập nhật DNS records theo hướng dẫn của Vercel

## Troubleshooting

### Build Fails

1. Kiểm tra Node.js version (yêu cầu: 18.x+)
2. Chạy `npm install` local để xem có lỗi dependencies không
3. Kiểm tra log trong Vercel Dashboard

### Environment Variables không hoạt động

1. Đảm bảo biến đã được thêm đúng trong Vercel Settings
2. Redeploy sau khi thêm biến mới

### i18n Routing lỗi

1. Kiểm tra `middleware.ts` có export `createMiddleware` đúng
2. Đảm bảo locale routes khớp với cấu hình

## CI/CD

### Automatic Deployments

Vercel tự động deploy khi:

- Push lên branch `main` hoặc `master` → Production
- Push lên các branch khác → Preview deployment

### Preview Deployments

Mỗi pull request sẽ tạo một preview deployment với URL riêng.

## Performance Optimization

### Image Optimization

Sử dụng `next/image` cho tất cả images.

### Static Generation

Các trang không thay đổi nên được generate tĩnh.

## Security

### Headers

File `vercel.json` đã cấu hình security headers:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Support

Nếu gặp vấn đề:
1. Kiểm tra Vercel deployment logs
2. Xem Next.js documentation
3. Liên hệ dev team
