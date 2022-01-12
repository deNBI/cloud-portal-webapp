import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSettings } from './api-settings.service';
import { MetadataModel } from '../decoi/model/metadata.model';

/**
 * Decoi upload service.
 */
@Injectable()
export class DecoiUploadService {

	constructor(private http: HttpClient) {
	}

	get_presigned_urls(ims_id: string, file_size: number, md5_checksum: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('ims_id', ims_id).set('size', file_size.toString()).set('md5_checksum', md5_checksum);

		return this.http.get(`${ApiSettings.getApiBaseURL()}decoi/upload/`, {
			withCredentials: true,
			params,
		});
	}

	upload_chunk_to_presigned_url(presigned_url: string, chunk_to_upload: File): Observable<any> {
		let skip_header: HttpHeaders = new HttpHeaders();
		skip_header = skip_header.append('skip', 'true').append('Access-Control-Expose-Headers', 'ETag');

		return this.http.put(presigned_url, chunk_to_upload, { observe: 'events', reportProgress: true, headers: skip_header });
	}

	set_upload_part(ims_id: string, part_number: number, etag: string, md5_checksum: string): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('ims_id', ims_id)
			.set('md5_checksum', md5_checksum)
			.set('part_number', part_number.toString())
			.set('etag', etag);

		return this.http.post(`${ApiSettings.getApiBaseURL()}decoi/upload_part/`, params, {
			withCredentials: true,
		});
	}

	complete_multipart_upload(ims_id: string, md5_checksum: string): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('ims_id', ims_id)
			.set('md5_checksum', md5_checksum);

		return this.http.post(`${ApiSettings.getApiBaseURL()}decoi/upload/`, params, {
			withCredentials: true,
		});
	}

	postMetadata(file: File): Observable<MetadataModel[]> {
		const formData: FormData = new FormData();
		formData.append('upload', file);

		return this.http.post<MetadataModel[]>(`${ApiSettings.getApiBaseURL()}decoi/metadata/`, formData, {
			withCredentials: true,
			reportProgress: true,

		});

	}
}
