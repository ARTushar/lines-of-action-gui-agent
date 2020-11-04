import fs from 'fs';
import path from 'path';

const allowableFileTypes = ['', '.py', '.py3', '.class'];

const getCommand = (directory, file, ext) => {
  let command;
  if (!ext) {
    command = path.join(directory, file);
  } else if (ext === '.py' || ext === '.py3') {
    command = 'python3 ' + path.join(directory, file);
  } else {
    command = 'java -cp ' + directory + ' ' + file;
  }
  return command;
}
export const getBotFileCommands = (directory) => {
  const fileNames = fs.readdirSync(directory);
  const executableCommands = {};
  for (const file of fileNames) {
    const ext = path.extname(file);
    if (allowableFileTypes.indexOf(ext) !== -1 && file.startsWith('player1')) {
      executableCommands.player1 = getCommand(directory, file, ext);
    } else if(allowableFileTypes.indexOf(ext) !== -1 && file.startsWith('player2')){
      executableCommands.player2 = getCommand(directory, file, ext);
    }
  }
  return executableCommands;
}
