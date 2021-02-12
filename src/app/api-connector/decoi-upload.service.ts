import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MetadataModel} from '../decoi/model/metadata.model';

/**
 * Decoi upload service.
 */
@Injectable()
export class DecoiUploadService {

  constructor(private http: HttpClient) {
  }

  get_presigned_urls(ims_id: string, file_size: number): Observable<any> {
    const params: HttpParams = new HttpParams().set('ims_id', ims_id).set('size', file_size.toString());

    return this.http.get(`${ApiSettings.getApiBaseURL()}decoi/testupload/`, {
      withCredentials: true,
      params: params
    })
  }

  upload_chunk_to_presigned_url(presigned_url: string, chunk_to_upload: File): Observable<any> {
    let skip_header: HttpHeaders = new HttpHeaders();
    skip_header = skip_header.append('skip', 'true').append('Access-Control-Expose-Headers', 'ETag')

    return this.http.put(presigned_url, chunk_to_upload, {observe: 'events', reportProgress: true, headers: skip_header });
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

  postMetadata(file: File): Observable<MetadataModel[]> {
    const formData: FormData = new FormData();
    formData.append('upload', file);

    return this.http.post<MetadataModel[]>(`${ApiSettings.getApiBaseURL()}decoi/metadata/`, formData, {
      withCredentials: true,
      reportProgress: true

    })

  }
}
