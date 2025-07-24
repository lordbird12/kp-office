import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { StockRequestFormComponent } from './form/form.component';
import { StockRequestViewComponent } from './view/view.component';
import { StockRequestStockViewComponent } from './stock-view/stock-view.component';

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
            {
                path: 'edit/:id',
                component: StockRequestFormComponent,
            },
            {
                path: 'view/:id',
                component: StockRequestViewComponent,
            },
            {
                path: 'stock-view',
                component: StockRequestStockViewComponent,
            },
        ],
    },

] as Routes;
