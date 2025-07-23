import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dropdown-time',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './dropdown-time.component.html',
  styleUrls: ['./dropdown-time.component.scss']
})
export class DropdownTimeComponent implements OnInit{

  timeOptions: string[] = [];

  ngOnInit(): void {
    this.generateTimeOptions();
  }

  generateTimeOptions(): void {
    for (let hour = 6; hour <= 20; hour++) {
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      const time = `${formattedHour}:00`;
      this.timeOptions.push(time);
    }
  }

}
