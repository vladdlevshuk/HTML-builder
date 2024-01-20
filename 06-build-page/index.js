const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const distFolderPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const indexPath = path.join(distFolderPath, 'index.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const stylesFilePath = path.join(distFolderPath, 'style.css');
const assetsFolderPath = path.join(__dirname, 'assets');
const assetsCopyFolderPath = path.join(distFolderPath, 'assets');
const componentsFolderPath = path.join(__dirname, 'components');

const createDistFolder = async () => {
  try {
    await fsPromises.rm(distFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(distFolderPath, { recursive: true });
    await copyFolder(assetsFolderPath, assetsCopyFolderPath);
    await bundleHtml();
    await bundleCSS();
    console.log('Папка project-dist успешно создана!');
  } catch (error) {
    console.error('Ошибка при создании папки project-dist:', error.message);
  }
};

const copyFolder = async (sourceFolder, targetFolder) => {
  try {
    await fsPromises.rm(targetFolder, { recursive: true, force: true });
    await fsPromises.mkdir(targetFolder, { recursive: true });
    const files = await fsPromises.readdir(sourceFolder, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        const sourcePath = path.join(sourceFolder, file.name);
        const targetPath = path.join(targetFolder, file.name);

        file.isDirectory()
          ? await copyFolder(sourcePath, targetPath)
          : await fsPromises.copyFile(sourcePath, targetPath);
      })
    );
    console.log('Папка assets успешно скопирована!');
  } catch (error) {
    console.error('Ошибка при копировании папки assets:', error.message);
  }
};

const bundleHtml = async () => {
  try {
    const files = await fsPromises.readdir(componentsFolderPath, { withFileTypes: true });
    let templateContent = await fsPromises.readFile(templatePath, 'utf-8');

    await Promise.all(
      files.map(async (file) => {
        const componentName = path.parse(file.name).name;
        const componentPath = path.join(componentsFolderPath, file.name);
        const componentContent = await fsPromises.readFile(componentPath, 'utf-8');
        templateContent = templateContent.replaceAll(`{{${componentName}}}`, componentContent);
      })
    );

    await fsPromises.writeFile(indexPath, templateContent);
    console.log('HTML файл успешно создан!');
  } catch (error) {
    console.error('Ошибка при создании HTML файла:', error.message);
  }
};

const bundleCSS = async () => {
  try {
    const writeStream = fs.createWriteStream(stylesFilePath);
    const files = await fsPromises.readdir(stylesFolderPath, { withFileTypes: true });

    files.forEach((file) => {
      if (file.isFile() && path.parse(file.name).ext === '.css') {
        const filePath = path.join(stylesFolderPath, file.name);
        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.pipe(writeStream);
      }
    });

    console.log('CSS файл успешно создан!');
  } catch (error) {
    console.error('Ошибка при создании CSS файла:', error.message);
  }
};

createDistFolder();