import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';
import * as JSPDF from 'jspdf';
import {VirtualmachineService} from '../../api-connector/virtualmachine.service';

/**
 * How to Connect moda body.
 */
@Component({
             selector: 'app-how-to-connect',
             templateUrl: 'how-to-connect.component.html',
             providers: [VirtualmachineService]
           })
export class HowToConnectComponent implements OnChanges {
  public _selectedVirtualMachine: VirtualMachine;

  @Input() playbook_run: number;

  logs?: { [selector: string]: string | number };

  doc: JSPDF;

  constructor(private virtualMachineService: VirtualmachineService) {
  }

  downloadFile(type: string): any {
    if (type === 'pdf') {
      this.createLogPDF();
      this.doc.save('Playbook-Logs.pdf');
    }
    if (type === 'txt') {
      this.saveAsTxt();
    }
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
    const stderr: string[] = doc.splitTextToSize(this.logs['stderr'], maxLineWidth);
    stderr.unshift('Errorlog:');
    for (const line of stderr) {
      if ((currentLine + margin) > pageHeight) {
        doc.addPage();
        currentLine = 10;
      }
      doc.text(line, margin * 2, currentLine + margin);
      currentLine += 10;
    }
    this.doc = doc;
  }

  saveAsTxt(): any {
    const element: HTMLElement = document.createElement('a');
    const fileType: string = 'text/plain';
    const status: string = `Statuscode: ${this.logs['status'].toString()}\n`;
    const stdout: string = `Log: ${this.logs['stdout'].toString()}\n`;
    const stderr: string = `Errorlog: ${this.logs['stderr'].toString()}\n`;
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(status + stdout + stderr)}`);
    element.setAttribute('download', 'Playbook-logs.txt');

    const event: MouseEvent = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  get selectedVirtualMachine(): VirtualMachine {
    return this._selectedVirtualMachine;
  }

  @Input() set selectedVirtualMachine(vm: VirtualMachine) {
    this._selectedVirtualMachine = vm;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentItem: SimpleChange = changes.selectedVirtualMachine;
    const current: null | VirtualMachine = currentItem.currentValue;
    if (current === null) {
      return;
    } else {
      this.virtualMachineService.getLogs(current.openstackid)
        .subscribe((logs: { [selector: string]: string | number }) => {
          if (logs['status'] === null) {
            this.playbook_run = 0;
          } else {
            this.logs = logs;
            this.playbook_run = 1;
          }
        })
    }
  }
}
