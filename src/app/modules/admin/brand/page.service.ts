import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { environment } from 'environments/environment.development';
import { Form } from '@angular/forms';
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
            .post<any>(environment.baseURL + '/api/brand', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    createCC(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/c_c', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    createColor(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/color', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    update(data: any): Observable<any> {
        return this._httpClient
            .post<any>(environment.baseURL + '/api/update_brand', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    updateModel(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/brand_model/'+ id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    updateCC(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/c_c/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    updateColor(data: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(environment.baseURL + '/api/color/' + id, data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/brand/' + id,
        );
    }
    deleteBrandModel(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/brand_model/' + id,
        );
    }
    deleteCC(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/c_c/' + id,
        );
    }
    deleteColor(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/color/' + id,
        );
    }

    getAllMenu(): Observable<any> {
        return this._httpClient.get(environment.baseURL + '/api/get_menu').pipe(
            switchMap((response: any) => {
                return of(response.data);
            })
        );
    }

    getPosition(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/positions')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getById(id: string): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/brand/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getByIdModel(id: string): Observable<any> {
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
                environment.baseURL + '/api/brand_page',
                dataTablesParameters,
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }


    getPageBrandModel(dataTablesParameters: any): Observable<DataTablesResponse> {
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
    getPageCC(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/c_c_page',
                dataTablesParameters,
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    getPageColor(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/color_page',
                dataTablesParameters,
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
}
