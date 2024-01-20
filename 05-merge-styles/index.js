const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');
    const distFolder = path.join(__dirname, 'project-dist');
    const bundleFilePath = path.join(distFolder, 'bundle.css');

    const styleFiles = await fs.readdir(stylesFolder);

    const stylesArray = await Promise.all(
      styleFiles
        .filter(file => path.extname(file) === '.css')
        .map(async file => await fs.readFile(path.join(stylesFolder, file), 'utf-8'))
    );

    await fs.writeFile(bundleFilePath, stylesArray.join('\n'));

    console.log('Стили успешно объединены в файл bundle.css');
  } catch (error) {
    console.error('Error!', error.message);
  }
}

mergeStyles();