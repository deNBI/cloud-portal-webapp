import ***REMOVED***Component, Input, OnChanges, SimpleChange, SimpleChanges***REMOVED*** from '@angular/core';
import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachinemodels/virtualmachine';
import * as JSPDF from 'jspdf';
import ***REMOVED***VirtualmachineService***REMOVED*** from '../../api-connector/virtualmachine.service';

@Component(***REMOVED***
  selector: 'app-how-to-connect',
  templateUrl: 'how-to-connect.component.html',
  providers: [VirtualmachineService]
           ***REMOVED***)
export class HowToConnectComponent implements OnChanges ***REMOVED***

  showSshCommando: boolean = true;
  showUdpCommando: boolean = true;
  showLogs: boolean = true;

  private _selectedVirtualMachine: VirtualMachine;

  @Input() playbook_run: number = 0;

  logs?: ***REMOVED***[selector: string]: string | number***REMOVED***;

  doc: JSPDF;

  constructor(private virtualMachineService: VirtualmachineService) ***REMOVED***
  ***REMOVED***

  downloadFile(type: string): any ***REMOVED***
    if (type === 'pdf') ***REMOVED***
      this.createLogPDF();
      this.doc.save('Playbook-Logs.pdf');
    ***REMOVED***
    if (type === 'txt') ***REMOVED***
      this.saveAsTxt();
    ***REMOVED***
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
    stdout.unshift('Log: ');
    let currentLine: number = 10;
    for (const line of stdout) ***REMOVED***
      if ((currentLine + margin) > pageHeight) ***REMOVED***
        doc.addPage();
        currentLine = 10;
      ***REMOVED***
      doc.text(line, margin * 2, currentLine + margin);
      currentLine += 10;
    ***REMOVED***
    const stderr: string[] = doc.splitTextToSize(this.logs['stderr'], maxLineWidth);
    stderr.unshift('Errorlog:');
    for (const line of stderr) ***REMOVED***
      if ((currentLine + margin) > pageHeight) ***REMOVED***
        doc.addPage();
        currentLine = 10;
      ***REMOVED***
      doc.text(line, margin * 2, currentLine + margin);
      currentLine += 10;
    ***REMOVED***
    this.doc = doc;
  ***REMOVED***

  saveAsTxt(): any ***REMOVED***
    const element: HTMLElement = document.createElement('a');
    const fileType: string = 'text/plain';
    const status: string = `Statuscode: $***REMOVED***this.logs['status'].toString()***REMOVED***\n`;
    const stdout: string = `Log: $***REMOVED***this.logs['stdout'].toString()***REMOVED***\n`;
    const stderr: string = `Errorlog: $***REMOVED***this.logs['stderr'].toString()***REMOVED***\n`;
    element.setAttribute('href', `data:$***REMOVED***fileType***REMOVED***;charset=utf-8,$***REMOVED***encodeURIComponent(status + stdout + stderr)***REMOVED***`);
    element.setAttribute('download', 'Playbook-logs.txt');

    const event: MouseEvent = new MouseEvent('click');
    element.dispatchEvent(event);
  ***REMOVED***

  get selectedVirtualMachine(): VirtualMachine ***REMOVED***
    return this._selectedVirtualMachine;
  ***REMOVED***

  @Input() set selectedVirtualMachine(vm: VirtualMachine) ***REMOVED***
    this._selectedVirtualMachine = vm;
  ***REMOVED***

  ngOnChanges(changes: SimpleChanges): void ***REMOVED***
    const currentItem: SimpleChange = changes.selectedVirtualMachine;
    const current: null | VirtualMachine = currentItem.currentValue;
    const prev: null | VirtualMachine = currentItem.previousValue;
    if (current === null) ***REMOVED***
      return;
    ***REMOVED*** else if (prev === null) ***REMOVED***
      this.virtualMachineService.getLogs(this._selectedVirtualMachine.openstackid)
        .subscribe((logs: ***REMOVED***[selector: string]: string | number***REMOVED***) => ***REMOVED***
        if (logs['status'] === null) ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          this.logs = logs;
          this.playbook_run = 1;
        ***REMOVED***
      ***REMOVED***)
    ***REMOVED*** else if (current !== prev) ***REMOVED***
      this.virtualMachineService.getLogs(this._selectedVirtualMachine.openstackid)
        .subscribe((logs: ***REMOVED***[selector: string]: string | number***REMOVED***) => ***REMOVED***
        if (logs['status'] === null) ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          this.logs = logs;
          this.playbook_run = 1;
        ***REMOVED***
      ***REMOVED***)
    ***REMOVED***
  ***REMOVED***
***REMOVED***
