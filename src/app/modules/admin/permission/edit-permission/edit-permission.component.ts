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
    selector: 'edit-permission',
    templateUrl: './edit-permission.component.html',
    styleUrls: ['./edit-permission.component.scss'],
    animations: fuseAnimations,
    standalone   : true,
    imports      : [MatIconModule,CommonModule, FormsModule, MatFormFieldModule, NgClass, MatInputModule, TextFieldModule, ReactiveFormsModule, MatButtonToggleModule, MatButtonModule, MatSelectModule, MatOptionModule, MatChipsModule, MatDatepickerModule],

})
export class EditPermissionComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public UserAppove: any = [];
    public dtOptions: DataTables.Settings = {};
    public dataRow: any[];
    itemData: any = [];
    MemberType: any = [];
    MenuList: any = [];
    ListMenuData: any = [];
    PermissionData: any = [];
    files: File[] = [];
    files1: File[] = [];
    statusData: any = [
        { value: 1, name: 'เปิดใช้งาน' },
        { value: 0, name: 'ปิดใช้งาน' },
    ];

    Id: any;
    PermissionName: any;
    PropertyType: any = [];

    formData: FormGroup;
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    supplierId: string | null;
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

    /**
     * On init
     */
    // async ngOnInit(): Promise<void> {

    //     this.Id = this._activatedRoute.snapshot.paramMap.get('id');

    //     // resp การดึงข้อมูล
    //     // this._Service.getById(this.Id).subscribe((resp: any) => {

    //     //     //การนำข้อมูลใส่ในช่องแก้ไข
    //     //     this.formData.patchValue({

    //     //         name: resp.data.name,
    //     //         description: resp.data.description
    //     //     });
    //     // });
    // }

    async ngOnInit(): Promise<void> {
        await this.GetPermissionMenuShow();
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');
        //   this.userId = this.Id;
        this.getUserById(this.Id);
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

    update(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'แก้ไขข้อมูล',
            message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
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
                this._Service.update(this.formData.value, this.Id).subscribe({
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

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    GetPermissionDatabyId(id): void {
        this.MenuList = [];
        this._Service.getById(id).subscribe((resp) => {
            this.formData = resp.data;
            if (this.formData.value.menu) {
                this.formData.value.menu.forEach((element) => {
                    if (element.name) {
                        this.MenuList.push(element.name);
                    }
                });
            }
        });
    }

    CheckPermission(event): void {
        if (event.target.checked === true) {
            this.MenuList.push(event.target.value);
            this.formData.value.patchValue({
                menu_name: this.MenuList,
            });
        } else {
            this.MenuList = this.MenuList.filter(
                (item) => item !== event.target.value
            );
        }
    }

    permission(): FormArray {
        return this.formData.get('menu') as FormArray;
    }
    backTo() {
        this._router.navigate(['/admin/permission/list']);
    }
    newPermission(): FormGroup {
        return this._formBuilder.group({
            name: '',
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

    async GetPermissionMenuShow(): Promise<void> {
        const resp = await this._Service.getAllMenu().toPromise();
        this.ListMenuData = resp;
        for (const menu of this.ListMenuData) {
            let item = this._formBuilder.group({
                id: '',
                select_all: false,
                name: menu.name,
                menu_id: menu.id,
                view: false,
                save: false,
                edit: false,
                delete: false,
            });
            this.permission().push(item);
        }

    }
    GetById(id): void {
        this._Service.getById(id).subscribe((resp) => {
            this.PermissionName = resp.data;
            this.formData.patchValue({
                name: this.PermissionName.name,
                permission_view: this.PermissionName.permission_view,

            });
        });
    }

    getUserById(id: any): void {
        this.GetById(id);
        let data = parseInt(id);
        this._Service.getByPermissionId(data).subscribe((resp) => {
            this.PermissionData = resp.data;
            let itemData = this.formData.value.menu;
            for (
                let index = 0;
                index < this.formData.value.menu.length;
                index++
            ) {
                const MenuControl = this.formData.controls['menu']['controls'][
                    index
                ] as FormGroup;
                for (let j = 0; j < this.PermissionData.length; j++) {
                    if (
                        MenuControl.value.menu_id ===
                        this.PermissionData[j].menu_id
                    ) {
                        MenuControl.patchValue({
                            ...this.PermissionData[j],
                        });
                        if (
                            this.PermissionData[j].delete === 1 &&
                            this.PermissionData[j].view === 1 &&
                            this.PermissionData[j].save === 1 &&
                            this.PermissionData[j].edit === 1
                        ) {
                            MenuControl.patchValue({
                                select_all: true,
                            });
                        }
                    }
                }
            }
        });
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
