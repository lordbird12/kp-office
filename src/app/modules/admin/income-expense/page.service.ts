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
    constructor(private _httpClient: HttpClient) { }

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
            .post<any>(environment.baseURL + '/api/income_expense_tracker', data)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any): Observable<any> {
        return this._httpClient.delete<any>(
            environment.baseURL + '/api/income_deduct_trans/' + id,
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
            .get<any>(environment.baseURL + '/api/get_category_attribute')
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

    // getProductAttribute(id: any): Observable<any> {
    //     return this._httpClient
    //         .get<any>(environment.baseURL + '/api/product_attribute/' + id)
    //         .pipe(
    //             tap((data) => {
    //                 this._data.next(data);
    //             })
    //         );
    // }
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

    getCategoryJobs(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_work_type')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getProducts(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_all')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getWorkType(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_work_type')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getExpenseType(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_expenses')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getProductAttribute(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_attribute_all')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }

    getProductByBrand(id: number): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_product_by_brand/' + id)
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
            .get<any>(environment.baseURL + '/api/income_expense_tracker/' + id)
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
                environment.baseURL + '/api/income_expense_tracker_page',
                dataTablesParameters,
                this.httpOptionsFormdata
            )
            .pipe(
                switchMap((response: any) => {
                    return of(response.data);
                })
            );
        // const mockResponse: DataTablesResponse = {
        //     current_page: 1,
        //     data: [
        //       {
        //         id: 1,
        //         date: '2025-04-10',
        //         type: 'รายรับ',
        //         category: 'ค่าจ้าง',
        //         description: 'รับเงินจากงานฟรีแลนซ์',
        //         amount: 5000,
        //         payment_method: 'เงินโอน',
        //         attachment: 'https://example.com/uploads/receipt1.jpg',
        //         created_by: 'สมชาย ใจดี',
        //       },
        //       {
        //         id: 2,
        //         date: '2025-04-09',
        //         type: 'รายจ่าย',
        //         category: 'ค่าน้ำมัน',
        //         description: 'เติมน้ำมันรถไปพบลูกค้า',
        //         amount: 1200,
        //         payment_method: 'เงินสด',
        //         attachment: null,
        //         created_by: 'สมหญิง สุภาพ',
        //       },
        //       {
        //         id: 3,
        //         date: '2025-04-08',
        //         type: 'รายจ่าย',
        //         category: 'ค่าขนส่ง',
        //         description: 'ส่งพัสดุให้ลูกค้า',
        //         amount: 300,
        //         payment_method: 'เงินโอน',
        //         attachment: 'https://example.com/uploads/shipping.jpg',
        //         created_by: 'ธนา เก่งกล้า',
        //       }
        //     ],
        //     first_page_url: '',
        //     from: 1,
        //     last_page: 1,
        //     per_page: 10,
        //     to: 3,
        //     total: 3,
        //     meta: {
        //       itemsPerPage: 10,
        //       totalItems: 3,
        //       currentPage: 1,
        //       totalPages: 1,
        //       sortBy: [],
        //       filter: {}
        //     }
        //   };

        //   return of(mockResponse).pipe(delay(500));

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

    update(data: FormData, id: number): Observable<any> {
        // Throw error, if the user is already logged in
        //  if (this._authenticated) {
        //     return throwError('User is already logged in.');
        // }
        return this._httpClient
            .put(environment.baseURL + '/api/income_expense_tracker/' + id, data)
            .pipe(
                switchMap((response: any) => {
                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    statusUpdate(data: FormData): Observable<any> {
        return of({
            success: true,
            message: 'Status updated successfully',
            data: {
                id: 1,
                status: 'updated',
            },
        });

        // return throwError(() => ({
        //     success: false,
        //     message: 'Failed to update status',
        //     error: {
        //         code: 400,
        //         details: 'Invalid data provided',
        //     },
        // }));
    }

    upload_images(data: FormData): Observable<any> {
        return this._httpClient.post<any>(
            environment.baseURL + '/api/upload_images',
            data,
            this.httpOptionsFormdata
        );
    }
    getUser(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_user')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getIncome(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_income')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getDeduct(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_deduct')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getIncomeExpenseType(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_income_expense_type')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    getMaseter(): Observable<any> {
        return this._httpClient
            .get<any>(environment.baseURL + '/api/get_master_jobs')
            .pipe(
                tap((data) => {
                    this._data.next(data);
                })
            );
    }
}
