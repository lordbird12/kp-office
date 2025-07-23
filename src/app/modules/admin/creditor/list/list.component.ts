

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTime } from 'luxon';
import { MatMenuModule } from '@angular/material/menu';
export const creditors = [
    {
        id: 1,
        employee_name: 'พนักงาน 1',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-03',
        amount: 1372.39,
        is_paid: true,
        paid_date: '2025-05-04',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 2,
        employee_name: 'พนักงาน 2',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-06',
        amount: 3353.87,
        is_paid: true,
        paid_date: '2025-05-10',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 3,
        employee_name: 'พนักงาน 3',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-10',
        amount: 3373.68,
        is_paid: true,
        paid_date: '2025-05-18',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 4,
        employee_name: 'พนักงาน 4',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-08',
        amount: 903.98,
        is_paid: true,
        paid_date: '2025-05-12',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 5,
        employee_name: 'พนักงาน 5',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-04',
        amount: 1012.27,
        is_paid: true,
        paid_date: '2025-05-11',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 11,
        employee_name: 'พนักงาน 1',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-06',
        amount: 3790.28,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 12,
        employee_name: 'พนักงาน 2',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-04',
        amount: 1175.69,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 13,
        employee_name: 'พนักงาน 3',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-02',
        amount: 2847.83,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 14,
        employee_name: 'พนักงาน 4',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-05',
        amount: 1051.13,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 15,
        employee_name: 'พนักงาน 5',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-08',
        amount: 4916.20,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    }
];

export const debtors = [
    {
        id: 1,
        employee_name: 'พนักงาน 1',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-03',
        amount: 1372.39,
        is_paid: true,
        paid_date: '2025-05-04',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 2,
        employee_name: 'พนักงาน 2',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-06',
        amount: 3353.87,
        is_paid: true,
        paid_date: '2025-05-10',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 3,
        employee_name: 'พนักงาน 3',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-10',
        amount: 3373.68,
        is_paid: true,
        paid_date: '2025-05-18',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 4,
        employee_name: 'พนักงาน 4',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-08',
        amount: 903.98,
        is_paid: true,
        paid_date: '2025-05-12',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 5,
        employee_name: 'พนักงาน 5',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-04',
        amount: 1012.27,
        is_paid: true,
        paid_date: '2025-05-11',
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 11,
        employee_name: 'พนักงาน 1',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-06',
        amount: 3790.28,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 12,
        employee_name: 'พนักงาน 2',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-04',
        amount: 1175.69,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 13,
        employee_name: 'พนักงาน 3',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-02',
        amount: 2847.83,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 14,
        employee_name: 'พนักงาน 4',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-05',
        amount: 1051.13,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    },
    {
        id: 15,
        employee_name: 'พนักงาน 5',
        loan_reason: 'ยืมเงินชั่วคราว',
        loan_date: '2025-05-08',
        amount: 4916.20,
        is_paid: false,
        paid_date: null,
        note: 'ลูกหนี้ภายในองค์กร'
    }
];


@Component({
    selector: 'creditor-list',
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
        MatTabsModule,
        MatMenuModule
    ],
})



export class ListComponent implements OnInit, AfterViewInit {
    selectedTabIndex = 0;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    dataRow: any[] = [];
    creditorDtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 10,
        responsive: true
    };

    debtorDtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 10,
        responsive: true
    };

    creditorFilterStart?: Date;
    creditorFilterEnd?: Date;
    debtorFilterStart?: Date;
    debtorFilterEnd?: Date;
    form: FormGroup
    // สำเนาข้อมูลต้นฉบับ
    allCreditors = [...creditors]; // ตั้งต้นจาก service หรือ mock
    allDebtors = [...debtors];

    creditors = [...this.allCreditors];
    debtors = [...this.allDebtors];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fb: FormBuilder
    ) {

        this.form = this._fb.group({
            status: [''],
            partner_name: [''],
            start_date: [''],
            end_date: [''],
        });
    }

    ngOnInit() {
        this.loadTable();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

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
                const formValue = this.form.value;

                dataTablesParameters.status = formValue.status ?? null;
                dataTablesParameters.partner_name = formValue.partner_name ?? null;
                // format วันที่เป็น yyyy-MM-dd
                const formatDate = (d: any) =>
                    d ? DateTime.fromJSDate(new Date(d)).toFormat('yyyy-MM-dd') : null;

                dataTablesParameters.start_date = formatDate(formValue.start_date);
                dataTablesParameters.end_date = formatDate(formValue.end_date);

                // 🔻 กำหนด partner_type ตาม tab ปัจจุบัน
                dataTablesParameters.partner_type = this.currentPartnerType;
                that._service.getPage(dataTablesParameters).subscribe((resp: any) => {
                    this.dataRow = resp.data;
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin =
                            resp.per_page * resp.current_page - 1;
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
                { data: 'create_by' },
                { data: 'created_at' },

            ],
        };
    }

    deleteElement(): void {
        const dialogRef = this._fuseConfirmationService.open({
            "title": "ลบข้อมูล",
            "message": "คุณต้องการลบข้อมูลใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation-triangle",
                "color": "warn"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ตกลง",
                    "color": "warn"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log('delete complete')
            } else {
                console.log('cancel');

            }
        });

    }
    addElement() {
        this._router.navigate(['/admin/creditor/form'])
    }
    editElement(data: any) {
        this._router.navigate(['/admin/creditor/edit/' + data.id])
    }


    // ฟังก์ชันกรอง
    filterCreditors() {
        this.creditors = this.allCreditors.filter((item: any) => {
            const due = new Date(item.due_date);
            return (!this.creditorFilterStart || due >= this.creditorFilterStart) &&
                (!this.creditorFilterEnd || due <= this.creditorFilterEnd);
        });
    }

    clearCreditorFilter() {
        this.creditorFilterStart = this.creditorFilterEnd = undefined;
        this.creditors = [...this.allCreditors];
    }

    filterDebtors() {
        this.debtors = this.allDebtors.filter(item => {
            const loan = new Date(item.loan_date);
            return (!this.debtorFilterStart || loan >= this.debtorFilterStart) &&
                (!this.debtorFilterEnd || loan <= this.debtorFilterEnd);
        });
    }

    clearDebtorFilter() {
        this.debtorFilterStart = this.debtorFilterEnd = undefined;
        this.debtors = [...this.allDebtors];
    }

    onTabChanged(index: number) {
        this.selectedTabIndex = index;
        this.rerender(); // โหลดข้อมูลใหม่
    }

    get currentPartnerType(): 'creditor' | 'debtor' {
        return this.selectedTabIndex === 0 ? 'creditor' : 'debtor';
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    ClearForm(){
        this.form.reset()
        this.rerender()
    }

}


