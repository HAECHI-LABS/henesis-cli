import { cli } from 'cli-ux';

export const emailPrompt = async (): Promise<string> => {
  return await cli.prompt('email');
};

export const passwordPrompt = async (
  sentence = 'password',
): Promise<string> => {
  return await cli.prompt(sentence, { type: 'hide' });
};

export const confirmPrompt = async (): Promise<boolean> => {
  return await cli.confirm(`(y)es or (n)o`);
};

export const startWait = (sentence: string): void => {
  cli.action.start(sentence);
};

export const endWait = (): void => {
  cli.action.stop();
};

export const concatAndDeDuplicate = (...arrs: any[]) => [
  ...new Set([].concat(...arrs)),
];
