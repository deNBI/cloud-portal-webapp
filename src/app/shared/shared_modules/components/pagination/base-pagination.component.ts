import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import {
	RowComponent,
	ColComponent,
	InputGroupComponent,
	FormControlDirective,
	InputGroupTextDirective
} from '@coreui/angular'
import { PaginationComponent } from 'ngx-bootstrap/pagination'
import { FormsModule } from '@angular/forms'
import { AbstractPage } from 'app/shared/models/abstract.page'

@Component({
	selector: 'app-pagination',
	templateUrl: './base-pagination.component.html',
	imports: [
		RowComponent,
		ColComponent,
		PaginationComponent,
		FormsModule,
		InputGroupComponent,
		FormControlDirective,
		InputGroupTextDirective
	]
})
export class BasePaginationComponent<T> implements OnInit {
	@Input() basePage: AbstractPage<T>
	@Output() pageChanged: EventEmitter<AbstractPage<T>> = new EventEmitter<AbstractPage<T>>()

	perPageChange$: Subject<number> = new Subject<number>()
	private debounceTime: number = 1000
	private ngUnsubscribe: Subject<void> = new Subject()

	ngOnInit(): void {
		console.log(this.basePage)
		console.log('init done')
		this.perPageChange$
			.pipe(takeUntil(this.ngUnsubscribe), debounceTime(this.debounceTime), distinctUntilChanged())
			.subscribe(() => {
				console.log('page size change event')
				this.submit(this.basePage)
			})
	}

	submit(event: AbstractPage<T>): void {
		console.log('submit')

		this.basePage.page = event.page
		this.pageChanged.emit(this.basePage)
	}

	ngOnDestroy(): void {
		this.ngUnsubscribe.next()
		this.ngUnsubscribe.complete()
	}
}
