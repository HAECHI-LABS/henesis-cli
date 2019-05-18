import configstore from '../../configstore';
import * as ua from 'universal-analytics';

const hook = async function(argv: {
  error?: Error;
  command?: string;
}): Promise<void> {
  const isAgree = configstore.get('analytics');

  if (isAgree || isAgree === false) return;

  const visitor = ua('UA-126138188-2');

  if (argv.error) {
    visitor.exception(argv.error).send();
    return;
  } else if (argv.command) {
    visitor.event('cli', argv.command).send();
  }
};

export default hook;
