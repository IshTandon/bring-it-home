const sharp = require('sharp');
const path = require('path');

const SOURCE = path.join(__dirname, '..', 'public', 'icon-source.png');
const OUT = path.join(__dirname, '..', 'public');

const SIZES = [
  { name: 'icon-512x512.png', size: 512 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-180x180.png', size: 180 },
  { name: 'icon-167x167.png', size: 167 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-120x120.png', size: 120 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

async function generateIcons() {
  console.log('Generating icon sizes from', SOURCE);

  for (const { name, size } of SIZES) {
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT, name));
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // OG image: 1200x630, icon centered on navy background with text
  const iconForOG = await sharp(SOURCE)
    .resize(280, 280, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const svgText = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#0A1628"/>
      <text x="600" y="480" text-anchor="middle" font-family="system-ui, sans-serif"
            font-size="40" font-weight="700" fill="white">
        Bring It Home
      </text>
      <text x="600" y="520" text-anchor="middle" font-family="system-ui, sans-serif"
            font-size="18" fill="rgba(255,255,255,0.4)" letter-spacing="4">
        FIFA WORLD CUP 2026
      </text>
    </svg>`;

  await sharp(Buffer.from(svgText))
    .resize(1200, 630)
    .composite([{ input: iconForOG, top: 120, left: 460 }])
    .png()
    .toFile(path.join(OUT, 'og-image.png'));
  console.log('  ✓ og-image.png (1200x630)');

  console.log('Done!');
}

generateIcons().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
