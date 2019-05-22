import { Command, flags } from '@oclif/command';
import integrationRpc from '../../rpc/integration';

export default class Describe extends Command {
	public static description = 'describe a integration';
	public static examples = [ `$ henesis integration:describe` ];
	public static flags = {};
	public static args = [ { name: 'integrationId' } ];

	public async run() {
		const { args } = this.parse(Describe);
		if (args.integrationId === undefined) {
			await this.config.runHook('analyticsSend', {
				error: 'integrationId is undefined'
			});
			this.error('integrationId is undefined', { exit: 1 });
		}

		try {
			const integration = await integrationRpc.getIntegration(args.integrationId);
			await this.config.runHook('analyticsSend', {
				command: 'integration:describe'
			});
			this.log(JSON.stringify(integration, undefined, 2));
		} catch (err) {
			await this.config.runHook('analyticsSend', { error: err });
			this.error(err.message, { exit: 1 });
		}
	}
}
