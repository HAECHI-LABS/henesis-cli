import Command from '@oclif/command';
import * as os from 'os';
import configstore from './configstore';
import * as ua from 'universal-analytics';
import { confirmPrompt } from '../utils';
import * as UIDGenerator from 'uid-generator';
import * as ErrorHandler from './errorHandler';
import { CLIError } from '@oclif/errors';

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
  private _dimensions: (string | number)[] = [];

  protected async init(): Promise<void> {
    const isAgree = configstore.get('analytics');
    const { name } = this.constructor;

    if (typeof isAgree === 'undefined' && name === 'Login') {
      this.log(
        `Allow Henesis to collect CLI usage and error reporting information`,
      );
      const uidgen = new UIDGenerator();
      const Confirmed = await confirmPrompt();
      const data: string | boolean = Confirmed
        ? (await uidgen.generate()).toString()
        : false;
      configstore.set('analytics', data);
    } else {
      const data = configstore.get('analytics');
      const userID = (configstore.get('user'))
        ? configstore.get('user').id
        : "Not Login";
      const commandPath: string = (this.id != undefined)
        ? ((this.id).split(':').join('/'))
        : '';
      const visitor = ua('UA-126138188-2', userID, { uid: data, strictCidFormat : false });

      this._dimensions[1] = this._getOSVersion();
      this._dimensions[2] = this._getNodeVersion();
      this._dimensions[3] = this._getCPUCount();
      this._dimensions[4] = this._getRAM();
      this._dimensions[5] = this._cliVersion();
      this._dimensions[6] = userID;

      const additionals: { [key: string]: boolean | number | string } = {};
      this._dimensions.forEach(
        (v, i): boolean | number | string => (additionals['cd' + i] = v),
      );
      visitor.pageview({ dp: `/command/${commandPath}`, dt: 'Henesis-cli', ...additionals }).send();
    }
  }

  protected async catch(err: CLIError): Promise<void> {
    // console.log((err.code));
    // console.error(`Error Status: ${err.code}, ${err.message}`);
  }

  protected async finally(err: CLIError): Promise<void> {
    // called after run and catch regardless of whether or not the command errored
    // ErrorHandler.ErrorHandler(err, this._dimensions, {
    //   reportSentry: (err.code !== undefined)
    //     ? false
    //     : true
    // });
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
