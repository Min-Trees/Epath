# EPath CMS – Hướng dẫn nhanh

CMS cho phép quản trị viên chỉnh sửa toàn bộ nội dung website (Home, About, Programs,
Partners, Admissions, Events) và website sẽ cập nhật theo thời gian thực.

## 1. Cấu hình Firebase

1. Tạo project tại https://console.firebase.google.com.
2. Bật **Authentication → Email/Password**.
3. Bật **Cloud Firestore** (chế độ production hoặc test tuỳ giai đoạn).
4. Copy config Web SDK vào `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=…
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
NEXT_PUBLIC_FIREBASE_APP_ID=…
```

5. Tạo Service Account (Project settings → Service accounts → Generate new private key)
   và copy các giá trị vào `.env.local`:

```
FIREBASE_ADMIN_PROJECT_ID=…
FIREBASE_ADMIN_CLIENT_EMAIL=…
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n"
```

## 2. Tạo admin đầu tiên

Trong Firebase Console → Authentication → Add user, tạo user với email/password mà
bạn sẽ dùng để đăng nhập.

Sau đó đặt custom claim `role=admin` cho user đó. Có thể dùng Cloud Shell hoặc một
script Node với firebase-admin:

```js
admin.auth().setCustomUserClaims('<UID>', { role: 'admin' })
```

## 3. Seed dữ liệu ban đầu

Cài dependencies cho scripts và chạy seed:

```bash
cd scripts
npm install
npm run seed
```

Script sẽ thêm các giá trị cốt lõi, chương trình, đối tác, FAQ và cấu hình section
trang chủ vào Firestore. Script an toàn khi chạy nhiều lần (bỏ qua nếu collection
đã có dữ liệu).

## 4. Sử dụng

Đăng nhập tại `/admin/login`. Sau khi đăng nhập, bạn có thể:

- Quản lý **Chương trình học**, **Đối tác**, **Sự kiện**, **FAQ**, **Giá trị cốt lõi**,
  **Lộ trình học**, **Thành tích**, **Đội ngũ**, **Quy trình tuyển sinh**.
- Sắp xếp thứ tự, bật/tắt hiển thị.
- Dùng **Page Builder** để bật/tắt và sắp xếp section trên trang chủ.
- Nội dung website công khai sẽ cập nhật ngay khi bạn lưu thay đổi.

## 5. Firestore Security Rules (đề xuất)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for active content
    match /{collection}/{doc} {
      allow read: if resource.data.isActive == true;
    }

    // Only authenticated admins can write
    match /{collection}/{doc} {
      allow write: if request.auth != null
        && request.auth.token.role == 'admin';
    }

    // Pages / sections follow same pattern
    match /pages/{pageId}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.role == 'admin';
    }
  }
}
```