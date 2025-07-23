import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { Service } from '../page.service';
import { Employee } from '../page.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BrowserModule } from '@angular/platform-browser';
import { createFileFromBlob } from 'app/shared/helper';

@Component({
    selector: 'app-form-report-product',
    templateUrl: './form-report.component.html',
    styleUrls: ['./form-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
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
        MatRadioModule,
        CommonModule
    ],
})
export class FormReportComponent implements OnInit {
    addForm: FormGroup;
    // flashErrorMessage: string;
    positions: any[];
    flashMessage: 'success' | 'error' | null = null;
    taxType: any[] = [
        {
            id: 1,
            name: 'สินค้ามีภาษี',
        },
        {
            id: 2,
            name: 'สินค้าไม่มีภาษี',
        },
    ];
    uniType: any[] = [
        {
            id: 1,
            name: 'แท่ง',
        },
        {
            id: 2,
            name: 'ชิ้น',
        },
        {
            id: 3,
            name: 'กิโลกรัม',
        },
        {
            id: 4,
            name: 'กล่อง',
        },
    ]
    filteredReports: any[] = [
        {
            id: 1,
            name: 'รายชื่อลูกค้า',
            name_en: 'namelist',
            checked: false
        },
        {
            id: 2,
            name: 'ใบจอง',
            name_en: 'booking',
            checked: false
        },
        {
            id: 3,
            name: 'เงื่อนไขการจอง',
            name_en: 'Condition',
            checked: false
        },
        {
            id: 4,
            name: 'ใบแจ้งช่าง',
            name_en: 'Technician_Notice',
            checked: false
        },
        {
            id: 5,
            name: 'สัญญาซื้อ-ขาย',
            name_en: 'Purchase_sale',
            checked: false
        },
        {
            id: 6,
            name: 'ใบเช็ครถลูกค้า',
            name_en: 'Customer_check',
            checked: false
        },
        {
            id: 7,
            name: 'ใบเช็ครถของช่าง',
            name_en: 'Mechanic_check',
            checked: false
        },
        {
            id: 8,
            name: 'ใบส่งมอบ',
            name_en: 'Delivery_note',
            checked: false
        },
        {
            id: 9,
            name: 'ใบรับประกัน',
            name_en: 'Warranty_card',
            checked: false
        },
        {
            id: 10,
            name: 'ใบคอนเฟิร์มไฟแนนท์',
            name_en: 'Finance_confirmation',
            checked: false
        },
        {
            id: 11,
            name: 'CSR ก่อนส่งมอบ',
            name_en: 'Csr_before',
            checked: false
        },
        {
            id: 12,
            name: 'CSR หลังส่งมอบ',
            name_en: 'Csr_after',
            checked: false
        },
        {
            id: 13,
            name: 'ใบนายหน้า',
            name_en: 'Broker_Certificate',
            checked: false
        },
        {
            id: 14,
            name: 'ใบเช็ครถของช่าง 2',
            name_en: 'Mechanic_check_2',
            checked: false
        },
        {
            id: 15,
            name: 'ใบรับโปร 4 เด้ง',
            name_en: 'Promotion_receipt',
            checked: false
        },
        {
            id: 16,
            name: 'ใบอนุมัติเฮีย',
            name_en: 'approval_certificate',
            checked: false
        },
        {
            id: 17,
            name: 'ใบเช็คระบบ',
            name_en: 'System_check',
            checked: false
        },
        {
            id: 18,
            name: 'ใบนำส่งเอกสาร',
            name_en: 'Document_delivery',
            checked: false
        },
        {
            id: 19,
            name: 'ใบยาง',
            name_en: 'Rubber_form',
            checked: false
        },
        {
            id: 20,
            name: 'ใบส่งงานตรวจ',
            name_en: 'Submit_work',
            checked: false
        },
        {
            id: 21,
            name: 'ตั้งต้นทุน',
            name_en: 'Set_costs',
            checked: false
        },
        {
            id: 22,
            name: 'คืนจอง',
            name_en: 'Reservation',
            checked: false
        },
        {
            id: 23,
            name: 'ใบ VAT',
            name_en: 'vat_form',
            checked: false
        },
        {
            id: 24,
            name: 'แจ้งเตือนการรับรถ',
            name_en: 'Car_Notification',
            checked: false
        },
        {
            id: 25,
            name: 'แผ่นที่ 1',
            name_en: 'Sheet1',
            checked: false
        },
        {
            id: 26,
            name: 'เงื่อนไขการจอง',
            name_en: 'Booking_conditions',
            checked: false
        },
    ]
    constructor(private dialogRef: MatDialogRef<FormReportComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private _service: Service,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // สร้าง Reactive Form
        this.addForm = this.formBuilder.group({
            no: [],
            code: [],
            name: [],
            tax_type: [],
            qty: '',
            price: '',
            cost: '',
            description: '',
            remark: '',
            vendor_id: ''
        });
    }





    onCancelClick(): void {

        this.dialogRef.close();
    }
    sheets: number[] = [];

    selectAll(event: any) {
        const isChecked = event.target.checked;
        this.filteredReports.forEach(report => report.checked = isChecked); // อัพเดตสถานะ checked ของแต่ละรายการ
        if (isChecked) {
          this.sheets = this.filteredReports.map(report => report.id);
        } else {
          this.sheets = [];
        }
      }
      
      onCheckboxChange(event: any) {
        const reportId = Number(event.target.value);
        const report = this.filteredReports.find(report => report.id === reportId);
        if (report) {
          report.checked = event.target.checked; // อัพเดตสถานะ checked ของรายการนั้นๆ
          if (event.target.checked) {
            if (!this.sheets.includes(reportId)) {
              this.sheets.push(reportId);
            }
          } else {
            this.sheets = this.sheets.filter(id => id !== reportId);
          }
        }
      
        // อัพเดทสถานะ checkbox Select All
        this.updateSelectAllStatus();
      }
      
      updateSelectAllStatus() {
        const selectAllCheckbox = (document.querySelector('th input[type="checkbox"]') as HTMLInputElement);
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = this.filteredReports.every(report => report.checked);
          selectAllCheckbox.indeterminate = this.filteredReports.some(report => report.checked) && !selectAllCheckbox.checked;
        }
      }

    //   downloadReport() {
    //     this._service.exportExcel(this.sheets).subscribe((resp:any) => {
    //         console.log(resp);
    //     })
        
    //   }

      downloadReport() {
     
        this._service.exportExcel(this.sheets, this.data.id ).subscribe({
            next: (resp) => {
                // this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `report.xlsx`);
            },
            error: (err) => {
                // this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }

}



