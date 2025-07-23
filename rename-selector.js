const fs = require('fs');
const path = require('path');

const baseDir = './src/app'; // หรือกำหนดจุดเริ่มค้นหาตามต้องการ

function updateSelectorInFile(filePath, folderName) {
  const content = fs.readFileSync(filePath, 'utf8');
  // สร้างชื่อ selector ใหม่
  const newSelector = `selector: 'form-${folderName}'`;
  
  // แทนที่ 'selector: 'app-edit-dialog''
  const updatedContent = content.replace(
    /selector       : 'form-product'/g,
    newSelector
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function findEditDialogFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // ถ้าเป็นโฟลเดอร์ ให้ค้นหาต่อไป
      findEditDialogFiles(fullPath);
    } else if (file === 'form.component.ts') {
      // ดึงชื่อโฟลเดอร์แม่ของโฟลเดอร์ที่ไฟล์อยู่ (2 ระดับ)
      const parentDir = path.dirname(path.dirname(fullPath)); 
      const folderName = path.basename(parentDir);

      updateSelectorInFile(fullPath, folderName);
    }
  });
}

// เริ่มค้นหาจากโฟลเดอร์ที่กำหนด
findEditDialogFiles(baseDir);
