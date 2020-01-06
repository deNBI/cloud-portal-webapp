/**
 * Image tag interface.
 */
export interface ImageTag {
  name: string;
  description: string;
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
