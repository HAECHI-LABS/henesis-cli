import { Ethereum } from '@haechi-labs/henesis-sdk';

exports.approval = (
	web3: any,
	event: Ethereum.Event,
	blockMeta: Ethereum.BlockMeta,
	userMeta: Ethereum.UserMeta
): any => {
	console.log('event', event.payload);
	return event.payload;
};
