const fs = require('fs');
const path = 'e:/Law-Veritas/my-right-window/src/data/bareactsData.js';

try {
    const data = fs.readFileSync(path, 'utf8');
    const lines = data.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('Bharatiya Sakshya Adhiniyam')) {
            console.log(`Found at line ${index + 1}: ${line.substring(0, 100)}...`);
        }
    });
} catch (err) {
    console.error(err);
}
