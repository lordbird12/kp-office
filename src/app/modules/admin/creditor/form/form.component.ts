

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DateTime } from 'luxon';

@Component({
  selector: 'form-creditor',
  templateUrl: './form.component.html',
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
    MatCheckboxModule
  ],

})
export class FormComponent implements OnInit {
  form: FormGroup;
  isCreditor = true; // เปลี่ยนเป็น false ถ้าเป็นลูกหนี้
  addForm: FormGroup;
  MenuList: any = [];
  gender: any = [
    {
      key: 'M',
      name: 'ผู้ชาย'
    },
    {
      key: 'F',
      name: 'ผู้หญิง'
    }
  ]
  formFieldHelpers: string[] = ['fuse-mat-dense'];
  fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  Id: any;
  type: string = ''
  itemData: any;
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _Service: PageService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _activatedRoute: ActivatedRoute
  ) {
    console.log(this._activatedRoute.snapshot.data);
    console.log(this._activatedRoute.snapshot.params.id);
    this.Id = this._activatedRoute.snapshot.params.id
    this.form = this._formBuilder.group({
      partner_type: ['creditor'], // 'creditor' หรือ 'debtor'
      partner_name: [''],
      transaction_date: DateTime.now(),
      receipe_date: [null],
      direction: [null],
      amount: [0, Validators.required],
      status: [''],
      description: [''],

    });
  }

  ngOnInit(): void {
    if (this.Id) {
      this._Service.getById(this.Id).subscribe((resp: any) => {
        this.itemData = resp.data;
        console.log(this.itemData, 'itemData');
        this.form.patchValue({
          ...this.itemData,

        })
      })
    }
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the form field helpers as string
   */
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }

  backTo() {
    this._router.navigate(['admin/customer/list'])
  }

  onSubmit(): void {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "บันทึกข้อมูล",
      "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation-triangle",
        "color": "accent"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "ตกลง",
          "color": "primary"
        },
        "cancel": {
          "show": true,
          "label": "ยกเลิก"
        }
      },
      "dismissible": true
    })

    dialogRef.afterClosed().subscribe((result => {
      if (result === 'confirmed') {
        let formValue = this.form.value
        const rawDate = this.form.value.transaction_date;
        if (rawDate) {
          const dateObj = rawDate instanceof Date ? rawDate : new Date(rawDate);
          formValue.transaction_date = DateTime.fromJSDate(dateObj).toFormat('yyyy-MM-dd');
        } else {
          formValue.transaction_date = null; // หรือใส่ค่า default ตามที่ต้องการ
        }
            const recepieDate = this.form.value.receipe_date;
        if (rawDate) {
          const dateObj = recepieDate instanceof Date ? recepieDate : new Date(recepieDate);
          formValue.receipe_date = DateTime.fromJSDate(dateObj).toFormat('yyyy-MM-dd');
        } else {
          formValue.receipe_date = null; // หรือใส่ค่า default ตามที่ต้องการ
        }

        console.log(formValue);
        if (!this.Id) {
          this._Service.create(formValue).subscribe({
            next: (resp: any) => {
              // this.showFlashMessage('success');
              this._router.navigateByUrl('admin/creditor/list')
            },
            error: (err: any) => {
              this.form.enable();
              this._fuseConfirmationService.open({
                "title": "กรุณาระบุข้อมูล",
                "message": err.error.message,
                "icon": {
                  "show": true,
                  "name": "heroicons_outline:exclamation",
                  "color": "warning"
                },
                "actions": {
                  "confirm": {
                    "show": false,
                    "label": "ยืนยัน",
                    "color": "primary"
                  },
                  "cancel": {
                    "show": false,
                    "label": "ยกเลิก",

                  }
                },
                "dismissible": true
              });
            }
          })
        } else {
          this._Service.update(formValue, this.Id).subscribe({
            next: (resp: any) => {
              // this.showFlashMessage('success');
              this._router.navigateByUrl('admin/creditor/list')
            },
            error: (err: any) => {
              this.form.enable();
              this._fuseConfirmationService.open({
                "title": "กรุณาระบุข้อมูล",
                "message": err.error.message,
                "icon": {
                  "show": true,
                  "name": "heroicons_outline:exclamation",
                  "color": "warning"
                },
                "actions": {
                  "confirm": {
                    "show": false,
                    "label": "ยืนยัน",
                    "color": "primary"
                  },
                  "cancel": {
                    "show": false,
                    "label": "ยกเลิก",

                  }
                },
                "dismissible": true
              });
            }
          })
        }

      } else {

      }
    })
    )
  }
}

