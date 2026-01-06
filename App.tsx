
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppStep, CartItem, MenuItem, OrderRecord } from './types';
import { INITIAL_MENU, FREE_PER_ITEM_LIMIT } from './constants';
import { Button } from './components/Button';
import { 
  Utensils, ChevronLeft, ShoppingCart, Plus, Minus, QrCode, 
  CheckCircle, Clock, ArrowRight, ShieldCheck, Zap, 
  Ticket, User, Settings, History, TrendingUp, 
  LayoutDashboard, LogOut, X, ChefHat, 
  CreditCard, Info, Star, Search, AlertCircle, Lock,
  Trash2, Edit3, PlusCircle, MoreVertical, ChevronRight
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LANDING);
  const [email, setEmail] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  
  // State for drill-down in User Panel
  const [viewingOrderDetails, setViewingOrderDetails] = useState<OrderRecord | null>(null);
  
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Admin State
  const [adminTab, setAdminTab] = useState<'dashboard' | 'menu' | 'orders'>('dashboard');

  // Business Logic: 5 of EACH item per user per day
  const cartCalculation = useMemo(() => {
    const freeItems = cart.filter(item => item.isFree);
    const paidItems = cart.filter(item => !item.isFree);
    
    const subtotal = paidItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    
    // Total quantity in cart
    const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);

    return { freeItems, paidItems, subtotal, tax, total, totalUnits };
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      
      // Enforce the limit of 5 for EACH item (Free or Paid)
      if (existing && existing.quantity >= FREE_PER_ITEM_LIMIT) {
        return prev; 
      }
      
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing?.quantity === 1) return prev.filter(i => i.id !== itemId);
      return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const verifyOtpAndLogin = () => {
    if (otp.join('') === '1234') {
      setCurrentStep(AppStep.MENU);
    } else {
      alert("Invalid Demo OTP. Use 1234");
    }
  };

  const processOrder = () => {
    const newOrder: OrderRecord = {
      id: `#ORD${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal: cartCalculation.subtotal,
      tax: cartCalculation.tax,
      total: cartCalculation.total,
      status: 'Pending',
      userId: email
    };
    setCurrentOrder(newOrder);
    setOrderHistory(prev => [newOrder, ...prev]);
    setCurrentStep(AppStep.ORDER_STATUS);
    setCart([]);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Helper to check if item limit is reached for UI disabling
  const isLimitReached = (itemId: string) => {
    const item = cart.find(i => i.id === itemId);
    return (item?.quantity || 0) >= FREE_PER_ITEM_LIMIT;
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 w-full bg-white animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
      <div className="bg-blue-600 p-7 rounded-[32px] text-white shadow-2xl shadow-blue-200 mb-8 transform transition-transform hover:scale-105">
        <Utensils size={56} strokeWidth={2.5} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter text-center">FoodHub</h1>
      <p className="text-slate-500 font-medium mb-12 text-center max-w-[240px]">Fresh corporate meals delivered to your desk</p>
      
      <div className="flex gap-2 mb-20">
        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
        <div className="w-2.5 h-2.5 bg-blue-100 rounded-full" />
        <div className="w-2.5 h-2.5 bg-blue-100 rounded-full" />
      </div>

      <Button fullWidth className="!bg-blue-600 !rounded-2xl !py-5 text-lg shadow-xl shadow-blue-100" onClick={() => setCurrentStep(AppStep.WELCOME)}>
        Start Ordering <ArrowRight size={20} className="ml-2" />
      </Button>

      <button onClick={() => setCurrentStep(AppStep.ADMIN_DASHBOARD)} className="mt-8 text-slate-300 text-[10px] font-bold uppercase tracking-[0.4em] hover:text-blue-600 transition-colors">
        Administrator Access
      </button>
    </div>
  );

  const renderWelcome = () => (
    <div className="flex-1 w-full flex flex-col p-8 bg-white">
      <div className="mt-12">
        <button onClick={() => setCurrentStep(AppStep.LANDING)} className="p-2 -ml-2 text-slate-900 hover:bg-slate-50 rounded-full"><ChevronLeft size={28} /></button>
      </div>
      <div className="mt-12 flex flex-col items-center mb-16 text-center">
        <div className="bg-blue-50 p-6 rounded-3xl text-blue-600 mb-6"><ShieldCheck size={40} /></div>
        <h2 className="text-3xl font-black text-slate-900">Sign In</h2>
        <p className="text-slate-500 text-sm mt-2">Enter your work email to continue</p>
      </div>
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
          <div className="relative">
             <input 
              type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold text-slate-800 pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"><User size={20}/></div>
          </div>
        </div>
        <Button fullWidth className="!bg-blue-600 !rounded-2xl !py-5 shadow-lg shadow-blue-50" onClick={() => setCurrentStep(AppStep.VERIFY_OTP)}>Send Verification Code</Button>
      </div>
    </div>
  );

  const renderVerifyOtp = () => (
    <div className="flex-1 w-full flex flex-col p-8 bg-white animate-in slide-in-from-right-4 duration-300">
      <div className="mt-12">
        <button onClick={() => setCurrentStep(AppStep.WELCOME)} className="p-2 -ml-2 text-slate-900 hover:bg-slate-50 rounded-full"><ChevronLeft size={28} /></button>
      </div>
      <div className="mt-12 flex flex-col items-center mb-16 text-center">
        <div className="bg-blue-50 p-6 rounded-full text-blue-600 mb-6 ring-8 ring-blue-50/50"><Lock size={32} /></div>
        <h2 className="text-3xl font-black text-slate-900">Verification</h2>
        <p className="text-slate-500 text-sm mt-3 text-center px-4 leading-relaxed">We sent a 4-digit code (use <b>1234</b>) to your email <b>{email || 'user@company.com'}</b></p>
      </div>
      
      <div className="flex justify-between gap-4 mb-12">
        {otp.map((d, i) => (
          <input 
            key={i} 
            ref={otpRefs[i]}
            type="text" 
            inputMode="numeric"
            maxLength={1} 
            value={d}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
            className="w-16 h-20 text-center text-3xl font-black bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-600 focus:bg-white focus:shadow-xl focus:shadow-blue-50 outline-none transition-all text-slate-900" 
          />
        ))}
      </div>
      
      <div className="space-y-6">
        <Button fullWidth className="!bg-blue-600 !rounded-2xl !py-5 shadow-xl shadow-blue-100" onClick={verifyOtpAndLogin}>Confirm Code</Button>
        <button className="text-blue-600 text-sm font-black w-full text-center hover:underline decoration-2 underline-offset-4">Resend New Code</button>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="flex-1 w-full flex flex-col bg-slate-50 overflow-y-auto">
      <header className="bg-white p-6 flex justify-between items-center border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-xl font-black tracking-tight text-slate-900">FoodHub</h1>
        <div className="flex gap-3">
          <button onClick={() => setCurrentStep(AppStep.ORDER_COMPLETED)} className="p-2.5 text-slate-400 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"><User size={22}/></button>
          <button onClick={() => setCurrentStep(AppStep.CART)} className="relative p-2.5 bg-slate-50 rounded-xl text-slate-900 hover:bg-slate-100 transition-colors">
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
          </button>
        </div>
      </header>
      <div className="p-6">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Today's Selection</h2>
             <p className="text-slate-400 text-sm font-medium">Curated corporate menu</p>
           </div>
           <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"><Zap size={14}/> Max 5/Item</div>
        </div>
        <div className="grid gap-6">
          {menuItems.map(item => {
            const reached = isLimitReached(item.id);
            return (
              <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                  {item.isFree && <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-emerald-600 uppercase">Corporate Free</div>}
                  {reached && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center text-slate-900 font-black text-xs uppercase tracking-widest text-center px-4">Limit Reached</div>}
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h4>
                    <p className={`text-sm font-black mt-1 ${item.isFree ? 'text-emerald-500' : 'text-blue-600'}`}>
                      {item.isFree ? '₹0.00' : `₹${item.price}`}
                    </p>
                  </div>
                  <button 
                    disabled={reached}
                    onClick={() => addToCart(item)} 
                    className={`p-3 rounded-2xl shadow-lg transition-all active:scale-90 ${reached ? 'bg-slate-100 text-slate-300' : 'bg-blue-600 text-white shadow-blue-100'}`}
                  >
                    <Plus size={24}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="flex-1 w-full flex flex-col bg-white">
      <header className="p-6 flex items-center gap-4 border-b border-slate-100">
        <button onClick={() => setCurrentStep(AppStep.MENU)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-black tracking-tight">Your Tray</h2>
      </header>
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
             <div className="p-8 bg-slate-50 rounded-[40px] mb-6"><ShoppingCart size={64} strokeWidth={1.5} className="opacity-20"/></div>
             <p className="font-black uppercase tracking-[0.2em] text-xs text-slate-400">Nothing added yet</p>
             <button onClick={() => setCurrentStep(AppStep.MENU)} className="mt-4 text-blue-600 font-bold text-sm">Explore Menu</button>
          </div>
        ) : cart.map(item => {
          const reached = isLimitReached(item.id);
          return (
            <div key={item.id} className="flex gap-5 items-center animate-in fade-in slide-in-from-left-2">
              <img src={item.image} className="w-24 h-24 rounded-[24px] object-cover shadow-sm" alt={item.name} />
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                <p className={`text-xs font-black ${item.isFree ? 'text-emerald-500' : 'text-blue-600'} mt-1.5`}>{item.isFree ? 'CORPORATE FREE' : `₹${item.price}`}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500"><Minus size={16}/></button>
                    <span className="font-black text-sm text-slate-800">{item.quantity}</span>
                    <button 
                      disabled={reached}
                      onClick={() => addToCart(item)} 
                      className={`transition-colors ${reached ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600'}`}
                    >
                      <Plus size={16}/>
                    </button>
                  </div>
                  {reached && <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">MAX</span>}
                </div>
              </div>
            </div>
          );
        })}

        {cart.length > 0 && (
          <div className="pt-6 border-t border-slate-50">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              <span>Limit Enforcement</span>
              <span className="text-blue-600">Usage Tracker</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-4 leading-tight italic font-medium">Note: You can order up to 5 units per item today.</p>
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="p-6 border-t border-slate-100 bg-white space-y-5">
          <div className="flex justify-between text-slate-400 font-bold text-sm"><span>Estimated Subtotal</span><span>₹{cartCalculation.subtotal}</span></div>
          <div className="flex justify-between text-slate-900 font-black text-2xl tracking-tighter"><span>Total</span><span>₹{cartCalculation.subtotal}</span></div>
          <Button fullWidth className="!bg-blue-600 !rounded-[20px] !py-5 shadow-xl shadow-blue-50" onClick={() => setCurrentStep(AppStep.ORDER_SUMMARY)}>Review Order</Button>
        </div>
      )}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="flex-1 w-full flex flex-col bg-white">
      <header className="p-6 flex items-center gap-4 border-b border-slate-100">
        <button onClick={() => setCurrentStep(AppStep.CART)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-black tracking-tight">Review Order</h2>
      </header>
      <div className="flex-1 p-6 space-y-10 overflow-y-auto">
        {cartCalculation.freeItems.length > 0 && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Subsidized Items</h3>
            <div className="space-y-5">
              {cartCalculation.freeItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                    <div><p className="font-bold text-slate-800 text-sm leading-tight">{item.name}</p><p className="text-[10px] font-black text-slate-300 mt-1">QTY: {item.quantity}</p></div>
                  </div>
                  <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">FREE</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {cartCalculation.paidItems.length > 0 && (
          <div className="animate-in fade-in duration-500 delay-100">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Paid Selection</h3>
            <div className="space-y-5">
              {cartCalculation.paidItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                    <div><p className="font-bold text-slate-800 text-sm leading-tight">{item.name}</p><p className="text-[10px] font-black text-slate-300 mt-1">QTY: {item.quantity}</p></div>
                  </div>
                  <span className="text-slate-900 font-black text-sm">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-4">
        <div className="flex justify-between text-slate-400 font-bold text-sm"><span>Subtotal</span><span>₹{cartCalculation.subtotal}</span></div>
        <div className="flex justify-between text-slate-400 font-bold text-sm"><span>GST (5%)</span><span>₹{cartCalculation.tax}</span></div>
        <div className="flex justify-between text-slate-900 font-black text-3xl pt-2 tracking-tighter"><span>Amount Due</span><span>₹{cartCalculation.total}</span></div>
        <Button fullWidth className="!bg-blue-600 !rounded-2xl !py-5 shadow-2xl shadow-blue-50 mt-6" onClick={() => setCurrentStep(AppStep.PAYMENT)}>Confirm & Pay</Button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="flex-1 w-full flex flex-col bg-white">
      <header className="p-6 flex items-center gap-4 border-b border-slate-100">
        <button onClick={() => setCurrentStep(AppStep.ORDER_SUMMARY)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-black tracking-tight">Checkout</h2>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Secure Payment via UPI</p>
        <h3 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter text-center">₹{cartCalculation.total}</h3>
        <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-blue-100 border-2 border-slate-50 mb-10 transform transition-transform hover:scale-102">
           <QrCode size={180} className="text-slate-900" />
        </div>
        <p className="font-black text-slate-800 mb-3 text-lg">Scan & Pay</p>
        <p className="text-slate-400 text-sm max-w-[240px] leading-relaxed text-center">Use any UPI app like GPay, PhonePe, or Paytm to complete the transaction.</p>
      </div>
      <div className="p-8"><Button fullWidth className="!bg-emerald-500 !rounded-2xl !py-5 shadow-2xl shadow-emerald-50 active:scale-95" onClick={processOrder}>Payment Completed</Button></div>
    </div>
  );

  const renderOrderStatus = () => (
    <div className="flex-1 w-full flex flex-col bg-white overflow-y-auto">
      <header className="p-6 flex items-center gap-4 border-b border-slate-100"><button onClick={() => setCurrentStep(AppStep.MENU)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft size={24} /></button><h2 className="text-xl font-black tracking-tight">Live Status</h2></header>
      <div className="flex-1 p-8">
        <div className="flex justify-between items-start mb-12 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
          <div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Ticket ID</p><div className="flex items-center gap-2"><h3 className="text-xl font-black text-slate-900">{currentOrder?.id}</h3></div></div>
          <div className="text-right"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Status</p><span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{currentOrder?.status || 'Active'}</span></div>
        </div>
        
        <div className="space-y-16 relative py-4">
          <div className="absolute left-4 top-4 bottom-4 w-1 bg-slate-50 rounded-full" />
          <div className="flex gap-8 relative z-10"><div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white ring-8 ring-white shadow-lg"><CheckCircle size={16} /></div><div className="pt-0.5"><h4 className="font-black text-slate-900 text-base">Order Placed</h4><p className="text-slate-400 text-sm font-medium">Successfully received in kitchen</p><p className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest">JUST NOW</p></div></div>
          <div className="flex gap-8 relative z-10"><div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white ring-8 ring-white shadow-lg animate-pulse"><Clock size={16} /></div><div className="pt-0.5"><h4 className="font-black text-slate-900 text-base">Preparing Meal</h4><p className="text-slate-400 text-sm font-medium">Chef is working on your selection</p></div></div>
          <div className="flex gap-8 relative z-10 opacity-20"><div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 ring-8 ring-white shadow-lg"><Utensils size={16} /></div><div className="pt-0.5"><h4 className="font-black text-slate-900 text-base">Ready for Collection</h4><p className="text-slate-400 text-sm font-medium">Head to the counter for pickup</p></div></div>
        </div>
        
        <div className="mt-24"><Button fullWidth onClick={() => setCurrentStep(AppStep.COLLECTION_QR)} className="!bg-blue-600 !rounded-[24px] !py-5 shadow-2xl shadow-blue-50">View Pickup QR Code</Button></div>
      </div>
    </div>
  );

  const renderCollectionQr = () => (
    <div className="flex-1 w-full bg-emerald-500 flex flex-col items-center justify-center p-8 text-white animate-in fade-in duration-500">
      <div className="bg-white p-14 rounded-[56px] shadow-2xl shadow-emerald-900/20 mb-10 flex items-center justify-center transform transition-all hover:scale-105"><QrCode size={180} className="text-slate-900" /></div>
      <h2 className="text-3xl font-black mb-3 tracking-tight">Collection QR</h2>
      <p className="text-emerald-50 text-center text-sm max-w-[240px] mb-12 opacity-80 leading-relaxed text-center">Present this code at the cafeteria counter to collect your tray.</p>
      <div className="bg-white/10 px-8 py-4 rounded-[24px] border border-white/20 backdrop-blur-sm"><p className="font-black text-lg tracking-[0.2em]">{currentOrder?.id.split('#')[1]}</p></div>
      <div className="mt-28 w-full"><Button fullWidth className="!bg-white !text-emerald-600 !rounded-2xl !py-5 font-black shadow-xl" onClick={() => setCurrentStep(AppStep.MENU)}>Back to Menu</Button></div>
    </div>
  );

  const renderUserPanel = () => (
    <div className="flex-1 w-full flex flex-col bg-slate-50 overflow-y-auto">
      {viewingOrderDetails ? (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <header className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-20">
            <button onClick={() => setViewingOrderDetails(null)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft size={24}/></button>
            <h2 className="text-xl font-black tracking-tight">Order Details</h2>
          </header>
          
          <div className="p-6 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center">
               <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                 <CheckCircle size={32}/>
               </div>
               <h3 className="text-2xl font-black text-slate-900">{viewingOrderDetails.id}</h3>
               <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1 text-center">{viewingOrderDetails.date}</p>
               <div className="mt-4 inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                 {viewingOrderDetails.status}
               </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1 text-left">Items in this order</h3>
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                {viewingOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center p-5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <img src={it.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                      <div className="text-left">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{it.name}</p>
                        <p className="text-[10px] font-black text-slate-300 mt-1">QTY: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="text-slate-900 font-black text-sm">{it.isFree ? 'FREE' : `₹${it.price * it.quantity}`}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl">
               <div className="flex justify-between items-center mb-3 opacity-60 text-xs font-bold">
                 <span>Subtotal</span>
                 <span>₹{viewingOrderDetails.subtotal}</span>
               </div>
               <div className="flex justify-between items-center mb-6 opacity-60 text-xs font-bold">
                 <span>Tax Applied</span>
                 <span>₹{viewingOrderDetails.tax}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-lg font-black tracking-tight">Net Total</span>
                 <span className="text-3xl font-black tracking-tighter text-blue-400">₹{viewingOrderDetails.total}</span>
               </div>
            </div>

            <Button fullWidth variant="outline" className="!rounded-2xl border-slate-200" onClick={() => setViewingOrderDetails(null)}>Back to History</Button>
          </div>
        </div>
      ) : (
        <>
          <header className="p-10 bg-white border-b border-slate-100 flex flex-col items-center text-center sticky top-0 z-20">
            <div className="w-28 h-28 bg-blue-600 rounded-[40px] flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-blue-100 ring-4 ring-slate-50">
              {email ? email.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{email || 'member@corporate.com'}</h2>
            <div className="mt-2 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">Premium Member</div>
            <button onClick={() => setCurrentStep(AppStep.MENU)} className="mt-6 text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-all">
              <Plus size={14}/> New Order
            </button>
          </header>
          
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transform transition-transform active:scale-95">
                 <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-500 mb-4"><Zap size={20}/></div>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 text-left">Savings</p>
                 <p className="text-2xl font-black text-slate-900 text-left">₹{orderHistory.reduce((a, b) => a + (b.subtotal - b.total > 0 ? b.subtotal - b.total : 0), 0)}</p>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transform transition-transform active:scale-95">
                 <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 mb-4"><History size={20}/></div>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 text-left">Orders</p>
                 <p className="text-2xl font-black text-slate-900 text-left">{orderHistory.length}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 px-1 flex justify-between items-center text-left">Order History</h3>
              <div className="space-y-4">
                 {orderHistory.length === 0 ? (
                   <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-4">
                     <div className="p-6 bg-slate-50 rounded-full"><ShoppingCart size={40} className="opacity-20"/></div>
                     No orders yet
                   </div>
                 ) : orderHistory.map(o => (
                   <button 
                     key={o.id} 
                     onClick={() => setViewingOrderDetails(o)}
                     className="w-full bg-white p-5 rounded-[24px] flex justify-between items-center border border-slate-100 hover:shadow-md transition-all active:scale-[0.98] group"
                   >
                      <div className="flex gap-4 items-center">
                         <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"><History size={20}/></div>
                         <div className="text-left">
                           <p className="font-black text-slate-900 text-sm tracking-tight">{o.id}</p>
                           <p className="text-[10px] font-bold text-slate-300 uppercase">{o.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-black text-slate-900">₹{o.total}</p>
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{o.status}</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"/>
                      </div>
                   </button>
                 ))}
              </div>
            </div>

            <div className="pt-8">
              <Button fullWidth variant="outline" className="!rounded-2xl border-slate-200 !text-slate-400 !font-bold py-5" onClick={() => setCurrentStep(AppStep.LANDING)}>Log out Account</Button>
              <p className="text-center text-slate-300 text-[10px] font-black uppercase mt-6 tracking-[0.3em] text-center">FoodHub Corporate v2.1.2</p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="flex-1 w-full flex bg-[#F8FAFC] overflow-hidden min-h-screen">
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-10 space-y-12 sticky top-0 h-screen">
        <div className="flex items-center gap-4"><div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-100"><Utensils size={24} /></div><span className="font-black text-2xl tracking-tighter text-slate-900">Admin</span></div>
        <nav className="flex-1 space-y-3">
          <button onClick={() => setAdminTab('dashboard')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] font-black text-sm transition-all ${adminTab === 'dashboard' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => setAdminTab('menu')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] font-black text-sm transition-all ${adminTab === 'menu' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}><ChefHat size={20} /> Menu</button>
          <button onClick={() => setAdminTab('orders')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] font-black text-sm transition-all ${adminTab === 'orders' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}><ShoppingCart size={20} /> Orders</button>
        </nav>
        <button onClick={() => setCurrentStep(AppStep.LANDING)} className="flex items-center gap-4 px-5 py-4 text-red-500 font-black text-sm hover:bg-red-50 rounded-[20px] transition-colors"><LogOut size={20} /> Exit Admin</button>
      </aside>
      <main className="flex-1 p-16 overflow-y-auto">
        {adminTab === 'dashboard' && (
          <div className="space-y-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter text-left">Business Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { label: 'Today Orders', value: orderHistory.length, icon: ShoppingCart, color: 'blue' },
                { label: 'Net Revenue', value: `₹${orderHistory.reduce((a, b) => a + b.total, 0)}`, icon: TrendingUp, color: 'emerald' },
                { label: 'Subsidies', value: orderHistory.reduce((a, b) => a + (b.subtotal - b.total > 0 ? 1 : 0), 0), icon: Zap, color: 'orange' },
                { label: 'Active Users', value: 42, icon: User, color: 'indigo' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm group hover:shadow-xl transition-shadow duration-500"><div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform`}><stat.icon size={28} /></div><p className="text-slate-300 text-xs font-black uppercase tracking-widest mb-2 text-left">{stat.label}</p><p className="text-4xl font-black text-slate-900 tracking-tight text-left">{stat.value}</p></div>
              ))}
            </div>
          </div>
        )}
        {adminTab === 'menu' && (
          <div className="space-y-12">
            <div className="flex justify-between items-center"><h2 className="text-4xl font-black text-slate-900 tracking-tighter">Menu Management</h2><Button className="!rounded-2xl !py-4 flex gap-3 shadow-xl shadow-blue-50 px-8"><PlusCircle size={20}/> Create New Item</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-50 group hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-56 overflow-hidden"><img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity"><button className="bg-white p-3 rounded-2xl shadow-xl text-blue-600 hover:scale-110 active:scale-95 transition-all"><Edit3 size={20}/></button><button className="bg-white p-3 rounded-2xl shadow-xl text-red-500 hover:scale-110 active:scale-95 transition-all"><Trash2 size={20}/></button></div></div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-1"><h4 className="font-black text-xl text-slate-900 tracking-tight text-left">{item.name}</h4>{item.isFree && <span className="bg-emerald-50 text-emerald-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Free</span>}</div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 text-left">{item.category}</p>
                    <p className="font-black text-blue-600 text-3xl border-t border-slate-50 pt-8 tracking-tighter text-left">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {adminTab === 'orders' && (
          <div className="space-y-12">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter text-left">Live Fulfillment</h2>
             <div className="bg-white rounded-[40px] border border-slate-50 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-50"><tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest"><th className="px-10 py-8">Order ID</th><th className="px-10 py-8">Customer</th><th className="px-10 py-8">Net Total</th><th className="px-10 py-8">Workflow</th><th className="px-10 py-8">Operations</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {orderHistory.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-10 py-8 font-black text-slate-900 text-lg">{o.id}</td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-500">{o.userId || 'Guest Staff'}</td>
                        <td className="px-10 py-8 font-black text-blue-600 text-lg tracking-tight">₹{o.total}</td>
                        <td className="px-10 py-8"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${o.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>{o.status}</span></td>
                        <td className="px-10 py-8">
                          <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl p-3 text-xs font-black outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={(e) => setOrderHistory(prev => prev.map(item => item.id === o.id ? { ...item, status: e.target.value as any } : item))} value={o.status}>
                            <option value="Pending">Queue</option><option value="Preparing">Kitchen</option><option value="Ready">Ready</option><option value="Completed">Handover</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orderHistory.length === 0 && (
                      <tr><td colSpan={5} className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.4em] text-sm text-center">No incoming orders</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.LANDING: return renderLanding();
      case AppStep.WELCOME: return renderWelcome();
      case AppStep.VERIFY_OTP: return renderVerifyOtp();
      case AppStep.MENU: return renderMenu();
      case AppStep.CART: return renderCart();
      case AppStep.ORDER_SUMMARY: return renderOrderSummary();
      case AppStep.PAYMENT: return renderPayment();
      case AppStep.ORDER_STATUS: return renderOrderStatus();
      case AppStep.COLLECTION_QR: return renderCollectionQr();
      case AppStep.ORDER_COMPLETED: return renderUserPanel();
      case AppStep.ADMIN_DASHBOARD: return renderAdminDashboard();
      default: return renderLanding();
    }
  };

  return (
    <div className={`w-full min-h-screen relative overflow-hidden flex flex-col items-center mx-auto transition-all duration-500 ${currentStep === AppStep.ADMIN_DASHBOARD ? 'max-w-none bg-[#F8FAFC]' : 'max-w-md border-x border-slate-50 shadow-2xl bg-white'}`}>
      {renderStep()}
    </div>
  );
};

export default App;
