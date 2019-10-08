// Henesis CLI undefined error Handling
import * as ua from 'universal-analytics';
import * as Sentry from '@sentry/node';
import configstore from './configstore';
import { CLIError } from '@oclif/errors';

export async function ErrorHandler(
      err: CLIError,
      userInfo?: any[],
      {
          reportGA = true,
          reportSentry = true
      } : {
        reportGA?: boolean,
        reportSentry?: boolean
      } = {}
    ): Promise<void> {
    // Bootstraping
    const userID = (configstore.get('user'))
      ? configstore.get('user').id
      : 'Not Login';

    // Google Analytics
    if (reportGA === true) {
        const data = configstore.get('analytics');
        const visitor = ua('UA-126138188-2', userID, { uid: data, strictCidFormat : false });
        visitor.exception(err.message, true).send();
    }
    
    // Sentry
    if (reportSentry === true) {
        Sentry.init({ dsn: 'https://84f8992a0a26492ea95ee8bf28b0029c@sentry.io/1767699' });

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