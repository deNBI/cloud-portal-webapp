/**
 *  Model for multipart uploads
 */
export class Multipart {

  file: File;
  upload_id: string;
  upload_completed: boolean;
  chunks: Chunk[];

  constructor(file: File) {
    this.file = file;
    this.upload_id = '';
    this.chunks = [];
    this.upload_completed = false;
  }
}

/**
 *  Model for chunks of multipart upload
 */
export class Chunk {
  file: File;
  percent_completed: number;
  etag: string;
  presigned_url: string;
  part_number: number;
  upload_completed: boolean;

  constructor(part_number: number, signed_url: string) {
    this.file = null;
    this.percent_completed = 0;
    this.etag = '';
    this.presigned_url = signed_url;
    this.part_number = part_number;
    this.upload_completed = false;
  }

  set_file(file: File): void {
    this.file = file;
  }

  get_file(): File {
    return this.file;
  }

  set_percented_complete(percented_complete: number): void {
    this.percent_completed = percented_complete;
  }

  set_etag(etag: string): void {
    this.etag = etag;
  }

  set_completed(): void {
    this.upload_completed = true;
  }

  get_presigned_url(): string {
    return this.presigned_url;
  }
}

// export interface Part {
//   number: number;
//   signed_url: string;
//   etag: string;
// }
