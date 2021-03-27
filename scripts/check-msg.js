import fs from 'fs/promises';
import path from 'path';

async function readFile(path) {
	return (await fs.readFile(path)).toString();
}

async function getCodes(dir) {
	const fileList = await fs.readdir(dir);
	let code = '';
	for await (let file of fileList) {
		if (!file.endsWith('.ts')) {
			continue;
		}
		code += await readFile(path.join(dir, file));
	}
	return code;
}

async function parseMwMessages() {
	let code = await readFile('./src/mw-messages.ts')
	return eval(code.slice(code.indexOf('[')));
}


(async () => {
	const messages = JSON.parse(await readFile('./i18n/en.json'));
	const mwMessages = await parseMwMessages();
	const messageUsages = Object.fromEntries(Object.keys(messages).map(m => [m, 0]));
	const mwMessageUsages = Object.fromEntries(mwMessages.map(m => [m, 0]));

	const code = (await getCodes('./src')) + (await getCodes('./src/modules'));

	// this regex relies on the fact that all msg() usages are simple.
	// use of any logic for coming up with message key inside msg( ... ) parens
	// will cause problems
	const rgx = /msg\((['"])(.*?)\1(,.*?)?\)/g;

	for (let match of code.matchAll(rgx)) {
		const msgKey = match[2];
		if (messageUsages[msgKey] !== undefined) {
			messageUsages[msgKey] += 1;
		} else if (mwMessageUsages[msgKey] !== undefined) {
			mwMessageUsages[msgKey] += 1;
		} else {
			console.error(`[E] ${match[0]}: no such message is defined`);
		}
	}

	for (let [msgKey, count] of Object.entries(messageUsages)) {
		if (count === 0) {
			console.warn(`[W] message ${msgKey} is unused`);
		}
	}
	for (let [msgKey, count] of Object.entries(mwMessageUsages)) {
		if (count === 0) {
			console.warn(`[W] MW message ${msgKey} is unused`);
		}
	}

})();
