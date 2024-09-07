import {
     Asana,
     Backward15Seconds,
     Bank,
     BrightnessWindow,
     Cash,
     Codepen,
     CursorPointer,
     Database,
     GraphDown,
     GraphUp,
     LotOfCash,
     Reports,
     WindowCheck
} from 'iconoir-react';

export const categories = [
     {
          id: 1,
          name: 'Hệ thống',
          icon: WindowCheck,
          path: '/systems',
     },
     {
          id: 2,
          name: 'Nhân viên',
          icon: Bank,
          path: '/employees',
     },
     {
          id: 3,
          name: 'Tiền mặt',
          icon: Cash,
          path: '/cash',
     },
     {
          id: 4,
          name: 'Mua hàng',
          icon: GraphUp,
          path: '/purchase',
     },
     {
          id: 5,
          name: 'Bán hàng',
          icon: GraphDown,
          path: '/sales',
     },
     {
          id: 6,
          name: 'Kho',
          icon: Database,
          path: '/warehouse',
     },
     {
          id: 7,
          name: 'Công cụ',
          icon: CursorPointer,
          path: '/tool',
     },
     {
          id: 8,
          name: 'Tài sản cố định',
          icon: BrightnessWindow,
          path: '/fixed-assets',
     },
     {
          id: 9,
          name: 'Lương',
          icon: LotOfCash,
          path: '/salary',
     },
     {
          id: 10,
          name: 'Thuế',
          icon: Backward15Seconds,
          path: '/tax',
     },
     {
          id: 11,
          name: 'Giá thành',
          icon: Asana,
          path: '/price',
     },
     {
          id: 12,
          name: 'Tổng hợp',
          icon: Codepen,
          path: '/synthetic',
     },
     {
          id: 13,
          name: 'Báo cáo',
          icon: Reports,
          path: '/report',
     },
];
