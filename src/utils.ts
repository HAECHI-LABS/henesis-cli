import { cli } from 'cli-ux';
import configstore from './common/configstore';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
const now = dayjs().utc();

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

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatNumbers = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getStartOfThisMonth = (): Date => {
  return now.startOf('month').toDate();
};

export const getStartOfLastMonth = (): Date => {
  return now
    .subtract(1, 'month')
    .startOf('month')
    .toDate();
};

export const getEndOfLastMonth = (): Date => {
  return dayjs(getStartOfThisMonth())
    .subtract(1, 'millisecond')
    .toDate();
};

export const getSpecificDayOfMonth = (day: number): Date => {
  return now
    .set('day', day)
    .startOf('day')
    .toDate();
};

export const startOfDay = (hour: number): Date => {
  return now
    .set('hour', hour)
    .startOf('hour')
    .toDate();
};

export const getUserProperty = (property: string): string => {
  const user = configstore.get('user');
  if (!user) {
    throw new Error(
      'In order to use the Henesis CLI, you need to login first.\n' +
        'Please use the henesis login command to get started.',
    );
    //TODO: Enhancement: redirect to login prompt
  }

  if (!user[property]) {
    throw new Error('There is no such property.');
  }
  return user[property];
};
