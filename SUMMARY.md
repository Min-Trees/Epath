# Page Builder Seed – Work Summary

> Ngày thực hiện: **2026-08-18**
> Mục tiêu: đồng bộ nội dung page builder + các collection CMS từ nguồn `D:\Job\Epath\data-content\` (4 file HTML).

---

## 1. Bối cảnh

- Trang `/admin/page-builder` đang trống vì:
  - `pages/{pageId}/sections` (subcollection) – chưa có document nào
  - Các collection top-level (`coreValues`, `programs`, `testimonials` …) – thiếu hoặc rỗng
- Người dùng yêu cầu **seed toàn bộ page** (home / about / programs / partners / admissions / events) từ dữ liệu brochure & website.

## 2. Nguồn dữ liệu

| File | Kích thước | Dùng cho |
| --- | --- | --- |
| `data-content/Sitemap.html` | 29 KB | Cấu trúc site, FAQs |
| `data-content/Nội dung website.html` | 60 KB | Core values, giới thiệu, vision, mission, milestones |
| `data-content/Nội dung Brochure.html` | 46 KB | Chương trình (programs), partners, admission steps |
| `data-content/Sheet2.html` | 2.5 KB | Sự kiện & lễ hội thường niên |

Mọi chuỗi đều được chuẩn hóa song ngữ **Vi – Anh** theo `LocalizedString` schema trong `lib/cms-types.ts`.

## 3. Thay đổi code

### 3.1. File chính

`app/api/cms/seed/route.ts` được viết lại hoàn toàn, bổ sung:

1. **`PageSectionSeed` type** – mapping cho `PageSection` của page builder
   ```ts
   type PageSectionSeed = {
     id: string
     type: SectionType
     title: { vi: string; en: string }
     subtitle?: { vi: string; en: string }
     body?: { vi: string; en: string }
     order: number
     isActive: boolean
   }
   ```

2. **`pageSectionsSeed` map** – 6 page × section:

   | Page | Sections (type – order) |
   | --- | --- |
   | `home` | hero(0) · intro(1) · vision(2) · mission(3) · statistics(5) · whyEdmentum(6) · cta(7) |
   | `about` | hero(0) · intro(1) · vision(2) · mission(3) · coreValues(4) · learningPathways(5) · statistics(6) · achievements(7) · cta(8) |
   | `programs` | hero(0) · intro(1) · learningPathways(2) · cta(3) |
   | `partners` | hero(0) · partners(1) · cta(2) |
   | `admissions` | hero(0) · admissionSteps(1) · faqs(2) · cta(3) |
   | `events` | hero(0) · cta(1) |

3. **`seedData`** mở rộng – 13 collection:

   | Collection | # docs | Nguồn |
   | --- | --- | --- |
   | `coreValues` | 6 | "Giá trị cốt lõi" trong brochure |
   | `statistics` | 5 | 10+ năm · 4 cấp · 60+ khóa · 3 đối tác · 100% cá nhân hóa |
   | `admissionSteps` | 5 | Mô hình Blended Learning 5 bước |
   | `learningPathways` | 4 | Kindy / Elementary / Middle / High |
   | `programs` | 9 | SpeedUp English, Academic Foundation, Base/Prime Path, Dual Diploma, Fulltime Homeschool, Personal Development |
   | `partners` | 3 | Edmentum, Cambridge ESOL, FabLab EIU |
   | `testimonials` | 4 | Phụ huynh / học sinh các cấp |
   | `faqs` | 5 | Câu hỏi tuyển sinh & chương trình |
   | `events` | 4 | Trung thu, Halloween, Giáng sinh, Năm mới |
   | `achievements` | 3 | Cambridge certs, Olympiads, Skill Portfolio |
   | `siteSettings` | 1 | Địa chỉ 38 Trần Phú + contact |
   | `heroContent` | 6 | Một bản ghi / `pageId` (home, about, programs, partners, admissions, events) |
   | `aboutContent` | 1 | Intro/Vision/Mission song ngữ + 4 milestones 2014→2025 |

4. **POST handler** ghi vào **cả top-level collection lẫn subcollection**:

   ```ts
   // 1) Top-level collections (existing behaviour)
   for (const [collectionName, items] of Object.entries(seedData)) { … }

   // 2) Page builder subcollection
   for (const [pageId, sections] of Object.entries(pageSectionsSeed)) {
     const col = db.collection(CollectionNames.pages).doc(pageId).collection('sections')
     for (const s of sections) {
       const { id, type, order, isActive, ...rest } = s
       await col.doc(id).set(
         { type, order, isActive, pageId, data: { ...rest }, createdAt, updatedAt },
         { merge: true }
       )
     }
   }
   ```

   Cấu trúc document khớp với `PageSection` interface trong `lib/cms-types.ts` (`type/order/isActive/pageId` ở top level; `title/subtitle/body` chứa trong `data`).

### 3.2. File không thay đổi (nhưng phụ thuộc)

| File | Vai trò |
| --- | --- |
| `lib/cms-types.ts` | Định nghĩa `PageSection`, `PageSlug`, `SectionType`, `CollectionNames`, các schema Zod cho từng collection |
| `lib/pages-repo.ts` | `getPageSections`, `upsertPageSection`, `deletePageSection`, `reorderPageSections` đọc/ghi `pages/{pageId}/sections` |
| `lib/page-renderer.tsx` | Renderer động theo `pageId`, dùng `SECTION_RENDERERS` + `DEFAULT_SECTIONS` |
| `components/admin/page-sections-editor.tsx` | UI cho admin sắp xếp / bật tắt / sửa section |
| `app/api/cms/pages/sections/route.ts` | CRUD API cho page sections |
| `app/api/public/cms/route.ts` + `lib/use-public-cms.ts` | Bundle CMS cho frontend render |

## 4. Kiểm tra

### 4.1. Compile

```
Compiled /api/cms/seed in 368ms (1056 modules)
GET /api/cms/seed 200 in 449ms
```

Không lỗi TypeScript, không cảnh báo schema.

### 4.2. POST thực tế

```bash
curl -X POST http://localhost:3000/api/cms/seed
```

Response:

```json
{
  "success": true,
  "message": "Seed data created successfully",
  "collections": ["coreValues","statistics","admissionSteps","learningPathways",
                   "programs","partners","testimonials","faqs","events",
                   "achievements","siteSettings","heroContent","aboutContent"],
  "pages": ["home","about","programs","partners","admissions","events"],
  "results": {
    "created": [
      /* 56 collection items + 20 page sections = 76 documents */,
    ],
    "errors": []
  }
}
```

- 56 documents trong 13 collection top-level
- 20 documents trong `pages/{pageId}/sections` (subcollection)

## 5. Tác động lên các trang

| URL | Sections sẽ render |
| --- | --- |
| `/[locale]` (home) | hero → intro → vision → mission → statistics → whyEdmentum → cta |
| `/[locale]/about` | hero → intro → vision → mission → coreValues → learningPathways → statistics → achievements → cta |
| `/[locale]/programs` | hero → intro → learningPathways → cta |
| `/[locale]/partners` | hero → partners → cta |
| `/[locale]/admissions` | hero → admissionSteps → faqs → cta |
| `/[locale]/events` | hero → cta |

## 6. Điểm cần lưu ý / việc tiếp theo

1. **Không reset dữ liệu cũ** – mỗi lần POST seed sẽ `add()` thêm documents mới (đã thấy 76 documents mới được thêm). Khi cần reset, có thể thêm query `?reset=true` để xóa collection trước khi ghi.
2. **`heroContent` collection** đã có thêm 6 bản ghi – cần kiểm tra `app/[locale]/page.tsx` để chắc chắn nó đọc `heroContent` theo `pageId` chứ không chỉ lấy document đầu tiên.
3. **`imageUrl` rỗng** – tất cả logo/ảnh bìa đang để trống, cần upload qua API `/api/admin/upload` và cập nhật lại sau.
4. **Admin UI kiểm tra**:
   - `/admin/page-builder` → chọn từng page để xem section order, isActive, title/subtitle/body.
   - `/admin/core-values`, `/admin/programs`, `/admin/testimonials`, `/admin/statistics`, `/admin/pathways`, `/admin/admission-steps`, `/admin/partners`, `/admin/faqs`, `/admin/achievements` (nếu có) – để chỉnh sửa trực tiếp.
5. **Locale EN** cần review lại bản dịch (đặc biệt phần brochure) trước khi public.
6. **Schema validation**: Một số trường `icon` / `slug` / `category` dùng string literals (`'kindergarten'`, `'Route'`) – cần đảm bảo admin form validate đúng enum khi sửa.

## 7. Tóm tắt nhanh

- ✅ Thêm `pageSectionsSeed` cho 6 page
- ✅ Đồng bộ 13 collection top-level
- ✅ Mở rộng POST handler ghi vào `pages/{pageId}/sections`
- ✅ Đã chạy thực tế – 76 documents mới, `errors: []`
- ⚠️ Chưa reset collection cũ
- ⚠️ Cần upload ảnh/logo sau khi seed