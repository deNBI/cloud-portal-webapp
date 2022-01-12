export let is_vo: boolean = false;
export let elixir_id: string;

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
}
