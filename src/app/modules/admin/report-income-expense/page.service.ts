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
    getReportData(params : any): Observable<any> {
        const { startDate, endDate, reportType } = params;
        return this._httpClient.get<any>(
            `${environment.baseURL}/api/get_income_expense_tracker/${startDate}`,
            this.httpOptionsFormdata
        );
        const mockData = [
            {
                item: 'Sell Toyota Vios',
                type: 'Income',
                category: 'Car Sales',
                description: 'Cash from customer',
                income: 250000,
                expense: null,
            },
            {
                item: 'Spare parts',
                type: 'Expense',
                category: 'Vehicle Cost',
                description: 'New tires x4',
                income: null,
                expense: 12000,
            },
            {
                item: 'Electric Bill',
                type: 'Expense',
                category: 'Utility',
                description: 'Monthly electric and water',
                income: null,
                expense: 3200,
            },
            {
                item: 'Customer Deposit',
                type: 'Income',
                category: 'Deposit',
                description: 'Reserve Honda City',
                income: 20000,
                expense: null,
            },
            {
                item: 'Mechanic Fee',
                type: 'Expense',
                category: 'Service/Labor',
                description: 'Repair suspension system',
                income: null,
                expense: 1500,
            },
        ];
        return of(mockData);;
    }
}
