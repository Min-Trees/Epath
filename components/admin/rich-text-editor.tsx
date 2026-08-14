'use client'

/**
 * RichTextEditor - TipTap-based editor used across admin pages.
 *
 * Features (core set):
 *   - Bold, Italic, Underline, Strike
 *   - Headings (H1, H2, H3), Paragraph
 *   - Bullet / Ordered lists
 *   - Link
 *   - Undo / Redo
 *
 * Output: HTML string (stored as-is in CMS LocalizedString fields).
 *
 * Multilang:
 *   - When `multilang` is true the editor renders one toolbar + content
 *     per locale (vi/en) stacked vertically.
 *
 * Drafts:
 *   - Auto-saves content to localStorage whenever the user edits.
 *   - On mount, if a saved draft exists for the same `draftKey`, it is
 *     restored (with a "Có bản nháp" banner + Restore/Discard buttons).
 *   - Calling `markSaved()` clears the draft and hides the banner.
 */
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Pilcrow,
  Trash2,
} from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDraft } from '@/lib/use-draft'
import { semanticColors } from '@/lib/design-tokens'

export interface RichTextEditorProps {
  /** Field key, used to namespace localStorage drafts. */
  draftKey: string
  /** Current value (HTML string). Empty string for new content. */
  value: string
  /** Called on every change with the new HTML. */
  onChange: (html: string) => void
  /** Placeholder text when the editor is empty. */
  placeholder?: string
  /** Optional min-height for the editor surface. */
  minHeight?: string
  /** Disable all controls. */
  disabled?: boolean
}

const ToolbarButton = ({
  active,
  onClick,
  disabled,
  title,
  children,
}: {
  active?: boolean
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
}) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    className={cn(
      'h-8 w-8 inline-flex items-center justify-center rounded-md border transition-colors',
      active
        ? 'bg-[#3A53A3] text-white border-[#3A53A3]'
        : 'bg-white text-[#231F20] border-[#e5e7eb] hover:bg-[#F8F9FA]'
    )}
    style={disabled ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
  >
    {children}
  </button>
)

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL (để trống để bỏ liên kết):', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 border-b bg-[#F8F9FA] rounded-t-md"
      style={{ borderColor: 'rgba(35,31,32,0.1)' }}
    >
      <ToolbarButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-[#e5e7eb] mx-1" />
      <ToolbarButton
        title="Đoạn văn"
        active={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 1"
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-[#e5e7eb] mx-1" />
      <ToolbarButton
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Strike"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-[#e5e7eb] mx-1" />
      <ToolbarButton
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Ordered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Link"
        active={editor.isActive('link')}
        onClick={setLink}
      >
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
    </div>
  )
}

function EditorSurface({
  draftKey,
  value,
  onChange,
  placeholder,
  minHeight,
  disabled,
  onSaved,
}: RichTextEditorProps & { onSaved?: () => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Nhập nội dung…',
      }),
    ],
    content: value || '',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  const draft = useDraft<string>({
    key: draftKey,
    value: editor?.getHTML() ?? value,
    initialValue: value,
    enabled: !disabled,
  })

  return (
    <div className="border rounded-md" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
      <Toolbar editor={editor} />
      <div
        className="p-3 prose prose-sm max-w-none focus:outline-none"
        style={{ minHeight: minHeight ?? '160px' }}
      >
        <EditorContent editor={editor} />
      </div>

      {draft.hasDraft && (
        <div
          className="flex items-center justify-between gap-2 text-xs px-3 py-2 border-t bg-[#fff7ed]"
          style={{ borderColor: 'rgba(35,31,32,0.1)', color: semanticColors.text }}
        >
          <span>
            Có bản nháp chưa lưu từ phiên trước. Bấm <strong>Khôi phục</strong> để dùng lại, hoặc <strong>Bỏ</strong> để xoá.
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => draft.restore()}
            >
              Khôi phục
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => draft.discard()}
              style={{ color: semanticColors.cta }}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Bỏ
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Multilang wrapper: two stacked editors with a language label on top.
 * Each locale has its own draftKey.
 */
export function RichTextEditorMultilang({
  fieldKey,
  value,
  onChange,
  placeholder,
  minHeight,
  disabled,
}: Omit<RichTextEditorProps, 'value' | 'onChange' | 'draftKey'> & {
  fieldKey: string
  value: { vi?: string; en?: string } | undefined
  onChange: (next: { vi: string; en: string }) => void
}) {
  const obj: { vi: string; en: string } = {
    vi: value?.vi ?? '',
    en: value?.en ?? '',
  }
  return (
    <div className="space-y-3 border rounded-md p-3" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
      <div>
        <div className="text-xs mb-1" style={{ color: semanticColors.textMuted }}>
          Tiếng Việt
        </div>
        <EditorSurface
          draftKey={`${fieldKey}:vi`}
          value={obj.vi}
          onChange={(html) => onChange({ ...obj, vi: html })}
          placeholder={placeholder}
          minHeight={minHeight}
          disabled={disabled}
        />
      </div>
      <div>
        <div className="text-xs mb-1" style={{ color: semanticColors.textMuted }}>
          English
        </div>
        <EditorSurface
          draftKey={`${fieldKey}:en`}
          value={obj.en}
          onChange={(html) => onChange({ ...obj, en: html })}
          placeholder={placeholder}
          minHeight={minHeight}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export function RichTextEditor(props: RichTextEditorProps) {
  return <EditorSurface {...props} />
}