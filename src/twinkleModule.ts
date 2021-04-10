import { Config, PreferenceGroup, setDefaultConfig } from './Config';
import { addPortletLink } from './portlet';
import { arr_includes } from './utils';
import { userDisabledModules } from './init';
import { Twinkle } from './twinkle';

/**
 * Base class for all Twinkle modules
 */
export class TwinkleModule {
	/**
	 * The name of the module, used to check if the user
	 * has the module disabled
	 */
	static moduleName: string;
	moduleName: string;

	/**
	 * Name displayed on the portlet
	 */
	portletName: string;

	/**
	 * Tooltip shown when hovering on the portlet
	 */
	portletTooltip: string;

	/**
	 * Optional ID for the portlet. This defaults to `twinkle-${portletName.toLowerCase()}`
	 * if unspecified
	 */
	portletId: string;

	constructor() {}

	/**
	 * Return a PreferenceGroup with the preferences added by this module
	 */
	static userPreferences(): PreferenceGroup | void {}

	/**
	 * Add a preference to this module's preference group
	 * @param pref
	 */
	addPreference(pref) {
		Config.addPreference(this.moduleName, pref);
	}

	/**
	 * Add menu portlet
	 */
	addMenu() {
		addPortletLink(
			() => this.makeWindow(),
			this.portletName,
			this.portletId || 'twinkle-' + this.moduleName.toLowerCase(),
			this.portletTooltip
		);
	}

	/**
	 * Set of links shown in the bottom right of the module dialog.
	 * Object keys are labels and values are the wiki page names.
	 */
	footerlinks: { [label: string]: string };

	/**
	 * Generate the GUI dialog for this module. Invoked when the portlet
	 * generated by addMenu is clicked.
	 */
	makeWindow() {}
}

export function registerModule(module: typeof TwinkleModule) {
	let prefs = module.userPreferences();
	if (prefs) {
		Config.addGroup(module.moduleName, {
			...prefs,
			module: module.moduleName,
		});
		setDefaultConfig(
			prefs.preferences.map((pref) => {
				return {
					name: pref.name,
					value: pref.default,
				};
			})
		);
	}

	if (!arr_includes(userDisabledModules, module.moduleName)) {
		// new module() inits the module, which usually means adding the portlet link
		// the result is assigned to Twinkle object only for debugging purposes
		Twinkle[module.moduleName.toLowerCase()] = new module();
	}
}