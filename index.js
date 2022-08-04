const globby = require('globby');
const fs = require('fs-extra');
const ejs = require('ejs');
const path = require('path');

const apply = async (dir, to, options) => {
    dir = path.resolve(dir);
    to = path.resolve(to);
    await fs.emptyDir(to);
    const paths = await globby(dir + '/**/*');
    for (let filePath of paths) {
        const file = await fs.readFile(filePath, 'utf8');
        const targetDir = path.resolve(to, path.relative(dir, filePath));
        await fs.ensureDir(path.dirname(targetDir));
        await fs.writeFile(targetDir, ejs.render(file, options));
    }
};

module.exports = apply;
