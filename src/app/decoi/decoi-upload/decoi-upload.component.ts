import {Component, OnInit} from '@angular/core';
import {Chunk, Multipart} from '../model/multipart.model';
import {DecoiUploadService} from '../../api-connector/decoi-upload.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {MetadataModel} from '../model/metadata.model';

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
  chosen_metadata: File;
  chosen_metadata_error: string[] = [];
  metadata_entries: MetadataModel[] = [];
  load_error_message: string;
  upload_rdy: boolean = false;

  constructor(private upload_service: DecoiUploadService) {
  }

  ngOnInit(): void {
    this.chosen_files = [];
    this.load_error_message = null;
  }

  uploadMetadata(): void {
    this.chosen_metadata_error = []
    this.upload_service.postMetadata(this.chosen_metadata)
      .subscribe((
                   data: MetadataModel[]): void => {
                   this.metadata_entries = data;
                   this.chosen_metadata = null;

                 },
                 (error: any): void => {
                   this.chosen_metadata_error = error.error['errors']
                   this.chosen_metadata = null;

                 })

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
    this.chosen_files.forEach((file: Multipart): void => {
      for (const metadata of this.metadata_entries) {
        if (metadata.FILE_NAME === file.file.name) {
          metadata.upload = file
        }
      }

    })
    this.check_if_all_data_rdy()
  }

  load_metadata(event): void {
    this.upload_rdy = false;
    this.chosen_metadata = event.target.files[0];

  }

  check_if_all_data_rdy(): void {

    this.upload_rdy = false

    for (const metadata of this.metadata_entries) {
      if (metadata.upload) {
        if (!metadata.upload.ready_for_upload) {
          this.upload_rdy = false
          setTimeout((): void => {
            this.check_if_all_data_rdy()

          }, 5000);

          return
        }
      }
    }
    this.upload_rdy = true

  }

  async upload_files(): Promise<any> {
    for (const metadata of this.metadata_entries) {

      if (metadata.upload) {

        await new Promise<any>((resolve: any, reject: any): any => {
          this.upload_service.get_presigned_urls(metadata.IMS_ID, metadata.upload.get_file_size(), metadata.upload.md5_checksum).subscribe(
            async (result: any): Promise<any> => {
              if ('msg' in result) {
                metadata.upload.set_msg(result['msg']);
                resolve();

              } else {
                this.prepare_file_for_upload(metadata.upload, result);
                for (const chunk of metadata.upload.chunks) {
                  this.upload_service.upload_chunk_to_presigned_url(chunk.get_presigned_url(), chunk.get_file()).subscribe(
                    (event: any): any => {
                      if (event.type === HttpEventType.UploadProgress) {
                        chunk.set_percented_complete(Math.round(100 * event.loaded / event.total));
                        metadata?.upload?.get_percent_completed()
                      } else if (event instanceof HttpResponse) {
                        chunk.set_percented_complete(100);
                        event.headers.keys()
                        const etag: string = event.headers.get('ETag');
                        chunk.set_etag(etag);
                        chunk.set_completed();
                        metadata?.upload?.get_percent_completed()
                      }
                    }
                  );
                }
              }
              await this.complete_upload(metadata);
              resolve();
            },
            (error: any): any => {
              reject(error);
            }
          );
        })
      }
    }
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

  async complete_upload(metadata: MetadataModel): Promise<void> {
    if (metadata.upload.msg !== metadata.upload.ALREADY_UPLOADED) {

      return new Promise((resolve: any): any => {
        if (!metadata.upload.get_all_chunks_completed()) {
          setTimeout(async (): Promise<any> => {
            await this.complete_upload(metadata);
            resolve()
          }, 10000);
        } else {
          metadata.upload.set_msg(metadata.upload.FINISHING_UPLOAD);

          let parts: any = [];
          for (const chunk of metadata.upload['chunks']) {
            const etag_part: any = chunk.get_etag_part_json();
            parts.push(etag_part);
          }
          parts = JSON.stringify(parts);
          this.upload_service.complete_multipart_upload(metadata.IMS_ID, parts, metadata.upload.md5_checksum).subscribe(
            (result: any): any => {
              metadata.upload.set_upload_completed();
            },
            (error: any): any => {
              console.log(error);
            }
          );
          resolve();
        }
      })
    }
  }

}
