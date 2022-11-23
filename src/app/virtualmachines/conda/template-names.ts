/**
 * Class containing all FORC Template names
 */
export class TemplateNames {
	private static _RSTUDIO: string = 'rstudio';
	private static _THEIA: string = 'theiaide';
	private static _GUACAMOLE: string = 'guacamole';
	private static _JUPYTERLAB: string = 'jupyterlab';
	private static _VSCODE: string = 'vscode';

	private static _ALL_TEMPLATES: string[] = [
		TemplateNames._RSTUDIO,
		TemplateNames._THEIA,
		TemplateNames._GUACAMOLE,
		TemplateNames._JUPYTERLAB,
		TemplateNames._VSCODE,
	];

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

	static get JUPYTERLAB(): string {
		return this._JUPYTERLAB;
	}

	static set JUPYTERLAB(value: string) {
		this._JUPYTERLAB = value;
	}

	static get VSCODE(): string {
		return this._VSCODE;
	}

	static set VSCODE(value: string) {
		this._VSCODE = value;
	}

	static get ALL_TEMPLATE_NAMES(): string[] {
		return this._ALL_TEMPLATES;
	}
}
