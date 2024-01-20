const fs = require('fs').promises;
const path = require('path');

async function copyDir(sourceDir, targetDir) {
  try {
    await fs.mkdir(targetDir, { recursive: true });

    const [sourceFiles, targetFiles] = await Promise.all([
      fs.readdir(sourceDir),
      fs.readdir(targetDir),
    ]);

    await Promise.all(
      targetFiles
        .filter((file) => !sourceFiles.includes(file))
        .map((file) => fs.unlink(path.join(targetDir, file)))
    );

    await Promise.all(
      sourceFiles.map(async (file) => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);

        const stats = await fs.stat(sourcePath);

        if (stats.isDirectory()) {
          await copyDir(sourcePath, targetPath);
        } else {
          await fs.copyFile(sourcePath, targetPath);
        }
      })
    );

    console.log('Директория успешно скопирована');
  } catch (error) {
    console.error('Error!', error.message);
  }
}

const sourceFolder = path.join(__dirname, 'files');
const targetFolder = path.join(__dirname, 'files-copy');

copyDir(sourceFolder, targetFolder);