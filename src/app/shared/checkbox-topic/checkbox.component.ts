import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-checkbox-topic',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxTopicComponent implements OnInit {

  timeOptions: string[] = [];
  @Input() topics: any[] = [];
  @Input() dataArray: any[] = [];
  @Output() dataArrayChange = new EventEmitter<any[]>();
  items: any[] = [
    'อุบัติเหตุ',
    'งานปัญหา (ระบุในรายละเอียด)',
    'ติดตามสถานะงานซ่อม',
    'ขอรถทดแทน / ติดตามรถทดแทน',
    'ติดตามป้ายภาษี / พรบ. / กรมธรรม์',
    'ติดตามใบสั่งซ่อม / ติดตามใบเสนอราคา',
    'ศูนย์บริการเสนอราคาเพิ่มเติม',
    'ลืมของไว้ในรถ',
    'ลืมกุญแจรถยนต์ / กุญแจรถยนต์หาย',
    'โอนสาย รถเช่าระยะสั้น / รถเช่าสนามบิน /asap app',
    'ร้องเรียนพนักงาน',
    'ติดตามค่าปรับ',
    'ติดตามรถยนต์เข้าไปใส่อะไหล่',
    'สอบถามราคารถเช่า',
    'โอนสาย (แผนกอื่น)',
    'สายหลุด',
    'อื่นๆ (Other : ระบุเพิ่มเติมในรายละเอียด)',
  ];

  ngOnInit(): void {
    // console.log('items',this.items)
    // console.log('dataArray',this.dataArray)
  }

  isChecked(item: any): boolean {
    // console.log(item)
    return this.dataArray.includes(item);
    // return this.dataArray.some(dataItem => dataItem.id === item);
  }

  // toggleCheckbox(item: string): void {

  //   if (this.isChecked(item)) {

  //     this.dataArray = this.dataArray.filter(value => value !== item);
  //   } else {

  //     this.dataArray.push(item);
  //   }
  // }

  toggleCheckbox(item: any): void {

    // คำนวณเฉพาะรายการที่ไม่ซ้ำใน Set
    const uniqueItemsSet = new Set(this.dataArray.map(dataItem => dataItem));
    // ตรวจสอบว่า item มีอยู่ใน uniqueItemsSet หรือไม่
    const isChecked = uniqueItemsSet.has(item);
    if (isChecked) {
      // ถ้ามี, ให้ลบ item ออกจาก uniqueItemsSet
      uniqueItemsSet.delete(item);
      this.dataArray = this.dataArray.filter(value => value !== item);
    } else {
      // ถ้าไม่มี, ให้เพิ่ม item เข้าไปใน uniqueItemsSet
      uniqueItemsSet.add(item);
      this.dataArray.push(item);
    }
    // แปลง Set กลับเป็น Array และกำหนดให้เป็นค่าใหม่ของ dataArray
    this.dataArray = Array.from(uniqueItemsSet).map(id => this.dataArray.find(item => item === id));
    // ทำการ emit ข้อมูลใหม่ไปยังคอมโพเนนต์
    this.dataArrayChange.emit(this.dataArray);
  }

}
