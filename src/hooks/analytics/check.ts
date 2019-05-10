import { cli } from 'cli-ux';
import configstore from '../../configstore';

const hook = async function({}): Promise<void> {
  const isAgree = configstore.get('analytics');

  if (isAgree || isAgree === false) return;

  cli.log(
    `Allow Henesis to collect anonymous CLI usage and error reporting information`,
  );
  let input = await cli.confirm(`yes(y) or no(n)`);

  configstore.set('analytics', input);
};

export default hook;
