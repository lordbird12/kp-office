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
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'late-list',
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
    incomePaid: any;
    deductPaid: any;
    public dataRow: any[];
    userData: any;
    incomeData: any;
    deductData: any;
    year: any[] = [
        '2022', '2023', '2024', '2025', '2026'
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
        private _fb: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService
    ) {

        this.userData = this._activatedRoute.snapshot.data.user.data;
        this.incomeData = this._activatedRoute.snapshot.data.income.data;
        this.deductData = this._activatedRoute.snapshot.data.deduct.data;
        
        this.form = this._fb.group({
            year: '',
            user_id: '',
            month: ''
        })
    }

    ngOnInit() {
        const currentYear = new Date().getFullYear().toString();
        const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2); // แปลงเดือนให้เป็นรูปแบบสองหลัก เช่น '01', '02'

        this.form.patchValue({
            year: currentYear,
            user_id: '',
            month: ''
        })
    }

    getData() {
           // ตรวจสอบว่า user_id หรือ month เป็นค่าว่างหรือไม่
           if (!this.form.value.user_id || !this.form.value.month) {
            this._fuseConfirmationService.open({
                title: 'เกิดข้อผิดพลาด',
                message: 'กรุณาเลือกพนักงานและเดือน',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ยืนยัน',
                        color: 'warn',
                    },
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });
            return; // ยกเลิกการทำงานต่อไป
        }

        this.getIncomePaid();
        this.getDeductPaid();
       
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
                    this.dataRow = this.incomePaid;
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
                { data: 'action', orderable: false },
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

    addElement(action: string) {
        // ตรวจสอบว่า user_id หรือ month เป็นค่าว่างหรือไม่
        if (!this.form.value.user_id || !this.form.value.month) {
            this._fuseConfirmationService.open({
                title: 'เกิดข้อผิดพลาด',
                message: 'กรุณาเลือกพนักงานและเดือน',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ยืนยัน',
                        color: 'warn',
                    },
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });
            return; // ยกเลิกการทำงานต่อไป
        }
    
        const dialogRef = this.dialog.open(FormDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: {
                income: this.incomeData,
                deduct: this.deductData,
                form: this.form.value,
                type: action
            }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getData()
                // this.rerender()
            }
        });
    }
    

    delete(itemid: any, type: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._service.delete(itemid, type).subscribe((resp) => {
                   this.getData()
                });
            }
            error: (err: any) => { };
        });
    }

    getIncomePaid() {
        this._service.getIncomePaid(this.form.value).subscribe((resp: any) => {
            this.incomePaid = resp.data;
            this._changeDetectorRef.markForCheck();
        });
    }
    getDeductPaid() {
        this._service.getDeductPaid(this.form.value).subscribe((resp: any) => {
            this.deductPaid = resp.data;
            console.log(this.deductPaid);
            
            this._changeDetectorRef.markForCheck();
        });
    }
}
