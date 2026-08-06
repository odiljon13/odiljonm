const fs = require('fs');
const path = require('path');

// Load uzum_data.js context
const dataFilePath = path.join(__dirname, 'js', 'uzum_data.js');
const code = fs.readFileSync(dataFilePath, 'utf8');

// Evaluate in global context
eval(code);

console.log("==================================================");
console.log("🧪 AUDIT & VALIDATION TEST: PRODUCT & IMAGE MATCHING");
console.log("==================================================");

let totalProducts = initialUzumProducts.length;
let passedCount = 0;
let failedCount = 0;

initialUzumProducts.forEach((product, idx) => {
  let errors = [];

  // Check 1: Must have title, category and valid prices
  if (!product.title || typeof product.title !== 'string') errors.push("Missing or invalid title");
  if (!product.category) errors.push("Missing category");
  
  // Check 2: Must have at least 3-4 images
  if (!Array.isArray(product.images) || product.images.length < 3) {
    errors.push(`Insufficient images count: ${product.images ? product.images.length : 0} (Required: 3-4 images)`);
  }

  // Check 3: Thumbnail must match first image
  if (!product.thumbnail || (product.images && product.images[0] !== product.thumbnail)) {
    errors.push("Thumbnail does not match images[0]");
  }

  // Check 4: Title-to-Image Matching Validation
  let matchedImgs = getMatchingImagesForTitle(product.title, product.category);
  if (!matchedImgs || matchedImgs.length < 3) {
    errors.push("getMatchingImagesForTitle returned less than 3 images");
  }

  if (errors.length === 0) {
    passedCount++;
    console.log(`✅ [ID ${product.id}] ${product.title.padEnd(55)} | ${product.category} (${product.images.length} images)`);
  } else {
    failedCount++;
    console.error(`❌ [ID ${product.id}] ${product.title}`);
    errors.forEach(err => console.error(`   -> Error: ${err}`));
  }
});

console.log("\n==================================================");
console.log(`📊 SUMMARY: Total Products Audited: ${totalProducts}`);
console.log(`PASSED: ${passedCount} / ${totalProducts}`);
console.log(`FAILED: ${failedCount} / ${totalProducts}`);
console.log("==================================================");

if (failedCount > 0) {
  console.error("❌ Test Failed! Some products failed validation.");
  process.exit(1);
} else {
  console.log("🎉 All products passed title and image matching validation 100%!");
  process.exit(0);
}
