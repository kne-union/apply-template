const {glob} = require('glob');
const fs = require('fs-extra');
const ejs = require('ejs');
const path = require('path');
const textExtensions = require('text-extensions');

const EXTENSIONLESS_TEMPLATE_FILES = new Set([
    'Dockerfile',
    'dockerignore',
    'gitignore',
    '.dockerignore'
]);

const shouldRenderAsTemplate = (filePath) => {
    const ext = path.extname(filePath).slice(1);
    if (textExtensions.indexOf(ext) > -1) {
        return true;
    }
    return EXTENSIONLESS_TEMPLATE_FILES.has(path.basename(filePath));
};

const apply = async (dir, to, options) => {
    dir = path.resolve(dir);
    to = path.resolve(to);
    await fs.ensureDir(to);
    const paths = await glob('**/*', {
        cwd: dir, dot: true, nodir: true
    });
    for (let filePath of paths) {
        const sourcePath = path.resolve(dir, filePath);
        const targetDir = path.resolve(to, filePath);
        if (shouldRenderAsTemplate(filePath)) {
            const file = await fs.readFile(sourcePath, 'utf8');
            await fs.ensureDir(path.dirname(targetDir));
            await fs.writeFile(targetDir, ejs.render(file, options));
        } else {
            await fs.copy(sourcePath, targetDir);
        }
    }
};

module.exports = apply;
