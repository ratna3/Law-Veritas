import { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Font whitelist — system + Google Web Fonts
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = [
  // System / Web-safe fonts
  'arial',
  'georgia',
  'times-new-roman',
  'courier-new',
  'verdana',
  'trebuchet-ms',
  'tahoma',
  'impact',
  'comic-sans-ms',
  // Google Web Fonts
  'roboto',
  'open-sans',
  'lato',
  'montserrat',
  'poppins',
  'raleway',
  'merriweather',
  'nunito',
  'lora',
  'source-serif-pro',
  'playfair-display',
  'pt-serif',
  'crimson-text',
  'libre-baskerville',
  'eb-garamond',
  'inter',
];
ReactQuill.Quill.register(Font, true);

// Font size whitelist
const Size = ReactQuill.Quill.import('formats/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'];
ReactQuill.Quill.register(Size, true);

export default function RichTextEditor({ value, onChange }) {
  // Sanitize Quill output: replace &nbsp; with regular spaces to prevent
  // mid-word line breaks on the published page
  const handleChange = (html) => {
    const sanitized = html ? html.replace(/&nbsp;/g, ' ') : html;
    onChange(sanitized);
  };

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
        onChange={handleChange}
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
          width: 180px;
        }
        .rich-editor-wrapper .ql-snow .ql-picker.ql-size {
          width: 80px;
        }
        .rich-editor-wrapper .ql-snow .ql-picker.ql-header {
          width: 120px;
        }

        /* ========== Font family labels ========== */
        .ql-snow .ql-picker.ql-font .ql-picker-label::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item::before {
          content: 'Default';
        }
        /* System / Web-safe */
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
        /* Google Web Fonts */
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before {
          content: 'Roboto'; font-family: 'Roboto', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="open-sans"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="open-sans"]::before {
          content: 'Open Sans'; font-family: 'Open Sans', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="lato"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="lato"]::before {
          content: 'Lato'; font-family: 'Lato', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="montserrat"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="montserrat"]::before {
          content: 'Montserrat'; font-family: 'Montserrat', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="poppins"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="poppins"]::before {
          content: 'Poppins'; font-family: 'Poppins', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="raleway"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="raleway"]::before {
          content: 'Raleway'; font-family: 'Raleway', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="merriweather"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="merriweather"]::before {
          content: 'Merriweather'; font-family: 'Merriweather', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="nunito"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="nunito"]::before {
          content: 'Nunito'; font-family: 'Nunito', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="lora"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="lora"]::before {
          content: 'Lora'; font-family: 'Lora', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="source-serif-pro"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="source-serif-pro"]::before {
          content: 'Source Serif'; font-family: 'Source Serif Pro', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="playfair-display"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="playfair-display"]::before {
          content: 'Playfair Display'; font-family: 'Playfair Display', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="pt-serif"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="pt-serif"]::before {
          content: 'PT Serif'; font-family: 'PT Serif', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="crimson-text"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="crimson-text"]::before {
          content: 'Crimson Text'; font-family: 'Crimson Text', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="libre-baskerville"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="libre-baskerville"]::before {
          content: 'Libre Baskerville'; font-family: 'Libre Baskerville', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="eb-garamond"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="eb-garamond"]::before {
          content: 'EB Garamond'; font-family: 'EB Garamond', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="inter"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="inter"]::before {
          content: 'Inter'; font-family: 'Inter', sans-serif;
        }

        /* ========== Font family rendering in editor ========== */
        /* System / Web-safe */
        .ql-font-arial { font-family: Arial, sans-serif; }
        .ql-font-georgia { font-family: Georgia, serif; }
        .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
        .ql-font-courier-new { font-family: 'Courier New', monospace; }
        .ql-font-verdana { font-family: Verdana, sans-serif; }
        .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', sans-serif; }
        .ql-font-tahoma { font-family: Tahoma, sans-serif; }
        .ql-font-impact { font-family: Impact, sans-serif; }
        .ql-font-comic-sans-ms { font-family: 'Comic Sans MS', cursive; }
        /* Google Web Fonts */
        .ql-font-roboto { font-family: 'Roboto', sans-serif; }
        .ql-font-open-sans { font-family: 'Open Sans', sans-serif; }
        .ql-font-lato { font-family: 'Lato', sans-serif; }
        .ql-font-montserrat { font-family: 'Montserrat', sans-serif; }
        .ql-font-poppins { font-family: 'Poppins', sans-serif; }
        .ql-font-raleway { font-family: 'Raleway', sans-serif; }
        .ql-font-merriweather { font-family: 'Merriweather', serif; }
        .ql-font-nunito { font-family: 'Nunito', sans-serif; }
        .ql-font-lora { font-family: 'Lora', serif; }
        .ql-font-source-serif-pro { font-family: 'Source Serif Pro', serif; }
        .ql-font-playfair-display { font-family: 'Playfair Display', serif; }
        .ql-font-pt-serif { font-family: 'PT Serif', serif; }
        .ql-font-crimson-text { font-family: 'Crimson Text', serif; }
        .ql-font-libre-baskerville { font-family: 'Libre Baskerville', serif; }
        .ql-font-eb-garamond { font-family: 'EB Garamond', serif; }
        .ql-font-inter { font-family: 'Inter', sans-serif; }

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

        /* Font dropdown styling — make the dropdown scrollable and well-sized */
        .rich-editor-wrapper .ql-snow .ql-picker.ql-font .ql-picker-options {
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
