import { EventEmitter } from '@angular/core';

export let is_vo: boolean = false;
export let elixir_id: string;
export const global_event: EventEmitter<any> = new EventEmitter();

/**
 * Set vo.
 * @param vo
 */
export function setVO(vo: boolean): void {
	is_vo = vo;
}

/**
 * Set elixir id.
 * @param id
 */
export function setElixirId(id: string): void {
	elixir_id = id;
	global_event.emit({ elixir_id });
}
