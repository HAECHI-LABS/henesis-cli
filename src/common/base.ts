import Command from '@oclif/command';
import * as os from 'os';
import configstore from './configstore';
import ua from 'universal-analytics';
import { confirmPrompt } from '../utils';
import UIDGenerator from 'uid-generator';
import { CLIError } from '@oclif/errors';
import * as Sentry from '@sentry/node';

// See https://developers.whatismybrowser.com/useragents/
const osVersionMap: { [os: string]: { [release: string]: string } } = {
  darwin: {
    '1.3.1': '10_0_4',
    '1.4.1': '10_1_0',
    '5.1': '10_1_1',
    '5.2': '10_1_5',
    '6.0.1': '10_2',
    '6.8': '10_2_8',
    '7.0': '10_3_0',
    '7.9': '10_3_9',
    '8.0': '10_4_0',
    '8.11': '10_4_11',
    '9.0': '10_5_0',
    '9.8': '10_5_8',
    '10.0': '10_6_0',
    '10.8': '10_6_8',
    // We stop here because we try to math out the version for anything greater than 10, and it
    // works. Those versions are standardized using a calculation now.
  },
};

/**
 * init -> run -> catch -> finally
 */
export default abstract class extends Command {
  private _clientInfo: (string | number)[] = [];

  protected async init(): Promise<void> {
    const isAgree = configstore.get('analytics');
    const { name } = this.constructor;

    if (typeof isAgree === 'undefined' && name === 'Login') {
      this.log(
        `Allow Henesis to collect CLI usage and error reporting information`,
      );
      const uidgen = new UIDGenerator();
      const confirmed = await confirmPrompt();
      if (confirmed) {
        configstore.set('analytics', (await uidgen.generate()).toString());
      }
    } else {
      this._clientInfo[1] = this._getOSVersion();
      this._clientInfo[2] = this._getNodeVersion();
      this._clientInfo[3] = this._getCPUCount();
      this._clientInfo[4] = this._getRAM();
      this._clientInfo[5] = this._cliVersion();
      this._clientInfo[6] = this._getUserId();

      const additionals: { [key: string]: boolean | number | string } = {};
      this._clientInfo.forEach(
        (v, i): boolean | number | string => (additionals['cd' + i] = v),
      );

      const data = configstore.get('analytics');
      const visitor = ua('UA-126138188-2', this._getUserId(), {
        uid: data,
        strictCidFormat: false,
      });
      const commandPath: string =
        this.id != undefined ? this.id.split(':').join('/') : '';
      visitor
        .pageview({
          dp: `/command/${commandPath}`,
          dt: 'Henesis CLI',
          ...additionals,
        })
        .send();
    }
  }

  protected async catch(err: CLIError): Promise<void> {
    const email = this._getUserEmal();
    if (!process.env.HENESIS_TEST && !email.includes('@haechi.io')) {
      if (typeof err.code === 'undefined') {
        await this.reportToSentry(err);
      }
      await this.reportToGA(err);
    }

    this.error(err);
  }

  private async reportToSentry(error: Error) {
    Sentry.init({
      dsn: 'https://27ff620b68bf4da39b40f5d491e16fd8@sentry.io/1779992',
    });
    Sentry.configureScope(scope => {
      scope.setUser({ id: this._getUserId() });
      if (this._clientInfo) {
        scope.setTags({
          OS: String(this._clientInfo[1]),
          'Node Version': String(this._clientInfo[2]),
          'CPU Count': String(this._clientInfo[3]),
          RAM: String(this._clientInfo[4]),
          'CLI Version': String(this._clientInfo[5]),
        });
      }
    });
    Sentry.captureException(error);
    await Sentry.flush();
  }

  private reportToGA(error: Error): Promise<void> {
    return new Promise((resolve, rejects) => {
      const data = configstore.get('analytics');
      const visitor = ua('UA-126138188-2', this._getUserId(), {
        uid: data,
        strictCidFormat: false,
      });
      visitor.exception(error.message, true).send((err, req) => {
        if (!err) {
          resolve();
        }
        rejects();
      });
    });
  }

  protected async finally(err: Error | undefined): Promise<void> {
    // called after run and catch regardless of whether or not the command errored
  }

  private _getUser(): any {
    return configstore.get('user');
  }

  private _getUserId(): string {
    return this._getUser() ? this._getUser().id : 'None';
  }

  private _getUserEmal(): string {
    return this._getUser() ? this._getUser().email : 'None';
  }

  private _getOSVersion(): string {
    switch (os.platform()) {
      case 'darwin':
        return this._buildUserAgentStringForOsx();

      case 'win32':
        return this._buildUserAgentStringForWindows();

      case 'linux':
        return this._buildUserAgentStringForLinux();

      default:
        return os.platform() + ' ' + os.release();
    }
  }

  private _getNodeVersion(): number {
    const p = process.version;
    const m = p.match(/\d+\.\d+/);

    return (m && m[0] && parseFloat(m[0])) || 0;
  }

  private _getCPUCount(): number {
    const cpus = os.cpus();

    // Return "(count)x(average speed)".
    return cpus.length;
  }

  private _getRAM(): number {
    return Math.floor((os.totalmem() / 1024) * 1024 * 1024);
  }

  private _cliVersion(): string {
    return require('../../package.json').version;
  }

  private _buildUserAgentStringForOsx(): string {
    let v = osVersionMap.darwin[os.release()];

    if (!v) {
      // Remove 4 to tie Darwin version to OSX version, add other info.
      const x = parseFloat(os.release());
      if (x > 10) {
        v = `10_${(x - 4).toString().replace('.', '_')}`;
      }
    }

    const cpuModel = os.cpus()[0].model.match(/^[a-z]+/i);
    const cpu = cpuModel ? cpuModel[0] : os.cpus()[0].model;

    return `(Macintosh; ${cpu} Mac OS X ${v || os.release()})`;
  }

  private _buildUserAgentStringForWindows(): string {
    return `(Windows NT ${os.release()})`;
  }

  private _buildUserAgentStringForLinux(): string {
    return `(X11; Linux i686; ${os.release()}; ${os.cpus()[0].model})`;
  }
}
