import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Service } from '../page.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

interface ReportItem {
    item: string;
    type: 'Income' | 'Expense';
    category: string;
    description: string;
    income: number | null;
    expense: number | null;
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
        DatePipe,
    ],
    providers: [DatePipe],
})
export class ListComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    isLoading: boolean = false;
    reportData: any[] = [];
    currentDate: Date = new Date();
    totalIncome = 0;
    incomeCash = 0;
    incomeTransfer = 0;
    incomeCredit = 0;

    totalExpense = 0;
    expenseCash = 0;
    expenseTransfer = 0;
    expenseCredit = 0;

    netProfit = 0; // totalIncome - totalExpense
    filterDate = {
        start: null,
        end: null
    };
    dateFilterForm: FormGroup;

    constructor(
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: Service,
        private _fb: FormBuilder,
        private _http: HttpClient
    ) {
        this.dateFilterForm = this._fb.group({
            startDate: [new Date()],
            endDate: [new Date()],
            reportType: ['daily'],
        });
    }

    ngOnInit(): void {
        // Load initial data
        this.search();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    async search(): Promise<void> {
        try {
            this.isLoading = true;

            // Get form values
            const startDate = this.dateFilterForm.get('startDate').value;
            const endDate = this.dateFilterForm.get('endDate').value;
            const reportType = this.dateFilterForm.get('reportType').value;

            // Prepare API request parameters
            const params = {
                startDate: this.formatDate(startDate),
                endDate: this.formatDate(endDate),
                reportType: reportType,
            };

            // Call API to get report data
            const response = await this._service.getReportData(params).toPromise();

            // Update report data
            // this.reportData = response.data;
            this.reportData = response.data;
            console.log(this.reportData);

            // Calculate summary
            this.calculateSummary();
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            this.isLoading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    private formatDate(date: Date): string {
        // Format date as YYYY-MM-DD using Luxon
        return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    }

    // private calculateSummary(): void {
    //     // Calculate total income
    //     this.totalIncome = this.reportData
    //         .filter((item) => item.type.type === 'income')
    //         .reduce((sum, item) => sum + (+item.amount || 0), 0);

    //     // Calculate total expense
    //     this.totalExpense = this.reportData
    //         .filter((item) => item.type.type === 'expense')
    //         .reduce((sum, item) => sum + (+item.amount || 0), 0);

    //     // Calculate net profit/loss
    //     this.netProfit = this.totalIncome - this.totalExpense;
    // }

    calculateSummary(): void {
        // รีเซ็ตค่าก่อน
        this.totalIncome = this.incomeCash = this.incomeTransfer = this.incomeCredit = 0;
        this.totalExpense = this.expenseCash = this.expenseTransfer = this.expenseCredit = 0;

        this.reportData.forEach((item: any) => {
            const amount = parseFloat(item.amount) || 0;
            const type = item.type?.type;
            const payment = item.payment_type;

            if (type === 'income') {
                if (payment === 'cash') {
                    this.incomeCash += amount;
                    this.totalIncome += amount;
                } else if (payment === 'transfer') {
                    this.incomeTransfer += amount;
                    this.totalIncome += amount;
                } else if (payment === 'credit') {
                    this.incomeCredit += amount;
                    // ❌ ไม่บวกเข้ายอดรวม
                }
            } else if (type === 'expense') {
                if (payment === 'cash') {
                    this.expenseCash += amount;
                    this.totalExpense += amount;
                } else if (payment === 'transfer') {
                    this.expenseTransfer += amount;
                    this.totalExpense += amount;
                } else if (payment === 'credit') {
                    this.expenseCredit += amount;
                    // ❌ ไม่บวกเข้ายอดรวม
                }
            }
        });

        this.netProfit = this.totalIncome - this.totalExpense; // ไม่มีเครดิตรวมอยู่
    }

}
