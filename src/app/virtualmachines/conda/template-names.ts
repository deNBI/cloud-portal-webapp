/**
 * Class containing all FORC Template names
 */
export class TemplateNames {
	private static _RSTUDIO: string = 'rstudio';
	private static _THEIA: string = 'theiaide';
	private static _GUACAMOLE: string = 'guacamole';
	private static _JUPYTERNOTEBOOK: string = 'jupyternotebook';
	private static _CWLAB: string = 'cwlab';

	private static _ALL_TEMPLATES: string[] =		[
		TemplateNames._RSTUDIO,
		TemplateNames._THEIA,
		TemplateNames._GUACAMOLE,
		TemplateNames._JUPYTERNOTEBOOK,
		TemplateNames._CWLAB];

	static get RSTUDIO(): string {
		return this._RSTUDIO;
	}

	static set RSTUDIO(value: string) {
		this._RSTUDIO = value;
	}

	static get THEIA(): string {
		return this._THEIA;
	}

	static set THEIA(value: string) {
		this._THEIA = value;
	}

	static get GUACAMOLE(): string {
		return this._GUACAMOLE;
	}

	static set GUACAMOLE(value: string) {
		this._GUACAMOLE = value;
	}

	static get JUPYTERNOTEBOOK(): string {
		return this._JUPYTERNOTEBOOK;
	}

	static set JUPYTERNOTEBOOK(value: string) {
		this._JUPYTERNOTEBOOK = value;
	}

	static get CWLAB(): string {
		return this._CWLAB;
	}

	static set CWLAB(value: string) {
		this._CWLAB = value;
	}

	static get ALL_TEMPLATE_NAMES(): string [] {
		return this._ALL_TEMPLATES;
	}
}
