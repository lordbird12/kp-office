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
export class Service {
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
            .post<any>(environment.baseURL + '/api/user', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }



    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/employees/' + id,
            { headers: this.httpOptionsFormdata.headers }
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
    getPermission(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_permission')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getCategories(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_category_product')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getSuppliers(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_supplier')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getBrand(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_brand')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getCompanie(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_companie')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getBrandModel(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_brand_model/' + id)
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getCC(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_c_c')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getColor(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_color')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getCategory3(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_size')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
    getById(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/product/' + id)
            .pipe(
                tap((data) => {
                    this._data.next(data);
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
                environment.baseURL + '/api/product_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }
    getWarehouse(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/product/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    new(data: FormData): Observable<any> {
        // Throw error, if the user is already logged in
        //  if (this._authenticated) {
        //     return throwError('User is already logged in.');
        // }
        return this._httpClient
            .post(
                environment.baseURL + '/api/product',
                data,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    update(data: FormData): Observable<any> {
        // Throw error, if the user is already logged in
        //  if (this._authenticated) {
        //     return throwError('User is already logged in.');
        // }
        return this._httpClient
            .post(
                environment.baseURL + '/api/product',
                data,
            )
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }
}
