import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DashboardComponent {
    today: Date = new Date();

    // Summary Values
    repairPending: number = 7;
    totalRepairs: number = 25;

    carsForSale: number = 12;
    newCarsThisWeek: number = 3;

    carsWaitingRepair: number = 5;
    avgRepairTime: number = 4.5; // วัน

    soldThisMonth: number = 9;
    salesGrowth: number = 12; // %

    incomeThisMonth: number = 250000;
    incomeTargetPercentage: number = 80;

    expenseThisMonth: number = 120000;
    expenseBudgetPercentage: number = 65;

    debtorsTotal: number = 450000;
    overdueDebtors: number = 4;

    creditorsTotal: number = 300000;
    dueCreditors: number = 2;

    // Job Breakdown
    jobStats = {
        engine: 10,
        enginePending: 3,

        cleaning: 8,
        cleaningPending: 2,

        interior: 6,
        interiorPending: 1,

        painting: 7,
        paintingPending: 2,

        audio: 5,
        audioPending: 1,
    };
    /**
     * Constructor
     */
    constructor() {
    }
}
