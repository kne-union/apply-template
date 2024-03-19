const {glob} = require('glob');
const fs = require('fs-extra');
const ejs = require('ejs');
const path = require('path');
const textExtensions = require('text-extensions');

const apply = async (dir, to, options) => {
    dir = path.resolve(dir);
    to = path.resolve(to);
    await fs.ensureDir(to);
    const paths = await glob('**/*', {
        cwd: dir, dot: true
    });
    for (let filePath of paths) {
        const targetDir = path.resolve(to, filePath);
        if (textExtensions.indexOf(path.extname(filePath).slice(1)) > -1) {
            const file = await fs.readFile(path.resolve(dir, filePath), 'utf8');
            await fs.ensureDir(path.dirname(targetDir));
            await fs.writeFile(targetDir, ejs.render(file, options));
        } else {
            await fs.copy(path.resolve(dir, filePath), targetDir);
        }
    }
};

module.exports = apply;
