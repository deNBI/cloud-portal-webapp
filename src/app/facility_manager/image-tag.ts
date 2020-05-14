/**
 * Image tag interface.
 */
export interface ImageTag {
  id?: string;
  name: string;
  mode: ImageMode[];
}

/**
 * Image mode interface.
 */
export interface ImageMode {
  id?: string
  name: string;
  description: string;
  copy_field: string;
  virtualmachines_counter?: number;
}

/**
 * Image logo interface.
 */
export interface ImageLogo {
  id: string | number;
  tag: string;
  url: string;
}

/**
 * Blocked Image tag interface.
 */
export interface BlockedImageTag {
  name: string;
  compute_center_facility_id: number;
}

/**
 * Blocked Image tag interface.
 */
export interface BlockedImageTagResenv {
  tag: string;
  resenvs: string[];
  compute_center_facility_id: number;
}
