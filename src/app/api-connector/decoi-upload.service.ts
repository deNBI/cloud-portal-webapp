import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * Decoi upload service.
 */
@Injectable()
export class DecoiUploadService {

  constructor(private http: HttpClient) {
  }

  get_presigned_urls(file_name: string, file_size: number): Observable<any> {
    const params: HttpParams = new HttpParams().set('key', file_name).set('size', file_size.toString());

    return this.http.get(`${ApiSettings.getApiBaseURL()}decoi/testupload/`, {
      withCredentials: true,
      params: params
    })
  }

  upload_chunk_to_presigned_url(presigned_url: string, chunk_to_upload: File): Observable<any> {
    return this.http.put(presigned_url, chunk_to_upload, {observe: 'events', reportProgress: true });
  }

  complete_multipart_upload(file_name: string, upload_id: string, parts: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('key', file_name)
      .set('upload_id', upload_id)
      .set('parts', parts);

    return this.http.post(`${ApiSettings.getApiBaseURL()}decoi/testupload/`, params, {
      withCredentials: true
    })
  }

}
