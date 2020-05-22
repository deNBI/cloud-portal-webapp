import {Injectable} from '@angular/core';
import {Image} from '../virtualmachines/virtualmachinemodels/image';
import {SnapshotModel} from '../virtualmachines/snapshots/snapshot.model';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {IResponseTemplate} from './response-template';
import {BlockedImageTag, BlockedImageTagResenv, ImageLogo, ImageMode, ImageTag} from '../facility_manager/image-tag';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides image methods.
 */
@Injectable()
export class ImageService {
  constructor(private http: HttpClient) {
  }

  getImages(project_id: number): Observable<Image[]> {
    const params: HttpParams = new HttpParams().set('project_id', project_id.toString());

    return this.http.get<Image[]>(`${ApiSettings.getApiBaseURL()}images/`, {
      withCredentials: true,
      params: params
    })

  }

  getImageByProjectAndName(project_id: number, name: string): Observable<Image> {
    const params: HttpParams = new HttpParams().set('name', name);

    return this.http.get<Image>(`${ApiSettings.getApiBaseURL()}images/project/${project_id}/`, {
      withCredentials: true,
      params: params
    })

  }

  checkSnapshotNameAvailable(snapshot_name: string): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}snapshots/names/`, {
      withCredentials: true,
      params: {snapshot_name: snapshot_name}

    })

  }

  getSnapshot(openstack_id: string): Observable<Image> {

    return this.http.get<Image>(`${ApiSettings.getApiBaseURL()}snapshots/${openstack_id}/status/`, {
      withCredentials: true
    })

  }

  getImageTags(facility: number): Observable<any> {
    const params: HttpParams = new HttpParams().set('facility', facility.toString());

    return this.http.get(`${ApiSettings.getApiBaseURL()}imageTags/`, {
      withCredentials: true,
      params: params
    })

  }

  getImageModes(facility: number): Observable<any> {
    const params: HttpParams = new HttpParams().set('facility', facility.toString());

    return this.http.get(`${ApiSettings.getApiBaseURL()}imageModes/`, {
      withCredentials: true,
      params: params
    })

  }

  getBlockedImageTags(facility_id: number): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}blockedImageTags/`, {
      withCredentials: true,
      params: {facility_id: facility_id.toString()}
    })
  }

  getBlockedImageTagsResenv(facility_id: number, is_client?: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}blockedImageTagsResenv/`, {
      withCredentials: true,
      params: {facility_id: facility_id.toString(), is_client: is_client}
    })
  }

  addImageMode(mode: ImageMode, facility: number): Observable<ImageMode> {

    const params: HttpParams = new HttpParams().set('facility', facility.toString()).set('mode', JSON.stringify(mode));

    return this.http.post<ImageMode>(`${ApiSettings.getApiBaseURL()}imageModes/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  updateImageMode(mode: ImageMode): Observable<ImageMode> {

    const params: HttpParams = new HttpParams().set('mode', JSON.stringify(mode));

    return this.http.patch<ImageMode>(`${ApiSettings.getApiBaseURL()}imageModes/${mode.id}/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  addImageTags(imageTag: string, imageModes: ImageMode[], facility: number): Observable<ImageTag> {

    const params: HttpParams = new HttpParams()
      .set('imageTag', imageTag).set('facility', facility.toString()).set('imageModes', JSON.stringify(imageModes));

    return this.http.post<ImageTag>(`${ApiSettings.getApiBaseURL()}imageTags/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  addBlockedImageTag(imageTag: string, facility_id: number): Observable<BlockedImageTag> {
    const params: HttpParams = new HttpParams().set('imageTag', imageTag).set('facility_id', facility_id.toString());

    return this.http.post<BlockedImageTag>(`${ApiSettings.getApiBaseURL()}blockedImageTags/`, params, {
      withCredentials: true
      // headers: header
    })
  }

  addBlockedImageTagResenv(imageTag: string, resenvs: string[], facility_id: number): Observable<BlockedImageTagResenv> {
    const params: HttpParams = new HttpParams()
      .set('imageTag', imageTag)
      .set('facility_id', facility_id.toString())
      .set('resenvs', resenvs.toString());

    return this.http.post<BlockedImageTagResenv>(`${ApiSettings.getApiBaseURL()}blockedImageTagsResenv/`, params, {
      withCredentials: true
    })
  }

  getImageLogos(): Observable<ImageLogo[]> {
    return this.http.get<ImageLogo[]>(`${ApiSettings.getApiBaseURL()}imageLogoTags/`, {
      withCredentials: true
    })

  }

  addImageLogos(imageTag: string, url: string): Observable<ImageLogo> {

    const params: HttpParams = new HttpParams().set('tag', imageTag).set('url', url);

    return this.http.post<ImageLogo>(`${ApiSettings.getApiBaseURL()}imageLogoTags/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  deleteImageLogoTag(imageTag: string | number): Observable<IResponseTemplate> {

    return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}imageLogoTags/${imageTag}/`, {
      withCredentials: true
      // headers: header
    })

  }

  deleteImageTag(id: string): Observable<IResponseTemplate> {

    return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}imageTags/${id}/`, {
      withCredentials: true
      // headers: header
    })

  }

  deleteImageMode(id: string): Observable<IResponseTemplate> {

    return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}imageModes/${id}/`, {
      withCredentials: true
      // headers: header
    })

  }

  deleteBlockedImageTag(imageTag: string, facility_id: number): Observable<IResponseTemplate> {
    const params: HttpParams = new HttpParams().set('facility_id', facility_id.toString());

    return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}blockedImageTags/${imageTag}/`, {
      withCredentials: true,
      //// headers: header,
      params: params
    })

  }

  deleteBlockedImageTagResenv(imageTag: string, facility_id: number): Observable<IResponseTemplate> {
    const params: HttpParams = new HttpParams().set('facility_id', facility_id.toString());

    return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}blockedImageTagsResenv/${imageTag}/`, {
      withCredentials: true,
      params: params
    })

  }

  createSnapshot(snaptshot_instance: string, snapshot_name: string, description: string): Observable<SnapshotModel> {

    const params: HttpParams = new HttpParams()
      .set('snapshot_name', snapshot_name)
      .set('snapshot_instance', snaptshot_instance)
      .set('description', description);

    return this.http.post<SnapshotModel>(`${ApiSettings.getApiBaseURL()}snapshots/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  deleteSnapshot(snapshot_id: string): Observable<IResponseTemplate> {
    return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}snapshots/${snapshot_id}/`, {
      withCredentials: true
      // headers: header
    })

  }

  getSnapshotsByUser(currentPage: number, snapsPerSite: number, filter?: string): Observable<SnapshotModel[]> {
    let params: HttpParams = new HttpParams().set('page', currentPage.toString()).set('snaps_per_site', snapsPerSite.toString());

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<SnapshotModel[]>(`${ApiSettings.getApiBaseURL()}snapshots/`, {
      withCredentials: true,
      params: params
    })

  }

}
