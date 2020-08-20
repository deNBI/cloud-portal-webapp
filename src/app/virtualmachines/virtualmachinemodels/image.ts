import {ImageMode} from '../../facility_manager/image-tag';

/**
 * Image class.
 */
export class Image {
  id: string;
  openstackid: string;
  name: string;
  status: string;
  tags: string[];
  description: string;
  is_snapshot: boolean;
  logo_url: string;
  modes: ImageMode[];


}
