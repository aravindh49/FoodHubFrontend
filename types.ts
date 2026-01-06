
export enum AppStep {
  LANDING = 'LANDING',
  WELCOME = 'WELCOME',
  VERIFY_OTP = 'VERIFY_OTP',
  MENU = 'MENU',
  CART = 'CART',
  ORDER_SUMMARY = 'ORDER_SUMMARY',
  PAYMENT = 'PAYMENT',
  ORDER_STATUS = 'ORDER_STATUS',
  COLLECTION_QR = 'COLLECTION_QR',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  USER_PROFILE = 'USER_PROFILE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'COMPLETED' | 'CANCELLED';
}
