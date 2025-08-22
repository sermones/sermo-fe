import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG 아이콘 템플릿
const iconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#000000"/>
  <circle cx="256" cy="256" r="128" fill="#ffffff"/>
  <path d="M256 160 L272 224 L352 224 L288 272 L304 336 L256 288 L208 336 L224 272 L160 224 L240 224 Z" fill="#000000"/>
</svg>
`;

// 아이콘 크기 배열
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' }
];

async function generateIcons() {
  const publicDir = path.join(__dirname, '../public');
  
  // public 디렉토리가 없으면 생성
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // SVG 버퍼 생성
  const svgBuffer = Buffer.from(iconSVG);

  // 각 크기별로 PNG 생성
  for (const icon of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(publicDir, icon.name));
      
      console.log(`✅ Generated: ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Error generating ${icon.name}:`, error);
    }
  }

  console.log('🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
