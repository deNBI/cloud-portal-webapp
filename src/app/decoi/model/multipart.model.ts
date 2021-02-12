/**
 *  Model for multipart uploads
 */
import {ParallelHasher} from 'ts-md5/dist/parallel_hasher';

export class Multipart {

  file: File;
  upload_id: string;
  upload_completed: boolean;
  chunks: Chunk[];
  md5_checksum: string;

  constructor(file: File) {
    this.file = file;
    this.upload_id = '';
    this.chunks = [];
    this.upload_completed = false;
    this.generate_md5_checksum()

  }

  private generate_md5_checksum(): void {
    console.log('generaate checsum')
    const hasher: ParallelHasher = new ParallelHasher('static/webapp/assets/js/md5_worker.js');
    hasher.hash(this.file).then((hash: string): void => {
      console.log('md5 of fileBlob is', hash);
      this.md5_checksum = hash;
    });
  }

  get_all_chunks_completed(): boolean {
    for (const chunk of this.chunks) {
      if (!chunk.get_completed()) {
        return false;
      }
    }

    return true;
  }

  get_file_name(): string {
    return this.file['name'];
  }

  get_file_size(): number {
    return this.file['size'];
  }

  get_upload_id(): string {
    return this.upload_id;
  }

  set_upload_completed(): void {
    this.upload_completed = true;
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
    this.part_number = Number(part_number);
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
    this.etag = etag.replace(/["']/g, '');
  }

  get_etag_part_json(): {ETag: string, PartNumber: number} {
    return {ETag: this.etag, PartNumber: this.part_number}
  }

  set_completed(): void {
    this.upload_completed = true;
  }

  get_completed(): boolean {
    return this.upload_completed;
  }

  get_presigned_url(): string {
    return this.presigned_url;
  }
}
