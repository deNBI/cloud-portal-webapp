import ***REMOVED***Component, Input***REMOVED*** from '@angular/core';
import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachinemodels/virtualmachine';
import * as JSPDF from 'jspdf';

@Component(***REMOVED***
  selector: 'app-how-to-connect',
  templateUrl: 'how-to-connect.component.html'
           ***REMOVED***)
export class HowToConnectComponent ***REMOVED***

  showSshCommando: boolean = true;
  showUdpCommando: boolean = true;
  showLogs: boolean = true;

  @Input() selectedVm: VirtualMachine;

  @Input() playbook_run: number = 0;

  @Input() logs: ***REMOVED***[selector: string]: string | number***REMOVED***;

  doc: JSPDF;

  downloadFile(): any ***REMOVED***
    this.createLogPDF();
    this.doc.save('Playbook-Logs.pdf');
  ***REMOVED***

  createLogPDF(): void ***REMOVED***
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
    for (const line of stdout) ***REMOVED***
      if ((currentLine + margin) > pageHeight) ***REMOVED***
        doc.addPage();
        currentLine = 10;
      ***REMOVED***
      doc.text(line, margin * 2, currentLine + margin);
      currentLine += 10;
    ***REMOVED***
    this.doc = doc;
  ***REMOVED***
***REMOVED***
