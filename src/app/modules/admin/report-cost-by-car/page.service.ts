import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
} from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';
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
            .post<any>(environment.baseURL + '/api/deduct', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/deduct/' + id,
            { headers: this.httpOptionsFormdata.headers }
        );
    }

    getById(id: any): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/deduct/' + id)
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient
            .post(
                environment.baseURL + '/api/deduct_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
    }

    update(data: FormData, id: number): Observable<any> {
        return this._httpClient
            .put(environment.baseURL + '/api/deduct/' + id, data)
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }
    getReportData(data: any): Observable<any> {
        return this._httpClient.post<any>(
            `${environment.baseURL}/api/report_summary_by_product`,{products: data} ,
            this.httpOptionsFormdata
        );
        const mockData = [
            {
                id: '1',
                code: 'V1234',
                licensePlate: 'กทท-1234',
                brand: 'Toyota',
                model: 'Vios',
                year: '2017',
                totalExpense: 1700,
            },
            {
                id: '2',
                code: 'H5678',
                licensePlate: '2ขก-5678',
                brand: 'Honda',
                model: 'Civic',
                year: '2019',
                totalExpense: 11500,
            },
            {
                id: '3',
                code: 'M9999',
                licensePlate: '3ฌฮ-9999',
                brand: 'Mitsubishi',
                model: 'Triton',
                year: '2020',
                totalExpense: 1000,
            },
        ];
        return of(mockData);
    }
    
     getProduct(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_all')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
}
