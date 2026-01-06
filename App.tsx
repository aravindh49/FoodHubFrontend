
import React, { useState, useMemo } from 'react';
import { AppStep, CartItem, MenuItem, OrderRecord } from './types';
import { MENU_ITEMS as INITIAL_MENU, FREE_LIMIT } from './constants';
import { Button } from './components/Button';
import { 
  Utensils, 
  ChevronLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  QrCode, 
  CheckCircle, 
  Clock, 
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Ticket,
  Bell,
  User,
  Settings,
  History,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  Edit3,
  Trash2,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LANDING);
  const [email, setEmail] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([
    {
      id: 'FH-8812',
      date: 'Oct 24, 2023',
      items: [{ ...INITIAL_MENU[0], quantity: 1 }],
      total: 0,
      status: 'COMPLETED'
    },
    {
      id: 'FH-7741',
      date: 'Oct 20, 2023',
      items: [
        { ...INITIAL_MENU[1], quantity: 1 },
        { ...INITIAL_MENU[3], quantity: 1 }
      ],
      total: 872,
      status: 'COMPLETED'
    }
  ]);

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const freeItemsUsed = useMemo(() => cart.filter(item => item.isFree).reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const tax = useMemo(() => cartTotal * 0.05, [cartTotal]);
  const finalTotal = useMemo(() => cartTotal + tax, [cartTotal, tax]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing?.quantity === 1) {
        return prev.filter(i => i.id !== itemId);
      }
      return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const completeOrder = () => {
    const newOrder: OrderRecord = {
      id: `FH-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      total: finalTotal,
      status: 'COMPLETED'
    };
    setOrderHistory(prev => [newOrder, ...prev]);
    setCurrentStep(AppStep.ORDER_COMPLETED);
    setCart([]);
  };

  const toggleMenuItemFree = (id: string) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, isFree: !item.isFree, price: !item.isFree ? 0 : 250 } : item));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const nextStep = () => {
    const steps = Object.values(AppStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps = Object.values(AppStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const BottomNav = () => {
    const activeClass = "text-indigo-600";
    const inactiveClass = "text-slate-400 hover:text-slate-600";
    
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-between items-center z-50 max-w-md mx-auto rounded-t-3xl">
        <button onClick={() => setCurrentStep(AppStep.MENU)} className={`flex flex-col items-center gap-1 transition-colors ${currentStep === AppStep.MENU ? activeClass : inactiveClass}`}>
          <Utensils className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
        </button>
        <button onClick={() => setCurrentStep(AppStep.CART)} className={`flex flex-col items-center gap-1 transition-colors ${currentStep === AppStep.CART ? activeClass : inactiveClass}`}>
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Tray</span>
        </button>
        <button onClick={() => setCurrentStep(AppStep.USER_PROFILE)} className={`flex flex-col items-center gap-1 transition-colors ${currentStep === AppStep.USER_PROFILE ? activeClass : inactiveClass}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </nav>
    );
  };

  const LandingView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E293B] p-6 text-center animate-in fade-in duration-1000 w-full">
      <div className="relative mb-12">
        <div className="absolute -inset-8 bg-indigo-500/20 blur-[50px] rounded-full" />
        <div className="bg-white p-7 rounded-[32px] shadow-2xl relative">
          <Utensils className="w-20 h-20 text-indigo-600" />
        </div>
      </div>
      <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">FoodHub</h1>
      <p className="text-slate-400 mb-20 text-lg font-medium max-w-[240px] leading-snug">The smarter way to dine at the office</p>
      
      <div className="w-full max-w-xs">
        <Button 
          fullWidth 
          onClick={() => setCurrentStep(AppStep.WELCOME)}
          className="bg-indigo-600 !text-white hover:bg-indigo-700 py-5 text-lg rounded-[24px] shadow-2xl shadow-indigo-500/30"
        >
          Get Started
        </Button>
      </div>
    </div>
  );

  const WelcomeView = () => (
    <div className="min-h-screen bg-[#F8FAFC] p-8 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500 w-full">
      <div className="w-full flex justify-center mb-16 mt-12">
        <div className="bg-indigo-600 p-5 rounded-[24px] shadow-xl">
          <Utensils className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Login</h2>
        <p className="text-slate-500 font-medium">Use your corporate ID to access</p>
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Email</label>
          <div className="relative">
            <input 
              type="email" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 pl-14 bg-white border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all shadow-sm font-medium"
            />
            <ShieldCheck className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <Button 
          fullWidth 
          onClick={nextStep} 
          disabled={!email.includes('@')}
          className="py-5 shadow-xl shadow-indigo-100 rounded-[24px]"
        >
          Send OTP
        </Button>
      </div>
    </div>
  );

  const VerifyOtpView = () => (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center animate-in slide-in-from-right-8 duration-500 w-full">
       <button onClick={prevStep} className="self-start mb-10 p-3 hover:bg-slate-50 rounded-full transition-colors">
         <ChevronLeft className="w-7 h-7 text-slate-600" />
       </button>
       <div className="bg-slate-50 p-6 rounded-[32px] mb-12">
        <Lock className="w-12 h-12 text-indigo-600" />
      </div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Verify Identity</h2>
        <p className="text-slate-500 max-w-[260px] mx-auto font-medium">We've sent a 6-digit verification code to your email</p>
      </div>
      <div className="grid grid-cols-6 gap-3 mb-12 w-full max-w-sm">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => {
              const newOtp = [...otp];
              newOtp[idx] = e.target.value;
              setOtp(newOtp);
              if (e.target.value && idx < 5) {
                (e.target.nextElementSibling as HTMLInputElement)?.focus();
              }
            }}
            className="w-full h-16 text-center text-3xl font-black bg-[#F8FAFC] border-2 border-slate-100 rounded-[20px] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
          />
        ))}
      </div>
      <Button fullWidth onClick={nextStep} className="mb-8 py-5 shadow-2xl shadow-indigo-100 rounded-[24px]">Continue</Button>
      <button className="text-indigo-600 font-black hover:text-indigo-700 tracking-tight">Request new code</button>
    </div>
  );

  const MenuView = () => (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col pb-32 w-full">
      <header className="bg-white/95 backdrop-blur-xl px-8 py-6 flex justify-between items-center sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">FoodHub</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Nexus Tower Kiosk</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-slate-50 rounded-[18px] text-slate-600 relative"><Bell className="w-5 h-5" /></button>
          <button 
            onClick={() => setCurrentStep(AppStep.CART)}
            className="relative p-3.5 bg-indigo-600 rounded-[18px] shadow-lg shadow-indigo-200 transition-transform active:scale-95"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-[3px] border-white shadow-xl">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>
      <div className="p-8">
        <div className="mb-10 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[32px] shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700" />
          <div className="relative z-10">
            <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-1">Corporate Pass</p>
            <h2 className="text-2xl font-bold text-white mb-4">You have {FREE_LIMIT - freeItemsUsed} free meals left today</h2>
            <div className="flex items-center gap-2">
               <Ticket className="w-5 h-5 text-white/60" />
               <span className="text-white font-black text-sm">Valid until 6:00 PM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Today's Menu</h3>
          <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">Chef Specials</span>
        </div>
        <div className="grid gap-10">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-50 hover:-translate-y-2">
              <div className="relative aspect-[16/11]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {item.isFree && (
                  <div className="absolute top-6 left-6 bg-green-500 text-white text-[11px] font-black px-4 py-2 rounded-full shadow-2xl backdrop-blur-md">
                    CORPORATE FREE
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{item.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-black ${item.isFree ? 'text-green-500' : 'text-indigo-600'}`}>
                        {item.isFree ? '₹0.00' : `₹${item.price}`}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-indigo-600 text-white w-14 h-14 rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-90 transition-all"
                  >
                    <Plus className="w-7 h-7" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );

  const CartView = () => (
    <div className="min-h-screen bg-white flex flex-col animate-in slide-in-from-bottom-12 pb-32 w-full">
      <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xl z-20">
        <div className="flex items-center gap-5">
          <button onClick={() => setCurrentStep(AppStep.MENU)} className="p-3 hover:bg-slate-50 rounded-[20px] transition-colors border border-slate-100">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-3xl font-black tracking-tighter">Your Tray</h1>
        </div>
        <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-tighter">{cartCount} Items</span>
      </div>
      <div className="flex-1 p-8 space-y-8 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-300 text-center">
            <ShoppingCart className="w-16 h-16 mb-6" />
            <p className="text-2xl font-black text-slate-900 mb-2">Empty Tray</p>
            <p className="text-sm font-medium">Head back to the menu to add items</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 items-center bg-[#FDFCFB] p-6 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-[24px] object-cover shadow-xl" />
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 text-lg leading-tight mb-1">{item.name}</h3>
                  <p className={`text-base font-black ${item.isFree ? 'text-green-500' : 'text-indigo-600'}`}>
                    {item.isFree ? 'FREE' : `₹${item.price}`}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 bg-white p-1.5 rounded-[22px] shadow-xl border border-slate-50">
                  <button onClick={() => addToCart(item)} className="p-2.5 hover:bg-indigo-50 rounded-xl text-indigo-600"><Plus className="w-4 h-4" /></button>
                  <span className="font-black text-base text-slate-900 w-6 text-center">{item.quantity}</span>
                  <button onClick={() => removeFromCart(item.id)} className="p-2.5 hover:bg-red-50 rounded-xl text-slate-400"><Minus className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="p-10 bg-[#1E293B] text-white rounded-t-[50px] shadow-2xl mb-20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Bill</p>
              <p className="text-4xl font-black tracking-tighter">₹{cartTotal}</p>
            </div>
            <Button onClick={nextStep} className="!bg-white !text-slate-900 !py-5 px-10 rounded-[28px] group font-black">
              Checkout <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
            </Button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );

  const SummaryView = () => (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col w-full pb-40">
      <div className="bg-white px-8 py-8 border-b border-slate-100 flex items-center gap-5 sticky top-0 z-10">
        <button onClick={prevStep} className="p-3 hover:bg-slate-50 rounded-[20px] transition-colors border border-slate-100"><ChevronLeft className="w-6 h-6 text-slate-700" /></button>
        <h1 className="text-2xl font-black tracking-tighter">Summary</h1>
      </div>
      <div className="p-8 space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6"><Ticket className="w-6 h-6 text-green-500" /><h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Free Allotment</h3></div>
          <div className="space-y-4">
            {cart.filter(i => i.isFree).map(item => (
              <div key={item.id} className="bg-white p-5 rounded-[32px] flex items-center gap-6 shadow-sm border border-slate-50">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[20px] object-cover" />
                <div className="flex-1"><h4 className="font-bold text-slate-900 text-lg leading-tight">{item.name}</h4><p className="text-slate-400 text-[10px] font-black uppercase mt-1">Qty: {item.quantity}</p></div>
                <div className="bg-green-50 text-green-600 text-[10px] font-black px-4 py-2 rounded-2xl border border-green-100">FREE</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="flex items-center gap-3 mb-6"><Zap className="w-6 h-6 text-indigo-500" /><h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Paid Items</h3></div>
          <div className="space-y-4">
            {cart.filter(i => !i.isFree).map(item => (
              <div key={item.id} className="bg-white p-5 rounded-[32px] flex items-center gap-6 shadow-sm border border-slate-50">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[20px] object-cover" />
                <div className="flex-1"><h4 className="font-bold text-slate-900 text-lg leading-tight">{item.name}</h4><p className="text-slate-400 text-[10px] font-black uppercase mt-1">Qty: {item.quantity}</p></div>
                <span className="font-black text-indigo-600 text-xl">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="bg-white p-10 fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-slate-100 rounded-t-[50px] shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-900 text-3xl font-black">Total</span>
          <span className="text-indigo-600 text-3xl font-black">₹{finalTotal.toFixed(0)}</span>
        </div>
        <Button fullWidth onClick={nextStep} className="py-6 text-xl">Confirm Order</Button>
      </div>
    </div>
  );

  const PaymentView = () => (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center animate-in slide-in-from-right-8 duration-500 w-full">
      <button onClick={prevStep} className="self-start mb-10 p-3 hover:bg-slate-50 rounded-full transition-colors border border-slate-100"><ChevronLeft className="w-7 h-7 text-slate-600" /></button>
      <div className="bg-indigo-50 p-6 rounded-[32px] mb-12"><ShieldCheck className="w-12 h-12 text-indigo-600" /></div>
      <div className="text-center mb-12"><h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Payment</h2><p className="text-slate-500 font-medium">Safe and secure transactions</p></div>
      <div className="w-full space-y-4 mb-12">
        <div className="p-6 bg-[#F8FAFC] rounded-[28px] border-2 border-indigo-600 flex items-center justify-between">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><Zap className="w-6 h-6 text-indigo-600" /></div><div><p className="font-black text-slate-900">Corporate Wallet</p><p className="text-xs text-slate-500 font-medium">Balance: ₹2,450</p></div></div>
          <div className="w-6 h-6 rounded-full border-4 border-indigo-600 bg-white" />
        </div>
      </div>
      <div className="mt-auto w-full space-y-6">
        <div className="flex justify-between items-center px-4"><span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">To Pay</span><span className="text-3xl font-black text-slate-900">₹{finalTotal.toFixed(0)}</span></div>
        <Button fullWidth onClick={nextStep} className="py-5 shadow-2xl rounded-[24px]">Pay Now</Button>
      </div>
    </div>
  );

  const StatusView = () => (
    <div className="min-h-screen bg-[#FDFCFB] p-8 flex flex-col items-center animate-in fade-in duration-500 w-full">
      <div className="w-full flex justify-between items-center mb-16"><h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Status</h2><span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">Preparing</span></div>
      <div className="relative w-48 h-48 mb-16">
        <div className="absolute inset-0 bg-indigo-600/5 rounded-full animate-pulse scale-150" />
        <div className="relative bg-white w-48 h-48 rounded-full flex items-center justify-center shadow-2xl border border-slate-100">
          <Clock className="w-16 h-16 text-indigo-600 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>
      <div className="text-center space-y-4 mb-16"><h3 className="text-3xl font-black text-slate-900 tracking-tight">Cooking in progress</h3><p className="text-slate-500 font-medium max-w-[200px] mx-auto">Our chef is preparing your meal with care.</p></div>
      <Button fullWidth onClick={nextStep} className="mt-12 py-5 rounded-[24px]">Skip to Collection</Button>
    </div>
  );

  const CollectionQrView = () => (
    <div className="min-h-screen bg-indigo-600 p-8 flex flex-col items-center animate-in slide-in-from-bottom-12 duration-500 w-full">
      <div className="w-full flex justify-between items-center mb-16 text-white"><h2 className="text-2xl font-black tracking-tight">Collect Meal</h2><QrCode className="w-6 h-6" /></div>
      <div className="bg-white p-10 rounded-[50px] shadow-2xl mb-12 relative overflow-hidden">
        <div className="p-4 border-2 border-slate-100 rounded-[32px] bg-white"><QrCode className="w-48 h-48 text-slate-900" /></div>
      </div>
      <div className="text-center text-white mb-16"><h3 className="text-2xl font-black mb-3">Scan at Kiosk</h3><p className="text-indigo-100 font-medium opacity-80 max-w-[200px] mx-auto">Present this code at the Kiosk to collect your tray.</p></div>
      <Button fullWidth onClick={completeOrder} className="!bg-white !text-indigo-600 py-6 text-xl rounded-[30px] font-black">Order Collected</Button>
    </div>
  );

  const SuccessView = () => (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center animate-in zoom-in duration-500 w-full">
      <div className="bg-green-50 p-8 rounded-[50px] mb-12 relative"><CheckCircle className="w-24 h-24 text-green-500 relative z-10" /></div>
      <div className="text-center space-y-4 mb-16"><h2 className="text-4xl font-black text-slate-900 tracking-tighter">Awesome!</h2><p className="text-slate-500 font-medium max-w-[240px] mx-auto">Your meal has been collected.</p></div>
      <div className="w-full space-y-4 max-w-xs">
        <Button fullWidth onClick={() => setCurrentStep(AppStep.MENU)} className="py-5">Order Another Meal</Button>
        <button onClick={() => setCurrentStep(AppStep.USER_PROFILE)} className="w-full py-4 text-slate-400 font-black hover:text-indigo-600 transition-colors uppercase text-xs tracking-widest">View History</button>
      </div>
    </div>
  );

  const OrderDetailOverlay = ({ order, onClose }: { order: OrderRecord, onClose: () => void }) => (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-t-[50px] shadow-2xl animate-in slide-in-from-bottom-full duration-500 flex flex-col max-h-[90vh]">
        <div className="px-8 py-10 border-b border-slate-50 flex items-center justify-between">
           <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Details</p><h2 className="text-2xl font-black tracking-tighter text-slate-900">{order.id}</h2></div>
           <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-400">{order.date}</span><span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 uppercase">{order.status}</span></div>
           <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100/50">
                  <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-1"><h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4><p className="text-slate-400 text-[10px] font-black uppercase mt-1">Qty: {item.quantity}</p></div>
                  <p className="font-black text-slate-900 text-sm">{item.isFree ? 'FREE' : `₹${item.price * item.quantity}`}</p>
                </div>
              ))}
           </div>
        </div>
        <div className="p-10 bg-slate-900 text-white rounded-t-[40px]">
           <div className="flex justify-between items-center mb-6"><span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Total Amount</span><span className="text-3xl font-black tracking-tighter text-indigo-400">₹{order.total}</span></div>
           <Button fullWidth onClick={onClose} className="!bg-white !text-slate-900 !py-4">Close Details</Button>
        </div>
      </div>
    </div>
  );

  const UserProfileView = () => (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-32 animate-in slide-in-from-right-12 w-full">
      <header className="bg-white px-8 py-10 flex flex-col items-center border-b border-slate-100 rounded-b-[50px] shadow-sm">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-black">{email.charAt(0).toUpperCase() || 'U'}</div>
          <button onClick={() => setCurrentStep(AppStep.ADMIN_DASHBOARD)} className="absolute bottom-0 right-0 p-2 bg-white border border-slate-200 rounded-full shadow-lg text-indigo-600"><Settings className="w-4 h-4" /></button>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">{email ? email.split('@')[0] : 'Guest User'}</h2>
        <p className="text-slate-400 font-medium text-sm">{email || 'Not logged in'}</p>
      </header>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50"><TrendingUp className="w-6 h-6 text-green-500 mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved</p><p className="text-xl font-black text-slate-900">₹1,240</p></div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50"><History className="w-6 h-6 text-indigo-600 mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</p><p className="text-xl font-black text-slate-900">{orderHistory.length}</p></div>
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><History className="w-5 h-5 text-indigo-600" /> Recent History</h3>
          <div className="space-y-4">
            {orderHistory.map(order => (
              <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
                <div className="flex gap-4 items-center"><div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600"><Utensils className="w-6 h-6" /></div><div><p className="font-bold text-slate-900 leading-none mb-1">{order.id}</p><p className="text-[10px] font-bold text-slate-400">{order.date}</p></div></div>
                <div className="text-right"><p className="font-black text-slate-900">₹{order.total}</p><div className="flex items-center gap-2 justify-end"><span className="text-[8px] font-black text-green-500 uppercase bg-green-50 px-2 py-0.5 rounded-full">{order.status}</span><ArrowRight className="w-3 h-3 text-slate-300" /></div></div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setCurrentStep(AppStep.LANDING)} className="w-full py-5 bg-red-50 text-red-500 font-black rounded-[24px] flex items-center justify-center gap-3 mt-8 border border-red-100"><LogOut className="w-5 h-5" /> Logout</button>
      </div>
      {selectedOrder && <OrderDetailOverlay order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      <BottomNav />
    </div>
  );

  const AdminDashboardView = () => (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col pb-12 animate-in fade-in duration-500 w-full">
      <header className="bg-slate-900 px-8 pt-10 pb-20 rounded-b-[60px] relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start mb-8">
          <button onClick={() => setCurrentStep(AppStep.USER_PROFILE)} className="p-3 bg-white/10 rounded-[20px] backdrop-blur-md text-white"><ChevronLeft className="w-6 h-6" /></button>
          <div className="text-right"><h1 className="text-2xl font-black text-white italic tracking-tighter">ADMIN</h1><p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Kiosk Manager</p></div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-[32px] border border-white/10 text-white"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Revenue</p><p className="text-2xl font-black">₹{orderHistory.reduce((acc, o) => acc + o.total, 0)}</p></div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-[32px] border border-white/10 text-white"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Active</p><p className="text-2xl font-black">04</p></div>
        </div>
      </header>
      <div className="px-8 -mt-10 space-y-10">
        <section className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50">
          <h3 className="text-xl font-black text-slate-900 mb-8">Menu Catalog</h3>
          <div className="space-y-6">
            {menuItems.map(item => (
              <div key={item.id} className="flex gap-5 items-center pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1"><h4 className="font-bold text-slate-900 leading-tight mb-1">{item.name}</h4><div className="flex gap-2 items-center"><span className="text-xs font-black text-indigo-600">₹{item.price}</span><button onClick={() => toggleMenuItemFree(item.id)} className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${item.isFree ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{item.isFree ? 'FREE' : 'PAID'}</button></div></div>
                <div className="flex gap-2"><button className="p-2 text-slate-300"><Edit3 className="w-4 h-4" /></button><button onClick={() => deleteMenuItem(item.id)} className="p-2 text-slate-300"><Trash2 className="w-4 h-4" /></button></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.LANDING: return <LandingView />;
      case AppStep.WELCOME: return <WelcomeView />;
      case AppStep.VERIFY_OTP: return <VerifyOtpView />;
      case AppStep.MENU: return <MenuView />;
      case AppStep.CART: return <CartView />;
      case AppStep.ORDER_SUMMARY: return <SummaryView />;
      case AppStep.PAYMENT: return <PaymentView />;
      case AppStep.ORDER_STATUS: return <StatusView />;
      case AppStep.COLLECTION_QR: return <CollectionQrView />;
      case AppStep.ORDER_COMPLETED: return <SuccessView />;
      case AppStep.USER_PROFILE: return <UserProfileView />;
      case AppStep.ADMIN_DASHBOARD: return <AdminDashboardView />;
      default: return <LandingView />;
    }
  };

  return (
    <div className="max-w-md w-full min-h-screen relative overflow-hidden bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] flex flex-col items-center">
      {renderStep()}
    </div>
  );
};

export default App;
