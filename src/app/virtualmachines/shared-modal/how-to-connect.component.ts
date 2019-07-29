import {Component, Input} from '@angular/core';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import * as JSPDF from 'jspdf';

@Component({
  selector: 'app-how-to-connect',
  templateUrl: 'how-to-connect.component.html'
           })
export class HowToConnectComponent {

  showSshCommando: boolean = true;
  showUdpCommando: boolean = true;
  showLogs: boolean = true;

  @Input() selectedVm: VirtualMachine;

  @Input() playbook_run: number = 0;

  @Input() logs: {[selector: string]: string | number};

  doc: JSPDF;

  downloadFile(): any {
    this.createLogPDF();
    this.doc.save('Playbook-Logs.pdf');
  }

  createLogPDF(): void {
    const doc: JSPDF = new JSPDF('p', 'mm', 'a4');
    const lineWidth: number = doc.internal.pageSize.width;
    const margin: number = 10;
    const pageHeight: number = doc.internal.pageSize.height;
    const maxLineWidth: number = lineWidth - margin * 3;
    const statusCode: string = 'Statuscode: ';
    const statusCodeString: string = statusCode + this.logs['status'].toString();
    doc.text(statusCodeString, margin * 2, margin);
    const stdout: string[] = doc.splitTextToSize(this.logs['stdout'], maxLineWidth);
    let currentLine: number = 10;
    for (const line of stdout) {
      if ((currentLine + margin) > pageHeight) {
        doc.addPage();
        currentLine = 10;
      }
      doc.text(line, margin * 2, currentLine + margin);
      currentLine += 10;
    }
    this.doc = doc;
  }
}
