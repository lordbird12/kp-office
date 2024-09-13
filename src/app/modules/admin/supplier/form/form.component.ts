

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';

@Component({
  selector: 'form-employee',
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
    MatCheckboxModule,
    NgxDropzoneModule
  ],

})
export class FormComponent implements OnInit {
  addForm: FormGroup;
  Id: any;
  MenuList: any = [];
  formFieldHelpers: string[] = ['fuse-mat-dense'];
  fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  itemData: any;
  url_image: string;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dataRow: any[] = [];
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _Service: PageService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id');

    this.addForm = this._formBuilder.group({
      id: '',
      name: '',
      tax: '',
      phone: '',
      email: '',
      detail: '',
      address: '',
      image: '',
      status: '',
    })
  }

  ngOnInit(): void {
    if (this.Id) {
      this._Service.getById(this.Id).subscribe((resp: any) => {
        this.itemData = resp.data;
        console.log(this.itemData)
        this.addForm.patchValue({
          ...this.itemData,
          image: '',
        })
      })
      this.loadTable()
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
    this._router.navigate(['admin/finance/list'])
  }

  onSubmit(): void {
    // Open the confirmation dialog
    if (this.Id) {
      const confirmation = this._fuseConfirmationService.open({
        "title": "แก้ไขข้อมูล",
        "message": "คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ",
        "icon": {
          "show": false,
          "name": "heroicons_outline:exclamation",
          "color": "warning"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "ยืนยัน",
            "color": "primary"
          },
          "cancel": {
            "show": true,
            "label": "ยกเลิก"
          }
        },
        "dismissible": true
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          let formValue = this.addForm.value
          this._Service.update(formValue, this.Id).subscribe({
            next: (resp: any) => {
              this._router.navigate(['admin/supplier/list'])
            },
            error: (err: any) => {
              this.addForm.enable();
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
      })
    } else {
      const confirmation = this._fuseConfirmationService.open({
        "title": "เพิ่มข้อมูล",
        "message": "คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ",
        "icon": {
          "show": false,
          "name": "heroicons_outline:exclamation",
          "color": "warning"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "ยืนยัน",
            "color": "primary"
          },
          "cancel": {
            "show": true,
            "label": "ยกเลิก"
          }
        },
        "dismissible": true
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          let formValue = this.addForm.value
     
          this._Service.create(formValue).subscribe({
            next: (resp: any) => {
              this._router.navigate(['admin/supplier/list'])
            },
            error: (err: any) => {
              this.addForm.enable();
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
      })
    }
  }
  
  files: File[] = [];
  onSelect(event: { addedFiles: File[] }): void {
    this.files.push(...event.addedFiles);
    this.url_image = null
    setTimeout(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    }, 150);
  }

  onRemove(file: File): void {
    const index = this.files.indexOf(file);
    if (this.Id) {
      this.url_image = this.itemData.image;
    }

    if (index >= 0) {
      this.files.splice(index, 1);
    }
  }

  addElement(data: any) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '500px', // กำหนดความกว้างของ Dialog
      maxHeight: '100Vh',
      data: {
        data: data,
        companie_id: this.Id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rerender();
        this._changeDetectorRef.markForCheck();
      }
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
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
        dataTablesParameters.status = null;
        dataTablesParameters.companie_id = +this.Id;
        that._Service.getArea(dataTablesParameters).subscribe((resp: any) => {
          this.dataRow = resp.data;
          this.pages.current_page = resp.current_page;
          this.pages.last_page = resp.last_page;
          this.pages.per_page = resp.per_page;
          if (resp.current_page > 1) {
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
        { data: 'picture' },
        { data: 'name' },
        { data: 'detail' },
        { data: 'create_by' },
        { data: 'created_at' },
      ],
    };
  }

  delete(itemid: any) {
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
        this._Service.deleteArea(itemid).subscribe((resp) => {
          this.rerender();
        });
      }
      error: (err: any) => { };
    });
  }

}

