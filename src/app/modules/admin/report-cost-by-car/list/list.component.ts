import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent,
} from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Service } from '../page.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

// Interface สำหรับข้อมูลรถและค่าใช้จ่าย
interface CarExpense {
    id: string;
    code: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    totalExpense: number;
}

@Component({
    selector: 'income-expense-report',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatTableModule,
        MatMenuModule,
        MatSortModule,
        DatePipe,
    ],
    providers: [DatePipe],
})
export class ListComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    isLoading: boolean = false;

    // Data source และ columns
    dataSource = new MatTableDataSource<CarExpense>([]);
    displayedColumns: string[] = ['license', 'car', 'expense', 'actions'];
    itemData: any;
    // Pagination   
    pageSize: number = 10;
    pageIndex: number = 0;
    totalItems: number = 0;
    products: any[] = []
    // Form
    searchForm: FormGroup;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: Service,
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _datePipe: DatePipe,
        private _router: Router
    ) {

        this.searchForm = this._fb.group({
            licensePlate: [''],
            brand: [''],
            startDate: [null],
            endDate: [null],
        });
    }

    ngOnInit(): void {
        this.search();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this._changeDetectorRef.detectChanges();
    }

    async search(): Promise<void> {
        this.isLoading = true;

        try {
            const formValues = this.searchForm.value;

            // แปลงค่า date เป็น string format
            const startDate = formValues.startDate
                ? this._datePipe.transform(formValues.startDate, 'yyyy-MM-dd')
                : '';
            const endDate = formValues.endDate
                ? this._datePipe.transform(formValues.endDate, 'yyyy-MM-dd')
                : '';

            // สร้าง parameters

            this._service.getProduct().subscribe(async (resp: any) => {
                // this.products = resp.data
                const params = resp.data.map(item => item.id);
                console.log(params);

                const response = await this._service.getReportData(params).toPromise();
                console.log(response.data);
                
                this.itemData = response.data.products;
                console.log(this.itemData,'itemData');
                
                this._changeDetectorRef.markForCheck();
            })

            // this.totalItems = response.length;
        } catch (error) {
            console.error('Error fetching car expense data:', error);
        } finally {
            this.isLoading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.search();
    }

    viewDetail(row: any): void {
        this._router.navigate(['/admin/product/view/' + row.product_details.id])
    }

    exportPDF(row: CarExpense): void {
        console.log('Export PDF for car:', row);
    }

    calculateTotalAmount(
        expenses: { expense_type_id: string; total_amount: string }[] | null | undefined
    ): number {
        if (!expenses || expenses.length === 0) {
            return 0;
        }

        return expenses.reduce((total, item) => {
            const amount = parseFloat(item.total_amount) || 0;
            return total + amount;
        }, 0);
    }
}
