import 'mock-mediawiki';

require(__dirname + '/../morebits/morebits');
global.Morebits = window.Morebits;

// @ts-ignore
mw.libs.pluralRuleParser = require('cldrpluralruleparser');

// Stubs:
// @ts-ignore
mw.Api = class {
	// For messenger.test.ts
	getMessages() {
		return Promise.resolve({});
	}
};
