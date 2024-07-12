const path = require('path');
const fs = require('fs');

console.log('执行删除脚本压缩记录');
const localRecordPath = path.resolve(__dirname, 're-commend.json');
const isExsit = fs.existsSync(localRecordPath);
if (isExsit) {
  fs.unlinkSync(localRecordPath);
  console.log('删除成功');
} else {
  console.log('无需删除');
}

process.exit(0);
