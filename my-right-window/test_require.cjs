try {
    console.log("Attempting to require bareactsData.js...");
    const data = require('./src/data/bareactsData.js');
    console.log("Success! File is valid JS.");
} catch (e) {
    console.log("FAILED to require file:");
    console.log(e.stack);
}
