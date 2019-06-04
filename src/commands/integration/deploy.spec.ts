import { expect, test } from '@oclif/test';
import { newMockIntegration, newMockIntegrationSpec } from '../../mock';
import { IntegrationSpec } from '../../types';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

process.env.HENESIS_TEST = 'true';
describe('integration:deploy', () => {
  const specPath = './henesis.yaml';
  let integrationSpec: IntegrationSpec;
  beforeEach('set spec and integration', () => {
    integrationSpec = newMockIntegrationSpec();
    fs.writeFileSync(specPath, yaml.safeDump(integrationSpec));
  });

  afterEach('set spec and integration', () => {
    fs.unlinkSync(specPath);
  });

  context('deploy spec when no error occurred', async () => {
    const res = newMockIntegration();
    test
      .timeout(10000)
      .nock('http://localhost:8080', api =>
        api.post('/integrations/v1').reply(200, res),
      )
      .stdout()
      .command([`integration:deploy`, `--path=${specPath}`])
      .it('should deploy a integration', ctx => {
        expect(ctx.stdout).to.equal(`${res.integrationId} has been deployed\n`);
      });
  });

  context(
    'deploy spec with default spec path when no error occurred',
    async () => {
      const res = newMockIntegration();
      test
        .timeout(10000)
        .nock('http://localhost:8080', api =>
          api.post('/integrations/v1').reply(200, res),
        )
        .stdout()
        .command([`integration:deploy`])
        .it('should deploy a integration with default spec path', ctx => {
          expect(ctx.stdout).to.equal(
            `${res.integrationId} has been deployed\n`,
          );
        });
    },
  );

  context('update spec when no error occurred', async () => {
    const res = newMockIntegration();
    test
      .timeout(10000)
      .nock('http://localhost:8080', api => {
        api.put(`/integrations/v1/${res.integrationId}`).reply(200, res);
        api
          .get(`/integrations/v1/findByName?name=${integrationSpec.name}`)
          .reply(200, res);
      })
      .stdout()
      .command([`integration:deploy`, `--path=${specPath}`, `-f`])
      .it('should deploy a integration with update option', ctx => {
        expect(ctx.stdout).to.equal(
          `${res.integrationId} has been deployed with force\n`,
        );
      });
  });
});
