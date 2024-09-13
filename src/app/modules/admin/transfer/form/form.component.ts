

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ListDialogComponent } from '../../product/list-dailog/list.component';
import { MatDialog } from '@angular/material/dialog';
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'form-transfer',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        NgClass, MatInputModule,
        TextFieldModule, ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        CommonModule,
        ReactiveFormsModule
    ],
})
export class FormComponent implements OnInit {
    Id: any;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    company: any;
    area: any;
    /**
     * Constructor
     */
    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _Service: PageService,
        private _fuseConfirmationService: FuseConfirmationService

    ) {
        this.company = this._activatedRoute.snapshot.data.company.data;
        this.area = this._activatedRoute.snapshot.data.area.data;
        this.addForm = this._formBuilder.group({
            date: '',
            companie_id: '',
            area_id: '',
            type: '',
            remark: '',
            items: this._formBuilder.array([])
        })
    }

    ngOnInit(): void {

    }

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    items(): FormArray {
        return this.addForm.get('items') as FormArray
    }


    Product(): FormGroup {
        return this._formBuilder.group({
            product_id: '',
            product_name: '',
            qty: 1,
            selling_price: 0,
            purchase_price: 0,
        });
    }

    AddProduct() {
        this.items().push(this.Product());
    }

    RemoveProduct(index: number) {
        this.items().removeAt(index);
    }
    selectProduct() {
        this._router.navigateByUrl('admin/product-dialog/list')
    }

    showPicture(item: any): void {
        this.dialog
            .open(ListDialogComponent, {
                autoFocus: false,
            
            })
            .afterClosed()
            .subscribe((resp) => {
                console.log(resp);
                item.patchValue({
                    product_id: resp.id,
                    product_name: resp.name + ' ' + 'หมายเลขเครื่อง : ' + resp.engine_no  
                })
                
            });
    }

    New(): void {
        if(this.Id) {
            const confirmation = this._fuseConfirmationService.open({
                title: 'แก้ไขข้อมูล',
                message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ',
                icon: {
                    show: false,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ยืนยัน',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });
    
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                 
                    this._Service.create(this.addForm.value).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/transfer/list'])
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'กรุณาระบุข้อมูล',
                                message:
                                    'ไม่สามารถบันทึกข้อมูลได้กรุณาตรวจสอบใหม่อีกครั้ง',
                                icon: {
                                    show: true,
                                    name: 'heroicons_outline:exclamation',
                                    color: 'warning',
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: 'ยืนยัน',
                                        color: 'primary',
                                    },
                                    cancel: {
                                        show: false,
                                        label: 'ยกเลิก',
                                    },
                                },
                                dismissible: true,
                            });
                        },
                    });
                }
            });
        } else {

        }
   
    }

    backTo() {
        this._router.navigate(['admin/product/list'])
    }

}

