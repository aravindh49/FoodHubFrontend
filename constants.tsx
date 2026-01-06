
import { MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Fresh Salad Bowl',
    price: 0,
    isFree: true,
    category: 'Healthy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    price: 299,
    isFree: false,
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Creamy Pasta',
    price: 0,
    isFree: true,
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1645112481338-316279bc968f?auto=format&fit=crop&q=80&w=800'
  }
];

export const FREE_PER_ITEM_LIMIT = 5;
