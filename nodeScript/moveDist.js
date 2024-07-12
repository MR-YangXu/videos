const fs = require('fs-extra');
const path = require('path');
const pkg = require('../package');

const pkgName = pkg.name;
const src = `dist/${pkgName}`;
const previewDest = `dist/pre/${pkgName}`;

// 复制到预发布目录
fs.copy(src, path.join(previewDest), { overwrite: true }, () => console.log(`${src}目录移动到了${previewDest}`));
