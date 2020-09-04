import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

/**
 * Service which delivers functions for services related to the credit service.
 */
@Injectable()
export class CreditsService {
  constructor(private http: HttpClient) {
  }

  /**
   * Get credits for project application.
   * @returns {int} The expected credits for the resources.
   */
  public getCreditsForApplication(cpus: number, ram: number, months: number): Observable<number> {
    const params: HttpParams = new HttpParams().set('cpu', cpus.toString()).set('ram', ram.toString()).set('months', months.toString());

    return this.http.get<number>(`${ApiSettings.getApiBaseURL()}creditManager/getCreditsForApplication/`, {
      withCredentials: true,
      params: params
    });
  }

  /**
   * Get credits for project application.
   * @returns {int} The expected credits for the resources.
   */
  public getExtraCreditsForExtension(cpus: number, ram: number, months: number, projectApplicationId: string): Observable<number> {
    const params: HttpParams = new HttpParams().set('new_cpu', cpus.toString()).set('new_ram', ram.toString())
      .set('new_lifetime', months.toString()).set('project_application_id', projectApplicationId);

    return this.http.get<number>(`${ApiSettings.getApiBaseURL()}creditManager/getExtraCreditsNumber/`, {
      withCredentials: true,
      params: params
    });
  }

  /**
   * Get credits for project application.
   * @returns {int} The expected credits for the resources.
   */
  public getExtraCreditsForLifetimeExtension(months: number, projectApplicationId: string): Observable<number> {
    const params: HttpParams = new HttpParams().set('new_lifetime', months.toString())
      .set('project_application_id', projectApplicationId);

    return this.http.get<number>(`${ApiSettings.getApiBaseURL()}creditManager/getExtraCreditsNumberLifetime/`, {
      withCredentials: true,
      params: params
    });
  }

  /**
   * Get credits for project resource application.
   * @returns {int} The expected credits for the resources.
   */
  public getExtraCreditsForResourceExtension(cpus: number, ram: number, projectApplicationId: string): Observable<number> {
    const params: HttpParams = new HttpParams().set('new_cpu', cpus.toString()).set('new_ram', ram.toString())
      .set('project_application_id', projectApplicationId);

    return this.http.get<number>(`${ApiSettings.getApiBaseURL()}creditManager/getExtraCreditsNumberResource/`, {
      withCredentials: true,
      params: params
    });
  }

  /**
   * Get credits value per hour for specified resources.
   * @param cpus Number of cpus
   * @param ram Amount of ram
   */
  public getCreditsPerHour(cpus: number, ram: number): Observable<number> {
    const params: HttpParams = new HttpParams().set('cpu', cpus.toString()).set('ram', ram.toString());

    return this.http.get<number>(`${ApiSettings.getApiBaseURL()}creditManager/getCreditsPerHour/`, {
      withCredentials: true,
      params: params
    });
  }

  /**
   * Get current credits of project.
   * @param group_id
   */
  public getCurrentCreditsOfProject(group_id: number | string): Observable<number> {
    return this.http.get<number>(`${ApiSettings.getApiBaseURL()}creditManager/${group_id}/getUsedCredits/`, {
      withCredentials: true
    });
  }

  /**
   * Gets credits history of project.
   * @param group_id
   */
  public getCreditsUsageHistoryOfProject(group_id: number): Observable<{}> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}creditManager/${group_id}/getCreditsHistory/`, {
      withCredentials: true
    });
  }
}
