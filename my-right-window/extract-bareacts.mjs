import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PDF files mapping with metadata
const pdfFiles = [
    {
        filename: 'the_constitution_of_india.pdf',
        id: 'constitution-of-india',
        title: 'Constitution of India',
        category: 'constitutional',
        description: 'The supreme law of India, laying down the framework of political principles, establishing government structure, and defining fundamental rights and duties.',
        year: '1950'
    },
    {
        filename: 'bns.pdf',
        id: 'bharatiya-nyaya-sanhita',
        title: 'Bharatiya Nyaya Sanhita (BNS)',
        category: 'criminal',
        description: 'The new criminal code of India replacing the Indian Penal Code (IPC), defining offenses and their punishments.',
        year: '2023'
    },
    {
        filename: 'bnss.pdf',
        id: 'bharatiya-nagarik-suraksha-sanhita',
        title: 'Bharatiya Nagarik Suraksha Sanhita (BNSS)',
        category: 'criminal',
        description: 'The new code of criminal procedure replacing CrPC, governing the procedural aspects of criminal law.',
        year: '2023'
    },
    {
        filename: 'bsa.pdf',
        id: 'bharatiya-sakshya-adhiniyam',
        title: 'Bharatiya Sakshya Adhiniyam (BSA)',
        category: 'criminal',
        description: 'The new evidence law replacing the Indian Evidence Act, governing the admissibility of evidence in courts.',
        year: '2023'
    },
    {
        filename: 'the_code_of_civil_procedure,_1908.pdf',
        id: 'code-of-civil-procedure',
        title: 'Code of Civil Procedure, 1908',
        category: 'civil',
        description: 'The procedural law governing civil suits in Indian courts, including provisions for jurisdiction, pleadings, and execution of decrees.',
        year: '1908'
    },
    {
        filename: 'LIMITATION ACT.pdf',
        id: 'limitation-act',
        title: 'Limitation Act, 1963',
        category: 'civil',
        description: 'Prescribes the time limits within which civil suits and legal proceedings must be filed.',
        year: '1963'
    },
    {
        filename: 'ICA.pdf',
        id: 'indian-contract-act',
        title: 'Indian Contract Act, 1872',
        category: 'commercial',
        description: 'Governs the formation, performance, and enforcement of contracts in India.',
        year: '1872'
    },
    {
        filename: 'negotiable_instruments_act,_1881.pdf',
        id: 'negotiable-instruments-act',
        title: 'Negotiable Instruments Act, 1881',
        category: 'commercial',
        description: 'Defines and governs promissory notes, bills of exchange, and cheques in commercial transactions.',
        year: '1881'
    },
    {
        filename: 'the_arbitration_and_conciliation_act,_1996_act_no._26_of_1996.pdf',
        id: 'arbitration-act',
        title: 'Arbitration and Conciliation Act, 1996',
        category: 'commercial',
        description: 'Provides the legal framework for domestic and international commercial arbitration and conciliation.',
        year: '1996'
    },
    {
        filename: 'tpa.pdf',
        id: 'transfer-of-property-act',
        title: 'Transfer of Property Act, 1882',
        category: 'commercial',
        description: 'Governs the transfer of property between living persons, including sale, mortgage, lease, and gift.',
        year: '1882'
    }
];

async function extractTextFromPdf(filePath) {
    try {
        const data = new Uint8Array(fs.readFileSync(filePath));
        const doc = await getDocument({ data, useSystemFonts: true }).promise;

        let fullText = '';
        const numPages = doc.numPages;
        console.log(`    Pages: ${numPages}`);

        for (let i = 1; i <= numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();

            // Sort items roughly to ensure reading order (sometimes PDF order is weird)
            // But usually standard PDFs are okay. Let's trust default order for now but handle line breaks.

            let pageText = '';
            let lastY = -1;
            let lastHeight = 0;

            const items = textContent.items;

            for (const item of items) {
                if (lastY === -1) {
                    pageText += item.str;
                } else {
                    const diffY = Math.abs(item.transform[5] - lastY);
                    // If vertical distance is significant (e.g. > 20% of font height), it's a new line
                    if (diffY > (item.height || 10) * 0.5) {
                        pageText += '\n' + item.str;
                    } else {
                        // Same line
                        pageText += ' ' + item.str;
                    }
                }
                lastY = item.transform[5];
                lastHeight = item.height;
            }

            fullText += pageText + '\n\n';

            if (i % 50 === 0) {
                console.log(`    Processed page ${i}/${numPages}`);
            }
        }

        return fullText;
    } catch (error) {
        console.error(`Error extracting text from ${filePath}:`, error.message);
        return '';
    }
}

function cleanText(text) {
    let cleaned = text
        // Basic normalization
        .replace(/\r\n/g, '\n')

        // Remove known garbage patterns (Kruti Dev/mangled Hindi common in Indian Gazettes)
        // Hkkx = Bhaag (Part), [k.M = Khand (Section), etc.
        .replace(/vlk\/kkj\.k/g, '') // EXTRAORDINARY
        .replace(/Hkkx/g, '') // Part
        .replace(/\[k\.M/g, '') // Khand
        .replace(/izkf\/kdkj/g, '') // Authority
        .replace(/la\[;k/g, '') // Number
        .replace(/fnuka/g, '') // Date
        .replace(/ftLVªh/g, '') // Registry
        .replace(/lkae/g, '')
        .replace(/vkns'k/g, '') // Order
        .replace(/vf\/u;e/g, '') // Adhiniyam
        .replace(/¼\s*\d+\s*½/g, '') // (Number) in Hindi parens roughly
        .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters (often residue)

        // Fix spaced out headings (P R E L I M I N A R Y -> PRELIMINARY)
        .replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])\s+([A-Z])\b/g, '$1$2$3$4')
        .replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])\b/g, '$1$2$3')

        // Remove Page numbers and header junk
        .replace(/^\s*\d+\s*$/gm, '') // Lines with just numbers
        .replace(/THE GAZETTE OF INDIA/gi, '')
        .replace(/EXTRAORDINARY/gi, '')
        .replace(/PART II/gi, '')
        .replace(/Section 1/gi, '') // Often repeated in headers

        // Fix Formatting
        .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
        .replace(/[ \t]{2,}/g, ' ') // Collapse multiple spaces/tabs only, preserve newlines
        .trim();

    return cleaned;
}

function getPreview(text, length = 500) {
    const cleaned = text.substring(0, length).trim();
    return cleaned + (text.length > length ? '...' : '');
}

async function main() {
    console.log('Starting PDF extraction with pdfjs-dist...\n');

    const bareactsDir = path.join(__dirname, 'public', 'bareacts');
    const outputPath = path.join(__dirname, 'src', 'data', 'bareactsData.js');

    const bareacts = {
        constitutional: [],
        criminal: [],
        civil: [],
        commercial: []
    };

    for (const pdfInfo of pdfFiles) {
        const filePath = path.join(bareactsDir, pdfInfo.filename);

        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${pdfInfo.filename}`);
            continue;
        }

        console.log(`Processing: ${pdfInfo.title}...`);

        const fullText = await extractTextFromPdf(filePath);
        const cleanedText = cleanText(fullText);
        const preview = getPreview(cleanedText);
        const wordCount = cleanedText.split(/\s+/).filter(w => w.length > 0).length;

        const actData = {
            id: pdfInfo.id,
            title: pdfInfo.title,
            category: pdfInfo.category,
            description: pdfInfo.description,
            year: pdfInfo.year,
            pdfPath: `/bareacts/${pdfInfo.filename}`,
            preview: preview,
            wordCount: wordCount,
            content: cleanedText
        };

        bareacts[pdfInfo.category].push(actData);
        console.log(`  ✓ Extracted ${wordCount} words\n`);
    }

    // Escape backticks and template literals in content for JS string
    const escapeForJS = (obj) => {
        return JSON.stringify(obj, null, 2)
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\${/g, '\\${');
    };

    // Generate the JS data file
    const jsContent = `// Auto-generated file - Do not edit manually
// Generated on: ${new Date().toISOString()}

export const CATEGORIES = {
  constitutional: {
    id: 'constitutional',
    title: 'Constitutional Laws',
    icon: '⚖️',
    description: 'Fundamental laws and constitutional provisions'
  },
  criminal: {
    id: 'criminal',
    title: 'Criminal Laws',
    icon: '🏛️',
    description: 'Laws governing crimes and criminal procedures'
  },
  civil: {
    id: 'civil',
    title: 'Civil Laws',
    icon: '📋',
    description: 'Laws governing civil procedures and disputes'
  },
  commercial: {
    id: 'commercial',
    title: 'Commercial Laws',
    icon: '💼',
    description: 'Laws governing business and commercial transactions'
  }
};

export const BAREACTS = ${JSON.stringify(bareacts, null, 2)};

export default BAREACTS;
`;

    // Ensure the data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, jsContent, 'utf8');

    console.log('\n✓ Data file generated successfully!');
    console.log(`  Location: ${outputPath}`);
    console.log(`  Total acts: ${Object.values(bareacts).flat().length}`);

    // Print summary
    let totalWords = 0;
    for (const category of Object.keys(bareacts)) {
        const categoryWords = bareacts[category].reduce((sum, act) => sum + act.wordCount, 0);
        totalWords += categoryWords;
        console.log(`  ${category}: ${bareacts[category].length} acts, ${categoryWords} words`);
    }
    console.log(`  Total words extracted: ${totalWords}`);
}

main().catch(console.error);
