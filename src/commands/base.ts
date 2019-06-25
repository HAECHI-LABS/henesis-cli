import Command from '@oclif/command';
import configstore from '../common/configstore';
import * as ua from 'universal-analytics';
import { confirmPrompt } from '../utils';
/**
 * init -> run -> catch -> finally
 */
export default abstract class extends Command {
  protected visitor = ua('UA-126138188-2');

  protected async init(): Promise<void> {
    const isAgree = configstore.get('analytics');
    const { name } = this.constructor;

    if (typeof isAgree === 'undefined' && name === 'Login') {
      this.log(
        `Allow Henesis to collect anonymous CLI usage and error reporting information`,
      );
      const isConfirm = await confirmPrompt();
      configstore.set('analytics', isConfirm);
    } else {
      this.visitor.event('cli', name).send();
    }
  }

  protected async catch(err: Error): Promise<void> {
    const isAgree = configstore.get('analytics');
    if (typeof isAgree !== 'undefined') {
      this.visitor.exception(err).send();
    }
    this.error(err);
  }

  protected async finally(err: Error | undefined): Promise<void> {
    // called after run and catch regardless of whether or not the command errored
  }
}
