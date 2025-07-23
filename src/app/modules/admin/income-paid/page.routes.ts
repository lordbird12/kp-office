import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { PageService } from './page.service';
import { inject } from '@angular/core';

export default [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'quotation',
    // },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'list',
                component: ListComponent,
                resolve  : {
                    user    : () => inject(PageService).getUser(),
                    income    : () => inject(PageService).getIncome(),
                    deduct    : () => inject(PageService).getDeduct(),
                },
            },
        ],
    },
] as Routes;
