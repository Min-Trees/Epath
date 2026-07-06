# Deploying EPath Website to Vercel

Hướng dẫn từng bước để đẩy code lên GitHub và Vercel.

## Đã chuẩn bị xong (local)

- Repo git đã init tại `D:\Job\Epath` (branch `main`)
- 100 files committed (sạch, không có `.env.local` hay `.data/`)
- `.gitignore` chuẩn Next.js
- `vercel.json` ở root chỉ vào `epath-website/` cho build/install/dev command
- `app/api/chatbot/zalo-webhook/route.ts` đã fix để ghi log vào `/tmp` trên Vercel

## Bước tiếp theo (cần bạn làm)

### 1. Tạo GitHub repo

Vào https://github.com/new:
- Repository name: `epath-website` (hoặc tên bạn muốn)
- Visibility: Private (recommended) hoặc Public
- **KHÔNG** tick "Add README / .gitignore / license" vì repo local đã có
- Click "Create repository"

### 2. Push code lên

Copy URL repo (vd: `https://github.com/<username>/epath-website.git`), rồi chạy trong PowerShell:

```powershell
cd D:\Job\Epath
git remote add origin https://github.com/<username>/epath-website.git
git push -u origin main
```

Lần đầu push sẽ hỏi credentials — dùng Personal Access Token (Settings → Developer settings → Personal access tokens), không phải password thường.

### 3. Kết nối với Vercel

Vào https://vercel.com/new:
- "Import Git Repository" → chọn repo vừa push
- Framework preset: **Other** (vì root repo không phải Next.js)
- Root Directory: để trống (Vercel sẽ đọc `vercel.json` ở root)
- Click "Deploy"

### 4. Thêm Environment Variables trên Vercel

Vào Project → Settings → Environment Variables, thêm cho cả 3 môi trường (Production, Preview, Development):

| Key | Value | Bắt buộc? |
|-----|-------|-----------|
| `GROQ_API_KEY` | `gsk_...` (từ console.groq.com) | Có — chatbot |
| `ZALO_BOT_TOKEN` | `<bot_id>:<secret_key>` từ Zalo Bot Manager | Không — chỉ khi dùng Zalo |
| `ZALO_BOT_WEBHOOK_SECRET` | secret token bạn tự chọn | Không |
| `GOOGLE_SHEETS_ID` | spreadsheet ID | Không |
| `GOOGLE_SHEETS_TAB` | `Sheet1` | Không |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | service account email | Không |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | private key (giữ nguyên `\n`) | Không |

Sau khi thêm env → Vào Deployments → click "Redeploy" để áp dụng.

### 5. Cấu hình Zalo webhook trỏ về Vercel

Sau khi deploy xong, Vercel cho URL dạng `https://epath-school-xxx.vercel.app`.

Gọi 1 lần để set webhook cho Zalo:

```
POST https://epath-school-xxx.vercel.app/api/chatbot/zalo-setup-webhook?url=https://epath-school-xxx.vercel.app/api/chatbot/zalo-webhook
```

(Body để trống. Zalo sẽ verify webhook URL này.)

### 6. Verify

- Mở `https://epath-school-xxx.vercel.app/en` → trang web phải load
- Mở chatbot → gõ "xin chào" → phải có trả lời từ Groq
- Gõ "tôi muốn đăng ký" → form phải tự hiện ra

## Làm việc tiếp theo

Sau khi push xong, workflow bình thường:

```powershell
# Sửa code trong editor...
cd D:\Job\Epath
git add -A
git commit -m "feat: ..."
git push
# Vercel tự động deploy mỗi push (nếu đã bật auto-deploy)
```

## Troubleshooting

**Build fails với "Cannot find module 'next'":**
Vercel không chạy `npm install` trong `epath-website/`. Check lại `vercel.json` ở root repo (KHÔNG phải trong `epath-website/`) — `installCommand` phải là `cd epath-website && npm install`.

**Chatbot không trả lời (luôn fallback):**
- Vào Vercel → Logs → filter `chatbot`
- Nếu thấy `GROQ_API_KEY not configured` → chưa add env var
- Nếu thấy `Groq API error: 401` → key sai

**Zalo webhook không nhận tin:**
- Vào `https://your-app.vercel.app/api/chatbot/zalo-webhook` (GET) → phải trả về `{ ok: true }`
- Nếu 403 → check `ZALO_BOT_WEBHOOK_SECRET` trên Vercel khớp với secret Zalo gửi

**Vercel build log quá dài vì root repo có nhiều file lạ:**
Nếu thấy Vercel scan cả `*.xlsx`, `*.md` ở root → thêm vào `vercel.json`:
```json
"ignoreCommand": "cd epath-website && npx turbo-ignore" 
```
Hoặc chuyển repo root thành `epath-website/` (tạo repo mới, move code).