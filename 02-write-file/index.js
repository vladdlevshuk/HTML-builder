console.log('\nПривет! Введи текст: \n');

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pathFile = path.join(__dirname, 'text.txt');
const input = readline.createInterface(process.stdin);
const output = fs.createWriteStream(pathFile);

const closeProcess = () => {
  console.log('\nПока!\n');
  process.exit();
};

input.on('line', (message) => {
  if (message === 'exit') {
    closeProcess();
  } else {
    output.write(`${message} `);
  }
});

process.on('SIGINT', closeProcess);