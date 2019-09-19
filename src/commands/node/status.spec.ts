import { expect, test } from '@oclif/test';
import { Scope } from 'nock';

process.env.HENESIS_TEST = 'true';
describe('node:status', (): void => {
  context('when no error occurred', (): void => {
    test
      .nock(
        'http://network.henesis.io',
        (api): Scope =>
          api
            .post('/ethereum/mainnet')
            .reply(200, { result: false })
            .post('/ethereum/ropsten')
            .reply(200, { result: false })
            .post('/ethereum/rinkeby')
            .reply(200, { result: false })
            .post('/klaytn/mainnet')
            .reply(200, { result: false })
            .post('/klaytn/baobab')
            .reply(200, { result: false }),
      )
      .stdout()
      .command(`node:status`)
      .it('all synced', (ctx): void => {
        const rows = ctx.stdout
          .trim()
          .split('\n')
          .slice(1);
        rows.forEach(row => {
          expect(
            row
              .trim()
              .split(/\s+/)
              .slice(-1)[0],
          ).to.equal('Synced');
        });
      });
  });
  context('when some nodes are down', (): void => {
    test
      .nock(
        'http://network.henesis.io',
        (api): Scope =>
          api
            .post('/ethereum/mainnet')
            .reply(200, { result: false })
            .post('/ethereum/ropsten')
            .reply(200, { result: false })
            .post('/ethereum/rinkeby')
            .reply(200, { result: false })
            .post('/klaytn/mainnet')
            .reply(200, { result: false })
            .post('/klaytn/baobab')
            .reply(500),
      )
      .stdout()
      .command(`node:status`)
      .it('last node would be down', (ctx): void => {
        const rows = ctx.stdout
          .trim()
          .split('\n')
          .slice(1);
        expect(
          rows
            .slice(-1)[0]
            .split(/\s+/)
            .slice(-1)[0],
        ).to.equal('Down');
      });
  });
});
