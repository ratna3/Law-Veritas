
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Supabase Configuration
const SUPABASE_URL = 'https://tvwfrxndpxxdrtlaemak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2d2ZyeG5kcHh4ZHJ0bGFlbWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTgzOTYsImV4cCI6MjA3OTQ3NDM5Nn0.jcgaWLlLOskJXc9qM8sm5L2IeeytbrwxPlFuKmAZ0ts';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Blog Content
const BLOG_TITLE = "Top High-Paying Law Firms in India (2026)";
const BLOG_CONTENT = `💼 Top High-Paying Law Firms in India (2026)

These firms are widely recognized for offering strong compensation packages to associates — especially freshers from top law schools like NLUs — and excellent career growth:
📌 **Leading Tier-1 Firms**
These firms consistently rank among the highest paying in India:
-	**Cyril Amarchand Mangaldas (CAM)** – Corporate/M&A, Banking & Finance, Competition/Antitrust.
-	**Shardul Amarchand Mangaldas & Co** – Broad practice with strength in corporate, finance, dispute resolution etc.
-	**Khaitan & Co.** – Strong in Banking & Finance, Corporate/M&A, Competition Law.
-	**Trilegal** – Corporate law, M&A and private equity.
-	**J. Sagar Associates (JSA)** – Corporate & regulatory practice.
-	**AZB & Partners** – Corporate/M&A, Banking & Finance, Capital Markets.
-	**S&R Associates** – M&A, Capital Markets, Litigation & Arbitration.
-	**Luthra & Luthra** – Corporate and commercial practice.
📊 *Typical compensation* (fresh associates) at top tier firms often ranges from approximately **₹10–20+ lakh per annum**, and can grow significantly with experience, bonuses, and seniority. Senior associates and partners can earn several ₹30–90+ lakh or more depending on performance and revenue share.

📈 **High-Paying Legal Practice Areas in India**
Certain practice areas attract higher fees and salaries because they involve complex, high-value work and corporate clients:
🏆 **1. Mergers & Acquisitions (M&A)**
•	One of the highest paying and most in-demand areas.
•	Deals involve large corporate transactions where lawyers advise on structure, negotiations, and compliance.
💰 **2. Private Equity & Capital Markets**
•	Involves investment deals, listings, IPOs and fund structuring.
•	Firms pay well for expertise in this niche.
🏦 **3. Banking & Finance**
•	Regulatory and transactional work for banks, lenders and borrowers.
•	A core revenue area for big firms.
📊 **4. Competition/Antitrust Law**
•	Advising on market competition, regulatory filings and compliance.
•	Useful for large corporations; attracts premium billing.
🧠 **5. Technology & Cyber Law**
•	Data protection, digital contracts, AI compliance, cybersecurity.
•	Growing fast as technology adoption rises.
⚖️ **6. Arbitration & Dispute Resolution**
•	Commercial arbitration and ADR are preferred for settling high-value business disputes.
•	Can lead to big payouts, especially in international arbitration.
🧬 **7. Intellectual Property (IP) & Patent Law**
•	Complex, technical specialization (especially patents) can command premium fees.

📌 **Why These Pay More?**
💡 Corporate & transactional law (like M&A, private equity) pays well because:
-	Clients are big companies with substantial budgets.
-	Work often crosses jurisdictions and involves regulatory scrutiny.
-	Firms charge large fees and share a portion as salaries/bonuses. (CollegeDekho)
💡 Specialized niche areas (cyber law, IP, competition) are in growing demand due to digital transformation and global trade.

📌 **Key Skills for High-Paying Legal Roles**
To succeed and earn top compensation:
-	Strong research & drafting
-	Excellent communication
-	Business and commercial understanding
-	Expertise in regulatory and transactional frameworks
-	Ability to work on complex cross-border deals`;

const BLOG_TAGS = ["Legal", "Corporate Law", "High Paying Jobs", "M&A", "India", "Career"];
const BLOG_AUTHOR = "System Admin";
const IMAGE_PATH_LOCAL = 'temp_image.jpg';

async function main() {
    try {
        console.log('Starting upload process...');

        // 1. Upload Image
        console.log(`Reading image from: ${IMAGE_PATH_LOCAL}`);
        const fileContent = fs.readFileSync(IMAGE_PATH_LOCAL);
        const fileExt = path.extname(IMAGE_PATH_LOCAL); // .jpg
        const fileName = `blog-image-${Date.now()}${fileExt}`;

        console.log(`Uploading to bucket 'images' as: ${fileName}`);
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, fileContent, {
                contentType: 'image/jpeg'
            });

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        console.log('Image uploaded successfully.');

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

        console.log(`Public URL: ${publicUrl}`);

        // 3. Insert Blog Post
        const slug = BLOG_TITLE
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const finalSlug = `${slug}-${Math.floor(Date.now() / 1000)}`;
        console.log(`Generated slug: ${finalSlug}`);

        const { data: insertData, error: insertError } = await supabase
            .from('blogs')
            .insert([
                {
                    title: BLOG_TITLE,
                    content: BLOG_CONTENT,
                    author: BLOG_AUTHOR,
                    slug: finalSlug,
                    tags: BLOG_TAGS,
                    images: [publicUrl], // Array of strings (URLs)
                    published: true,
                    updated_at: new Date().toISOString()
                }
            ]);

        if (insertError) {
            throw new Error(`DB Insert failed: ${insertError.message}`);
        }

        console.log('Blog post created successfully!');

    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();
