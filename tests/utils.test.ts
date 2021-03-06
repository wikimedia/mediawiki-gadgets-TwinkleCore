import './test_base';

import { arr_flatMap, isTextRedirect, makeArray, makeTemplate, obj_entries, obj_values, stripNs } from '../src/utils';
import { NS_TEMPLATE, NS_USER_TALK } from '../src/namespaces';

describe('utils', function () {
	test('makeArray', function () {
		expect(makeArray(undefined)).toEqual([]);
		expect(makeArray(null)).toEqual([]);
		expect(makeArray(4)).toEqual([4]);
		expect(makeArray([4, 5])).toEqual([4, 5]);
	});

	test('MW mocking works', function () {
		expect(mw.util.escapeRegExp('d?')).toBe('d\\?');
	});

	// Depends on MW title mocking
	test('stripNs', function () {
		expect(stripNs('Template:Foo')).toBe('Foo');
	});

	test('makeTemplate', () => {
		expect(
			makeTemplate('subst:afd', {
				pg: 'Linguistics',
				3: 'foo',
				1: 'bar',
				name: 'Lorem ipsum',
			})
		).toBe(`{{subst:afd|1=bar|3=foo|pg=Linguistics|name=Lorem ipsum}}`);
	});

	let testObject = {
		string_field: 'string',
		num_field: 4,
		decimal_field: 4.53,
		null_field: null,
		undef_field: undefined,
		true_field: true,
		false_field: false,
		arr_field: [4, 6],
		object_field: {
			param1: [4, 5],
			param2: null,
			param3: 'lorem ipsum',
		},
	};

	test('obj_values', () => {
		expect(obj_values(testObject)).toEqual(Object.values(testObject));
	});
	test('obj_entries', () => {
		expect(obj_entries(testObject)).toEqual(Object.entries(testObject));
	});

	test('arr_flatMap', () => {
		expect([1, 2, 3, 4].flatMap((e) => [e * 2])).toEqual(arr_flatMap([1, 2, 3, 4], (e) => [e * 2]));
		expect([1, 2, 3, 4].flatMap((e) => e * 2)).toEqual(arr_flatMap([1, 2, 3, 4], (e) => e * 2));
	});

	test('namespaces', function () {
		expect(NS_TEMPLATE).toBe(10);
		expect(NS_USER_TALK).toBe(3);
	});

	test('isTextRedirect', function () {
		expect(isTextRedirect('#REDIRECT [[pageName]]')).toBe(true);
		expect(isTextRedirect('\n#rediRecT [[pageName]]')).toBe(true);
		expect(isTextRedirect('redirect [[pageName]]')).toBe(false);
	});
});
