import { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Font whitelist
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = [
  'arial',
  'georgia',
  'times-new-roman',
  'courier-new',
  'verdana',
  'trebuchet-ms',
  'tahoma',
  'impact',
  'comic-sans-ms',
];
ReactQuill.Quill.register(Font, true);

// Font size whitelist
const Size = ReactQuill.Quill.import('formats/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'];
ReactQuill.Quill.register(Size, true);

export default function RichTextEditor({ value, onChange }) {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // Row 1: Font family + size
        [{ font: Font.whitelist }],
        [{ size: Size.whitelist }],

        // Row 2: Headings
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        // Row 3: Text formatting
        ['bold', 'italic', 'underline', 'strike'],

        // Row 4: Color
        [{ color: [] }, { background: [] }],

        // Row 5: Lists & indent
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ indent: '-1' }, { indent: '+1' }],

        // Row 6: Alignment
        [{ align: [] }],

        // Row 7: Links, images, blockquote, code
        ['link', 'image', 'video', 'blockquote', 'code-block'],

        // Row 8: Subscript, superscript, direction
        [{ script: 'sub' }, { script: 'super' }],
        [{ direction: 'rtl' }],

        // Clear formatting
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'align', 'direction',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'script',
  ];

  return (
    <div className="rich-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write your article content here..."
      />

      <style>{`
        .rich-editor-wrapper .ql-toolbar.ql-snow {
          border: 1px solid #d1d5db;
          border-radius: 12px 12px 0 0;
          background: #f8fafc;
          padding: 10px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .rich-editor-wrapper .ql-container.ql-snow {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 12px 12px;
          min-height: 400px;
          font-size: 16px;
          font-family: Georgia, 'Times New Roman', serif;
        }
        .rich-editor-wrapper .ql-editor {
          min-height: 400px;
          padding: 20px 24px;
          line-height: 1.8;
        }
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-editor-wrapper .ql-snow .ql-picker.ql-font {
          width: 160px;
        }
        .rich-editor-wrapper .ql-snow .ql-picker.ql-size {
          width: 80px;
        }
        .rich-editor-wrapper .ql-snow .ql-picker.ql-header {
          width: 120px;
        }

        /* Font family labels */
        .ql-snow .ql-picker.ql-font .ql-picker-label::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item::before {
          content: 'Default';
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
          content: 'Arial'; font-family: Arial, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
          content: 'Georgia'; font-family: Georgia, serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
          content: 'Times New Roman'; font-family: 'Times New Roman', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
          content: 'Courier New'; font-family: 'Courier New', monospace;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
          content: 'Verdana'; font-family: Verdana, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="trebuchet-ms"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="trebuchet-ms"]::before {
          content: 'Trebuchet MS'; font-family: 'Trebuchet MS', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="tahoma"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="tahoma"]::before {
          content: 'Tahoma'; font-family: Tahoma, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="impact"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="impact"]::before {
          content: 'Impact'; font-family: Impact, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="comic-sans-ms"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="comic-sans-ms"]::before {
          content: 'Comic Sans'; font-family: 'Comic Sans MS', cursive;
        }

        /* Font family rendering in editor */
        .ql-font-arial { font-family: Arial, sans-serif; }
        .ql-font-georgia { font-family: Georgia, serif; }
        .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
        .ql-font-courier-new { font-family: 'Courier New', monospace; }
        .ql-font-verdana { font-family: Verdana, sans-serif; }
        .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', sans-serif; }
        .ql-font-tahoma { font-family: Tahoma, sans-serif; }
        .ql-font-impact { font-family: Impact, sans-serif; }
        .ql-font-comic-sans-ms { font-family: 'Comic Sans MS', cursive; }

        /* Size labels */
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: 'Size';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before { content: '10'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before { content: '12'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before { content: '14'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before { content: '16'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before { content: '18'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before { content: '20'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before { content: '24'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="28px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="28px"]::before { content: '28'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before { content: '32'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before { content: '36'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before { content: '48'; }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="64px"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="64px"]::before { content: '64'; }

        /* Size rendering in editor */
        .ql-snow .ql-editor .ql-size-10px { font-size: 10px; }
        .ql-snow .ql-editor .ql-size-12px { font-size: 12px; }
        .ql-snow .ql-editor .ql-size-14px { font-size: 14px; }
        .ql-snow .ql-editor .ql-size-16px { font-size: 16px; }
        .ql-snow .ql-editor .ql-size-18px { font-size: 18px; }
        .ql-snow .ql-editor .ql-size-20px { font-size: 20px; }
        .ql-snow .ql-editor .ql-size-24px { font-size: 24px; }
        .ql-snow .ql-editor .ql-size-28px { font-size: 28px; }
        .ql-snow .ql-editor .ql-size-32px { font-size: 32px; }
        .ql-snow .ql-editor .ql-size-36px { font-size: 36px; }
        .ql-snow .ql-editor .ql-size-48px { font-size: 48px; }
        .ql-snow .ql-editor .ql-size-64px { font-size: 64px; }

        /* Toolbar button focus styling */
        .rich-editor-wrapper .ql-snow.ql-toolbar button:hover,
        .rich-editor-wrapper .ql-snow.ql-toolbar button:focus,
        .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active,
        .rich-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover,
        .rich-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active {
          color: #1a365d;
        }
        .rich-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-editor-wrapper .ql-snow.ql-toolbar button:focus .ql-stroke,
        .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .rich-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
        .rich-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke {
          stroke: #1a365d;
        }
        .rich-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-editor-wrapper .ql-snow.ql-toolbar button:focus .ql-fill,
        .rich-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .rich-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
        .rich-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill {
          fill: #1a365d;
        }
      `}</style>
    </div>
  );
}
