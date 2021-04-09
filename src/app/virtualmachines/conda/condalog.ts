import { jsPDF } from 'jspdf';
/**
 * Conda Log class
 */
export class Condalog {
	private _status: number;
	private _stdout: string;
	private _stderr: string;
	private _log_pdf: jsPDF;

	constructor(log: Condalog) {
		this._status = log.status;
		this._stdout = log.stdout;
		this._stderr = log.stderr;
	}

	saveAsPDF(): void {
		this.createLogPDF();
		this._log_pdf.save('Playbook-Logs.pdf');
	}

	saveAsTxt(): void {
		const element: HTMLElement = document.createElement('a');
		const fileType: string = 'text/plain';
		const status: string = `Statuscode: ${this._status.toString()}\n`;
		const stdout: string = `Log: ${this._stdout.toString()}\n`;
		const stderr: string = `Errorlog: ${this._stderr.toString()}\n`;
		element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(status + stdout + stderr)}`);
		element.setAttribute('download', 'Playbook-logs.txt');

		const event: MouseEvent = new MouseEvent('click');
		element.dispatchEvent(event);
	}

	private createLogPDF(): void {
		// eslint-disable-next-line new-cap
		const doc: jsPDF = new jsPDF('p', 'mm', 'a4');
		const lineWidth: number = doc.internal.pageSize.width;
		const margin: number = 10;
		const pageHeight: number = doc.internal.pageSize.height;
		const maxLineWidth: number = lineWidth - margin * 3;
		const statusCode: string = 'Statuscode: ';
		const statusCodeString: string = statusCode + this._status.toString();
		doc.text(statusCodeString, margin * 2, margin);
		const stdout: string[] = doc.splitTextToSize(this._stdout, maxLineWidth);
		stdout.unshift('Log: ');
		let currentLine: number = 10;
		for (const line of stdout) {
			if ((currentLine + margin) > pageHeight) {
				doc.addPage();
				currentLine = 10;
			}
			doc.text(line, margin * 2, currentLine + margin);
			currentLine += 10;
		}
		const stderr: string[] = doc.splitTextToSize(this._stderr, maxLineWidth);
		stderr.unshift('Errorlog:');
		for (const line of stderr) {
			if ((currentLine + margin) > pageHeight) {
				doc.addPage();
				currentLine = 10;
			}
			doc.text(line, margin * 2, currentLine + margin);
			currentLine += 10;
		}
		this._log_pdf = doc;
	}

	get log_pdf(): jsPDF {
		return this._log_pdf;
	}

	get status(): number {
		return this._status;
	}

	set status(value: number) {
		this._status = value;
	}

	get stdout(): string {
		return this._stdout;
	}

	set stdout(value: string) {
		this._stdout = value;
	}

	get stderr(): string {
		return this._stderr;
	}

	set stderr(value: string) {
		this._stderr = value;
	}

}
