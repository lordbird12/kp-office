import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { PermissionService } from '../../permission_/service/permission.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'create-permission',
    templateUrl: './create-permission.component.html',
    styleUrls: ['./create-permission.component.scss'],
    animations: fuseAnimations,
    standalone   : true,
    imports      : [MatIconModule,CommonModule, FormsModule, MatFormFieldModule, NgClass, MatInputModule, TextFieldModule, ReactiveFormsModule, MatButtonToggleModule, MatButtonModule, MatSelectModule, MatOptionModule, MatChipsModule, MatDatepickerModule],

})
export class CreatePermissionComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    showBranch: boolean = false; // variable to control branch visibility

    formData: FormGroup;
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    supplierId: string | null;
    public UserAppove: any = [];
    files: File[] = [];
    files1: File[] = [];
    MemberType: any = [];
    MenuList: any = [];
    Customer_type: string[] = ['Individual', 'Corporate'];
    public MenuName: any = [];
    permissionrole: any[] = [{name: 'ทั้งหมด',value: 'all'},{name: 'ระดับสาขา',value: 'branch'},{name: 'ระดับผู้ใช้งาน',value: 'user'}]
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: PermissionService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {
        this.formData = this._formBuilder.group({
            name: '',
            permission_view: '',
            menu: this._formBuilder.array([]),
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    //Hide Customer type

    /**
     * On init
     */
    ngOnInit(): void {
        this._Service.getAllMenu().subscribe((resp: any) => {
            this.MenuList = resp;
            for (const menu of this.MenuList) {
                let item = this._formBuilder.group({
                    name: menu.name,
                    permission_view: menu.permission_view,
                    menu_id: menu.id,
                    select_all: false,
                    view: false,
                    save: false,
                    edit: false,
                    delete: false,
                });
                this.permission().push(item);
            }
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    permission(): FormArray {
        return this.formData.get('menu') as FormArray;
    }

    newPermission(): FormGroup {
        return this._formBuilder.group({
            name: '',
            permission_view: '',
            menu_id: '',
            view: '',
            save: '',
            edit: '',
            delete: '',
        });
    }

    addPermission(): void {
        this.permission().push(this.newPermission());
    }

    removePermission(i: number): void {
        this.permission().removeAt(i);
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    create(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'เพิ่มข้อมูล',
            message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ตกลง',
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
                const formValue = this.formData.value;
                formValue.Menu = formValue.menu.forEach((element) => {
                    element.view = element.view ? 1 : 0;
                    element.save = element.save ? 1 : 0;
                    element.edit = element.edit ? 1 : 0;
                    element.delete = element.delete ? 1 : 0;
                    delete element.name;
                });
                this._Service.new(formValue).subscribe({
                    next: (resp: any) => {
                        this._router
                            .navigateByUrl('permission/list')
                            .then(() => {});
                    },
                    error: (err: any) => {
                        this.formData.enable();
                        this._fuseConfirmationService.open({
                            title: 'เกิดข้อผิดพลาด',
                            message: err.error.message,
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation-triangle',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ตกลง',
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
    }
    showFlashMessage(arg0: string) {
        throw new Error('Method not implemented.');
    }
    backTo() {
        this._router.navigate(['/admin/permission/list']);
    }
    toggleAllSelection(data, i) {
        let item = this.formData.value.menu;
        if (data.checked === true) {
            item[i] = {
                view: true,
                save: true,
                edit: true,
                delete: true,
            };
            this.formData.controls.menu.patchValue(item);
        } else {
            item[i] = {
                view: false,
                save: false,
                edit: false,
                delete: false,
            };
            this.formData.controls.menu.patchValue(item);
        }
    }
}
