import {Component, OnInit} from '@angular/core';
import {Chunk, Multipart} from '../model/multipart.model';
import {DecoiUploadService} from '../../api-connector/decoi-upload.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';

/**
 * Upload component for decoi
 */
@Component({
  selector: 'app-decoi-upload',
  templateUrl: './decoi-upload.component.html',
  styleUrls: ['./decoi-upload.component.scss'],
  providers: [DecoiUploadService]
})
export class DecoiUploadComponent implements OnInit {

  title: string = 'DeCoi Upload';
  chosen_files: Multipart[];
  load_error_message: string;

  constructor(private upload_service: DecoiUploadService) {}

  ngOnInit(): void {
    this.chosen_files = [];
    this.load_error_message = null;
  }

  load_files(event: EventTarget): void {
    this.chosen_files = [];
    this.load_error_message = null;
    try {
      for (const file of event['files']) {
        this.chosen_files.push(new Multipart(file));
      }
    } catch (error) {
      this.load_error_message = error;
    }
  }

  upload_files(): void {
    for (const file of this.chosen_files) {
      this.upload_service.get_presigned_urls(file.get_file_name(), file.get_file_size()).subscribe(
        (result: any): any => {
          this.prepare_file_for_upload(file, result);
          for (const chunk of file['chunks']) {
            this.upload_service.upload_chunk_to_presigned_url(chunk.get_presigned_url(), chunk.get_file()).subscribe(
              (event: any): any => {
                if (event.type === HttpEventType.UploadProgress) {
                  chunk.set_percented_complete(Math.round(100 * event.loaded / event.total));
                } else if (event instanceof HttpResponse) {
                  chunk.set_percented_complete(100);
                  event.headers.keys()
                  const etag: string = event.headers.get('ETag');
                  chunk.set_etag(etag);
                  chunk.set_completed();
                }
              }
            );
          }
          this.sleep(10000).then((): any => {
            this.complete_upload(file);
          });
        }
      );
    }
  }

  sleep(ms: any): Promise<any> {
    return new Promise((resolve: any): any => setTimeout(resolve, ms));
  }

  prepare_file_for_upload(file: Multipart, result: any): void {
    file['upload_id'] = result['UploadId'];
    file['chunks'] = Object.entries(result['signed_parts']).map(
      ([key, val]: any): any => (new Chunk(key, val)));
    const fileSize: number = file.get_file_size();
    const chunkSize: number = Number(result['part_size']);
    const chunks: number = Math.ceil(fileSize / chunkSize);
    let chunk: number = 0;

    while (chunk < chunks) {
      const offset: number = chunk * chunkSize;
      const file_chunk: File = new File([file['file'].slice(offset, offset + chunkSize)], file['file']['name']);
      file['chunks'][chunk].set_file(file_chunk);
      chunk++;
    }
  }

  complete_upload(file: Multipart): void {
    if (!file.get_all_chunks_completed()) {
      this.sleep(10000).then((): any => {
        this.complete_upload(file);
      })
    } else {
      let parts: any = [];
      for (const chunk of file['chunks']) {
        const etag_part: any = chunk.get_etag_part_json();
        parts.push(etag_part);
      }
      parts = JSON.stringify(parts);
      this.upload_service.complete_multipart_upload(file.get_file_name(), file.get_upload_id(), parts).subscribe(
        (result: any): any => {
          file.set_upload_completed();
        },
        (error: any): any => {
          console.log(error);
        }
      );
    }
  }

}
