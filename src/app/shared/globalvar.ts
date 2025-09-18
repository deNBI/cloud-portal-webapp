export let is_vo: boolean = false;
export let lifescience_id: string;

/**
 * Set vo.
 * @param vo
 */
export function setVO(vo: boolean): void {
	is_vo = vo;
}

/**
 * Set lifescience id.
 * @param id
 */
export function setLifeScienceId(id: string): void {
	lifescience_id = id;
}
