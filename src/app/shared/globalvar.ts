export let is_vo: boolean = false;
export let elixir_id: string;

export function setVO(vo: boolean): void {
	is_vo = vo;
}

export function setElixirId(id: string): void {
	elixir_id = id;
}
