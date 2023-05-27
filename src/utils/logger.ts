import { appendFile } from 'fs';

const simpleLogger = (
  loc: string,
  fn: string,
  data: any,
  saveToMemory: boolean = false
) => {
  if (process.env.LOGGER !== 'true') return;

  const time = new Date().toLocaleDateString('en-gb', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const logMessage = `\n${time} @ ${loc}\nCalled ${fn} - ${JSON.stringify(data)}\n**`;

  if (process.env.LOGGER_VERBOSE === 'true') {
    console.log(logMessage);
  }

  if (saveToMemory) {
    appendFile('./log.txt', logMessage, (err) => {
      if (err) throw err;
    });
  }
};

export { simpleLogger as log };
