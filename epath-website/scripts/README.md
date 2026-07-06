# Dev scripts

PowerShell scripts để chạy dev server và tunnel nhanh hơn.

## Yêu cầu

- Node.js + npm
- PowerShell 5+ (có sẵn trên Windows)
- `ngrok` đã cài và đã `ngrok config add-authtoken <token>` một lần

## Cách dùng

```powershell
# Chỉ chạy Next.js dev server (đọc .env.local tự động)
.\scripts\start-dev.ps1

# Chỉ chạy ngrok tunnel tới localhost:3000
.\scripts\start-tunnel.ps1

# Cả hai cùng lúc (dev server ở cửa sổ hiện tại, tunnel ở cửa sổ phụ)
.\scripts\start-stack.ps1
```

Sau khi tunnel chạy, copy URL `https://xxx.ngrok-free.app` rồi thêm `/api/chatbot/zalo-webhook` → paste vào Zalo OA webhook settings.

## Đổi port

```powershell
.\scripts\start-dev.ps1 -Port 3001
.\scripts\start-tunnel.ps1 -Port 3001
.\scripts\start-stack.ps1 -Port 3001 -Region ap
```

`start-stack.ps1 -Region ap` giảm latency vì server ngrok gần VN hơn.

## File `.env.example`

Copy `scripts/.env.example` thành `.env.local` (đã có sẵn), điền key thật.
Script sẽ tự động load `.env.local` vào environment trước khi chạy `npm run dev`.