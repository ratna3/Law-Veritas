import { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './RichTextEditor.css';

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

  const formats = useMemo(() => [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'align', 'direction',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'script',
  ], []);

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

          </div>
  );
}
