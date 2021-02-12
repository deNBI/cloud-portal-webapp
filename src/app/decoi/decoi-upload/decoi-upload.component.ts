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
  chunkSize: number = 1024 * 1024 * 5;

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
      this.upload_service.get_presigned_urls(file['file']['name'], file['file']['size']).subscribe(
        (result: any): any => {
          this.prepare_file_for_upload(file, result);
          for (const chunk of file['chunks']) {
            this.upload_service.upload_chunk_to_presigned_url(chunk.get_presigned_url(), chunk.get_file()).subscribe(
              (event: any): any => {
                if (event.type === HttpEventType.UploadProgress) {
                  chunk.set_percented_complete(Math.round(100 * event.loaded / event.total));
                } else if (event instanceof HttpResponse) {
                  chunk.set_percented_complete(100);
                  chunk.set_completed();
                  const etag: string = event.headers['ETag'];
                  chunk.set_etag(etag);
                }
              }
            );
          }
        }
      );
    }
  }

  prepare_file_for_upload(file: Multipart, result: any): void {
    file['upload_id'] = result['UploadId'];
    file['chunks'] = Object.entries(result['signed_parts']).map(
      ([key, val]: any): any => (new Chunk(key, val)));
    const fileSize: number = file['file']['size'];
    const chunks: number = Math.ceil(fileSize / this.chunkSize);
    let chunk: number = 0;

    while (chunk < chunks) {
      const offset: number = chunk * this.chunkSize;
      const file_chunk: File = new File([file['file'].slice(offset, offset + this.chunkSize)], file['file']['name']);
      file['chunks'][chunk].set_file(file_chunk);
      chunk++;
    }
  }

}
