import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
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
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { tap } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';

@Component({
    selector: 'employee-list',
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
        MatPaginatorModule,
        MatTableModule,
        DataTablesModule,
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    payrolls: any;
    public dataRow: any[];

    year: any[]=[
        '2022','2023','2024','2025','2026'
    ]
    month: any[] = [
        { code: '01', name: 'มกราคม' },
        { code: '02', name: 'กุมภาพันธ์' },
        { code: '03', name: 'มีนาคม' },
        { code: '04', name: 'เมษายน' },
        { code: '05', name: 'พฤษภาคม' },
        { code: '06', name: 'มิถุนายน' },
        { code: '07', name: 'กรกฎาคม' },
        { code: '08', name: 'สิงหาคม' },
        { code: '09', name: 'กันยายน' },
        { code: '10', name: 'ตุลาคม' },
        { code: '11', name: 'พฤศจิกายน' },
        { code: '12', name: 'ธันวาคม' },
    ];
    form: FormGroup;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _fb : FormBuilder
    ) {
        this.form = this._fb.group({
            year: '',
            month: ''
        })
    }

    ngOnInit() {

        const currentYear = new Date().getFullYear().toString();
        const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2); // แปลงเดือนให้เป็นรูปแบบสองหลัก เช่น '01', '02'
    
        this.form.patchValue({
            year: currentYear,
            month: currentMonth
        })
 
        this._service.getPayroll(this.form.value).subscribe((resp: any) => {
            this.payrolls = resp.data;
            this._changeDetectorRef.markForCheck();

        });

        // this.loadTable()

    }
    
    getData() {
        this._service.getPayroll(this.form.value).subscribe((resp: any) => {
            this.payrolls = resp.data;
            this._changeDetectorRef.markForCheck();

        });
    }
    clear() {
        this.form.reset()
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    formFieldHelpers: string[] = ['fuse-mat-dense'];
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = null;
                that._service.getPage(dataTablesParameters).subscribe((resp: any) => {
                    this.dataRow = this.payrolls;
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.data.currentPage > 1) {
                        this.pages.begin =
                            parseInt(resp.per_page) *
                            (parseInt(resp.current_page) - 1);
                    } else {
                        this.pages.begin = 0;
                    }

                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: [],
                    });
                    this._changeDetectorRef.markForCheck();
                });
            },
            columns: [
                { data: 'action',orderable: false },
                { data: 'No' },
                { data: 'name' },
                { data: 'detail' },
                { data: 'detail' },
                { data: 'detail' },
                { data: 'detail' },
                { data: 'create_by' },
                { data: 'created_at' },

            ],
        };
    }

    pdf() {
        window.open('https://asha-tech.co.th/paknam/public/api/export_pdf_payroll/1')
    }

    syncOlaf() {
        this.payrolls.forEach(data => {
            console.log('data', data);
            const item = {
                employee_no: data.employeeNo,
                group_name: data.groupName,
                absent_count: +data.absentCount,
                actual_workday: +data.actualWorkday,
                late_count: +data.lateCount,
                percen_work: +data.percenWork,
                personal_leave_count: +data.personalLeaveCount,
                sick_leave_count: +data.sickLeaveCount,
                sum_early: +data.sumEarly,
                sum_late: +data.sumLate,
                sum_o_t: +data.sumOT,
                total_workday: +data.totalWorkday,
                name: data.name,
                month: this.form.value.month,
                year: this.form.value.year,
                forgot_count: 0
            }
            this._service.syncOlaf(item).subscribe(response => {
            
              console.log('API Response:', response);
            }, error => {
              console.error('API Error:', error);
            });
          });
    }
}
