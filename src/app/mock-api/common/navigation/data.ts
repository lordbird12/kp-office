/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'admin',
        title: 'จัดการระบบ',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'admin.comp',
                title: 'ข้อมูลบริษัท',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/companie/list',
            },
            {
                id: 'admin.department',
                title: 'แผนกงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/department/list',
            },
            {
                id: 'admin.position',
                title: 'ตำแหน่งงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/position/list',
            },
            {
                id: 'admin.employee',
                title: 'ข้อมูลพนักงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/employee/list',
            },
            {
                id: 'admin.permission',
                title: 'สิทธิ์การใช้งาน',
                type: 'basic',
                icon: 'heroicons_outline:key',
                link: '/admin/permission/list',
            },
            // {
            //     id: 'admin.time',
            //     title: 'ลงเวลา',
            //     type: 'basic',
            //     icon: 'heroicons_outline:clock',
            //     link: '/admin/time-attendance/list',
            // },
            
        ],
    },
    // {
    //     id: 'finance',
    //     title: 'จัดการเงินเดือน',
    //     subtitle: 'ขัอมูลเกี่ยวกับเงินเดือน',
    //     type: 'group',
    //     icon: 'heroicons_outline:home',
    //     children: [
           
    //         {
    //             id: 'finance.payroll',
    //             title: 'เงินเดือน',
    //             type: 'basic',
    //             icon: '10k',
    //             link: '/admin/payroll/list',
    //         },
    //         {
    //             id: 'finance.time',
    //             title: 'ข้อมูลลงเวลา',
    //             type: 'basic',
    //             icon: 'heroicons_outline:clock',
    //             link: '/admin/time/list',
    //         },
    //         {
    //             id: 'finance.income',
    //             title: 'ประเภทเงินได้',
    //             type: 'basic',
    //             icon: 'heroicons_outline:currency-dollar',
    //             link: '/admin/income/list',
    //         },
    //         {
    //             id: 'finance.deduct',
    //             title: 'ประเภทเงินหัก',
    //             type: 'basic',
    //             icon: 'heroicons_outline:squares-plus',
    //             link: '/admin/deduct/list',
    //         },
    //         {
    //             id: 'finance.income-paid',
    //             title: 'เงินได้ - เงินหัก',
    //             type: 'basic',
    //             icon: 'heroicons_outline:list-bullet',
    //             link: '/admin/income-deduct/list',
    //         },
    //         {
    //             id: 'finance.income-paid',
    //             title: 'ตั้งค่ามาสาย',
    //             type: 'basic',
    //             icon: 'heroicons_outline:list-bullet',
    //             link: '/admin/late/list',
    //         },
    //     ],
    // },
    {
        id: 'products',
        title: 'จัดการคลังและสินค้า',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            //     {
            //         id: 'products.warehouse',
            //         title: 'คลังสินค้า',
            //         type: 'basic',
            //         icon: 'heroicons_outline:home-modern',
            //         link: '/admin/warehouse/list',
            //     },
            {
                id: 'products.brand',
                title: 'ยี่ห้อรถ',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/brand/list',
            },
            {
                id: 'products.product',
                title: 'คลังสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/product/list',
            },
            {
                id: 'products.product-attribute',
                title: 'คลังอุปกรณ์เสริม',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/product-attribute/list',
            },
            // {
            //     id: 'products.transfer',
            //     title: 'โอนย้ายสินค้า',
            //     type: 'basic',
            //     icon: 'heroicons_outline:arrow-path-rounded-square',
            //     link: '/admin/transfer/list',
            // },
        ],
    },
    {
        id: 'sales',
        title: 'จัดการคำสั่งซื้อ',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'sales.list',
                title: 'คำสั่งซื้อ',
                type: 'basic',
                icon: 'checklist',
                link: '/admin/sales/list',
            },
            {
                id: 'client.list',
                title: 'ลูกค้าของเรา',
                type: 'basic',
                icon: 'heroicons_mini:user-group',
                link: '/admin/customer/list',
            },
            {
                id: 'claim.list',
                title: 'ประวัติการเคลม',
                type: 'basic',
                icon: 'history',
                link: '/admin/cleam/list',
            },
            // {
            //     id: 'payment.list',
            //     title: 'การผ่อนชำระ',
            //     type: 'basic',
            //     icon: 'align_horizontal_left',
            //     link: '/admin/payment/list',
            // },
        ],
    },
    {
        id: 'จัดการผู้เกี่ยวข้อง',
        title: 'จัดการข้อมูลผู้เกี่ยวข้อง',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'supplier.list',
                title: 'ผู้จำหน่าย',
                type: 'basic',
                icon: 'mat_outline:supervised_user_circle',
                link: '/admin/supplier/list',
            },
            {
                id: 'finance.list',
                title: 'ไฟแนนซ์',
                type: 'basic',
                icon: 'heroicons_mini:building-office',
                link: '/admin/finance/list',
            },
        ],
    },
    {
        id: 'apps',
        title: 'จัดการโปรแกรมระบบ',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'apps.report',
                title: 'รายงาน',
                type: 'collapsable',
                icon: 'heroicons_outline:document-text',
                children: [
                    {
                        id: 'apps.report.stock-vat',
                        title: 'สต๊อครวมภาษี',
                        type: 'basic',
                        link: '/admin/report-stock-vat/list',
                        exactMatch: true,
                    },
                    {
                        id: 'apps.report.stock-card',
                        title: 'สินค้าคงเหลือ',
                        type: 'basic',
                        link: '/admin/report-stock-card/list',
                        exactMatch: true,
                    },
                ],
            },
            // {
            //     id: 'apps.file-manager',
            //     title: 'ไฟล์เอกสาร',
            //     type: 'basic',
            //     icon: 'heroicons_outline:cloud',
            //     link: '/apps/file-manager',
            // },
            // {
            //     id: 'apps.help-center',
            //     title: 'ศูนย์ช่วยเหลือ',
            //     type: 'collapsable',
            //     icon: 'heroicons_outline:information-circle',
            //     link: '/apps/help-center',
            //     children: [
            //         {
            //             id: 'apps.help-center.home',
            //             title: 'Home',
            //             type: 'basic',
            //             link: '/apps/help-center',
            //             exactMatch: true,
            //         },
            //         {
            //             id: 'apps.help-center.faqs',
            //             title: 'FAQs',
            //             type: 'basic',
            //             link: '/apps/help-center/faqs',
            //         },
            //         {
            //             id: 'apps.help-center.guides',
            //             title: 'Guides',
            //             type: 'basic',
            //             link: '/apps/help-center/guides',
            //         },
            //         {
            //             id: 'apps.help-center.support',
            //             title: 'Support',
            //             type: 'basic',
            //             link: '/apps/help-center/support',
            //         },
            //     ],
            // },
            // {
            //     id: 'apps.mailbox',
            //     title: 'กล่องจดหมาย',
            //     type: 'basic',
            //     icon: 'heroicons_outline:envelope',
            //     link: '/apps/mailbox',
            //     badge: {
            //         title: '27',
            //         classes: 'px-2 bg-pink-600 text-white rounded-full',
            //     },
            // },
        ],
    },
    {
        id: 'self',
        title: 'ส่วนตัว',
        subtitle: 'จัดการโปรไฟล์',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'self.employee',
                title: 'แก้ไขข้อมูลส่วนตัว',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/admin/employee/list',
            },
            {
                id: 'admin.logout',
                title: 'ออกจากระบบ',
                type: 'basic',
                icon: 'heroicons_outline:arrow-left-on-rectangle',
                link: '/sign-out',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qr-code',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'แดชบอร์ด',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'apps',
    //     title: 'Apps',
    //     type: 'group',
    //     icon: 'heroicons_outline:qr-code',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'pages',
    //     title: 'Pages',
    //     type: 'group',
    //     icon: 'heroicons_outline:document-duplicate',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'user-interface',
    //     title: 'UI',
    //     type: 'group',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'navigation-features',
    //     title: 'Misc',
    //     type: 'group',
    //     icon: 'heroicons_outline:bars-3',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    {
        id: 'purchase',
        title: 'ซื้อ',
        type: 'group',
        icon: 'heroicons_outline:inbox-arrow-down',
        children: [],
    },
    {
        id: 'sale',
        title: 'ขาย',
        type: 'group',
        icon: 'heroicons_outline:shopping-cart',
        children: [],
    },
    {
        id: 'inventory',
        title: 'คลังสินค้า',
        type: 'group',
        icon: 'heroicons_outline:cube',
        children: [],
    },
    {
        id: 'accounting',
        title: 'บัญชี/การเงิน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'delivery-workers',
        title: 'คนส่งของ',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'admin',
        title: 'จัดการพนักงาน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'reports',
        title: 'รายงาน',
        type: 'group',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [],
    },
];
