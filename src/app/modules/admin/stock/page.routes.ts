import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { StockRequestFormComponent } from './form/form.component';

export default [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'form',
                component: StockRequestFormComponent,
            },
        ],
    },

] as Routes;
