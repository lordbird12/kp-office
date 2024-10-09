import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DropdownTimeComponent } from 'app/shared/dropdown-time/dropdown-time.component';
import { Service } from '../page.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxTopicComponent } from 'app/shared/checkbox-topic/checkbox.component';
import { MatDividerModule } from '@angular/material/divider';
import { BehaviorSubject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-company-filter',
    standalone: true,
    imports: [MatDividerModule, FormsModule, ReactiveFormsModule, CommonModule, MatSelectModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIconModule, DropdownTimeComponent, FormsModule, CheckboxTopicComponent],
    templateUrl: './dailog.component.html',
    styleUrls: ['./dailog.component.scss']
})
export class CompanyDialogComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dataArray: any[] = [];
    items: any[] = []
    statusData = new FormControl('');
    checkAll = false;
    selectedItems: any[] = [];

    private searchTextSubject = new BehaviorSubject<string>('บ');
    searchText$ = this.searchTextSubject.asObservable();
    filteredData: any[] = [];
    categorys: any[] = []

    filteredCompanys: any[] = [
        { name: 'ต้นทุน', isSelected: false },
        { name: 'ราคาขาย', isSelected: false },
        { name: 'ราคารวมของแถม', isSelected: false },
        { name: 'ราคาโปรโมชั่น', isSelected: false },
        { name: 'ยางหน้า', isSelected: false },
        { name: 'ยางหลัง', isSelected: false },

    ];
    form: FormGroup;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: Service,
        private dialogRef: MatDialogRef<CompanyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fb: FormBuilder
    ) {
        this._service.getCategories().subscribe((resp: any)=>{
            this.categorys = resp.data
            this.filteredCompanys = this.categorys;
        })

        this.form = this._fb.group({
            category_product_id: '',
        })
    }

    ngOnInit(): void {
        // this.items = this.data.value
        // this.updateSelectedItems()
        // this.searchText$.pipe(
        //     debounceTime(300),
        //     distinctUntilChanged(),
        //     switchMap((searchText: string) =>  {
        //         // ตรวจสอบว่า searchText ไม่ใช่ค่าว่าง
        //     if (searchText.trim() !== '') {
        //         // กระทำการ subscribe ไปยัง API
        //         return this._service.getKeywordCompany(searchText);
        //     } else {
        //         // ถ้า searchText เป็นค่าว่าง สร้าง Observable ที่ส่งกลับ array ว่าง
        //         return of([]);
        //     }
        // })
        // ).subscribe((resp: any) => {
        //     for (let index = 0; index < resp.data.length; index++) {
        //         const element = {
        //             id: resp.data[index].id,
        //             company: resp.data[index].company,
        //             isSelected: false,
        //         }
        //         this.filteredData.push(element)
        //     }
        // });
    }

    filterCompanies(searchTerm: string) {
        if (searchTerm.trim() !== '') {
          // Filter companies based on search term
          this.filteredCompanys = this.categorys.filter(company =>
            company.company.toLowerCase().includes(searchTerm.toLowerCase())
          );
          this._changeDetectorRef.markForCheck();
        } else {
          // If search input is empty, display all companies
          this.filteredCompanys = this.categorys;
          this._changeDetectorRef.markForCheck();
        }
      }

    updateSearchText(searchText: string): void {
        this.searchTextSubject.next(searchText);
    }

    filterData(event: any) {
        this.items = this.items.filter(item => item.name === event.value)
        this._changeDetectorRef.markForCheck();
    }
    searchText = '';
    searchTerm = '';


    onClose() {
        this.dialogRef.close();

    }

    checkAllItems() {
        for (const item of this.filteredCompanys) {
            item.isSelected = this.checkAll;
        }
        this.updateSelectedItems();
        this._changeDetectorRef.markForCheck();
    }

    updateSelectedItems() {
        this.selectedItems = this.filteredCompanys.filter(item => item.isSelected);
        if (this.selectedItems.length !== this.filteredCompanys.length) {
            this.checkAll = false;
        }
        // console.log(this.selectedItems)
    }
    uncheckAllItems() {
        this.checkAll = false
        for (const item of this.filteredData) {
            item.isSelected = false;
        }
        this.updateSelectedItems();
        this.searchText = ''
    }

    onSaveClick(): void {
        this.dialogRef.close(this.selectedItems)
    }
}
