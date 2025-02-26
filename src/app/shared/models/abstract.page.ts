export abstract class AbstractPage<T> {
	abstract get results(): T[]

	count: number = 0
	page: number = 1

	private _page_size: number = 15
	private readonly _max_page_size: number = 50

	get page_size(): number {
		return this._page_size
	}

	set page_size(value: number) {
		if (value > this._max_page_size) {
			console.warn(
				`page_size cannot be greater than max_page_size (${this._max_page_size}). Setting page_size to ${this._max_page_size}.`
			)
			this._page_size = this._max_page_size
		} else {
			this._page_size = value
		}
	}

	// Getter for max_page_size
	get max_page_size(): number {
		return this._max_page_size
	}
}
