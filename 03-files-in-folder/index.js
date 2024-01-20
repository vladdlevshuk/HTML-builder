const fs = require('fs').promises;
const path = require('path');
const { stdout } = process;

const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, { withFileTypes: true })
  .then(files =>
    Promise.all(files
      .filter(file => file.isFile())
      .map(async file => {
        const pathFile = path.join(pathFolder, file.name);
        const { name, ext } = path.parse(pathFile);
        const { size } = await fs.stat(pathFile);

        stdout.write(`${name} - ${ext.slice(1)} - ${(size / 1024).toFixed(3)}kb\n`);
      })
    )
  )
  .catch(error => console.error('Ошибка при чтении папки:', error.message));