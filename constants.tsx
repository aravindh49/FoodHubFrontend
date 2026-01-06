
import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Morning Power Bowl',
    price: 0,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Atlantic Salmon Salad',
    price: 480,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Grilled Tofu Buddha Bowl',
    price: 0,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Double Truffle Burger',
    price: 350,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Signature Chicken Wrap',
    price: 0,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'
  }
];

export const FREE_LIMIT = 5;
