import {
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { environment } from 'environments/environment.development';
import { DataTablesResponse } from 'app/shared/datatable.types';
const token = localStorage.getItem('accessToken') || null;

@Injectable({ providedIn: 'root' })
export class PageService {
    // Private
    private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    create(data: FormData): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/brand_model', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    update(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/brand_model/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/brand_model/' + id,
        );
    }

    getAllMenu(): Observable<any> {
        return this._httpClient.get(environment.baseURL + '/api/get_menu').pipe(
            switchMap((response: any) => {
                return of(response.data);
            })
        );
    }

    getBrand(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_brand')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getById(id: string): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/brand_model/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getPermission(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_permission')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    /**
     * Get products
     *
     *
     * @param page
     * @param perPage
     * @param sortBy
     * @param order
     * @param search
     */

    getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/brand_model_page',
                dataTablesParameters,
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
}
