import * as ua from 'universal-analytics';
import * as Sentry from '@sentry/node';
import configstore from './configstore';

export default async function ErrorHandler(
    err: Error,
    clientInfo?: any,
    {
        reportGA = true,
        reportSentry = true
    } : {
        reportGA?: boolean,
        reportSentry?: boolean
    } = {}
): Promise<void> {
    const userID = (configstore.get('user'))
      ? configstore.get('user').id
      : 'None';

    await googlaAnalytics(err, userID, reportGA);
    
    // Sentry
    if (reportSentry) {
        Sentry.init({ dsn: 'https://7564532cd965419da76c20e0593be771@sentry.io/1776450' });
        
        Sentry.configureScope((scope => {
              scope.setUser({ id: userID });
              if (clientInfo) {
                scope.setTags({
                    "OS": clientInfo[1],
                    "Node Version": clientInfo[2],
                    "CPU Count": clientInfo[3],
                    "RAM": clientInfo[4],
                    "CLI Version": clientInfo[5]
              })}
        }));
        Sentry.captureException(err);
        await Sentry.flush();
    }
}

function googlaAnalytics(err: Error, userID: string, reportGA: boolean): Promise<void> {
    return new Promise((resolve, rejects) => {
        const userID = (configstore.get('user'))
          ? configstore.get('user').id
          : 'None';
    
        if (reportGA) {
            const data = configstore.get('analytics');
            const visitor = ua('UA-126138188-2', userID, { uid: data, strictCidFormat : false });
            visitor.exception(err.message, true).send((err, req) => {
                if (!err) {
                    resolve();
                } rejects();
            });
        }
    })
}