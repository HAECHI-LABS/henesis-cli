import * as ua from 'universal-analytics';
import * as Sentry from '@sentry/node';
import configstore from './configstore';

export async function ErrorHandler(
    err: Error,
    userInfo?: any,
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
      : 'Not Login';

    if (reportGA === true) {
        const data = configstore.get('analytics');
        const visitor = ua('UA-126138188-2', userID, { uid: data, strictCidFormat : false });
        visitor.exception(err.message, true).send();
    }
    
    // Sentry
    if (reportSentry === true) {
        Sentry.init({ dsn: 'https://7564532cd965419da76c20e0593be771@sentry.io/1776450' });

        (userInfo)
          ? Sentry.configureScope((scope => {
              scope.setUser({ id: userID }),
              scope.setTags({
                  "OS": userInfo[1],
                  "Node Version": userInfo[2],
                  "CPU Count": userInfo[3],
                  "RAM": userInfo[4],
                  "CLI Version": userInfo[5]
              })
          }))
          : Sentry.configureScope((scope => {
              scope.setUser({ id: userID })
          }));

        Sentry.captureException(err);
    }
}