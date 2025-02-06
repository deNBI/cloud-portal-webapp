import { Component, Input, OnChanges } from '@angular/core'
import { ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, ProgressBarDirective, ProgressComponent, ProgressBarComponent } from '@coreui/angular';

@Component({
    selector: 'app-information-toast',
    templateUrl: './information-toast.component.html',
    styleUrls: ['./information-toast.component.scss'],
    imports: [ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, ProgressBarDirective, ProgressComponent, ProgressBarComponent]
})
export class InformationToastComponent implements OnChanges {
	@Input() message: string = ''
	@Input() title: string = ''
	@Input() type: string = 'info'

	ngOnChanges() {
		this.toggleToast()
	}

	position = 'top'
	visible = false
	percentage = 0

	toggleToast() {
		if (this.message !== '') {
			this.visible = true
		} else {
			this.visible = false
		}
	}

	onVisibleChange($event: boolean) {
		this.visible = $event
		this.percentage = !this.visible ? 0 : this.percentage
	}

	onTimerChange($event: number) {
		this.percentage = $event * 25
	}
}
