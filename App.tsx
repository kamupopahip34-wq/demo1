
import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { User, UserRole, Task, TaskProof, Withdrawal, ProofStatus, WithdrawalStatus, TaskStatus, CryptoNetwork } from './types';
import { Icons, ADMIN_CREDENTIALS } from './constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

// --- Shared Components ---

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300'
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${props.className || ''}`}
  />
);

const Badge: React.FC<{ status: string }> = ({ status }) => {
  const colors: any = {
    PUBLISHED: 'bg-green-500/10 text-green-500',
    HOLD: 'bg-yellow-500/10 text-yellow-500',
    PENDING: 'bg-blue-500/10 text-blue-500',
    APPROVED: 'bg-green-500/10 text-green-500',
    REJECTED: 'bg-red-500/10 text-red-500',
    ACTIVE: 'bg-green-500/10 text-green-500',
    BLOCKED: 'bg-red-500/10 text-red-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || 'bg-slate-500/10 text-slate-400'}`}>
      {status}
    </span>
  );
};

// --- App Pages ---

const DashboardStats = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {stats.map((s: any, i: number) => (
      <Card key={i} className="flex flex-col items-center justify-center text-center">
        <span className="text-slate-400 text-sm mb-1">{s.label}</span>
        <span className="text-2xl font-bold text-white">{s.value}</span>
        {s.subValue && <span className="text-xs text-green-500 mt-1">{s.subValue}</span>}
      </Card>
    ))}
  </div>
);

const LandingPage = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-[120px]"></div>
    </div>
    
    <nav className="p-6 flex justify-between items-center relative z-10">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Icons.Tasks className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">TaskEarn</span>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={() => onNavigate('login')}>Login</Button>
        <Button onClick={() => onNavigate('register')}>Get Started</Button>
      </div>
    </nav>

    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
      <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
        Complete Tasks.<br />
        <span className="text-blue-500">Earn Crypto.</span>
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
        The ultimate platform for micro-tasks. Follow, share, or review and get paid instantly in BEP20 or TRC20 tokens. Join over 10,000 active earners today.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button className="flex-1 py-4 text-lg" onClick={() => onNavigate('register')}>Join the Community</Button>
        <Button variant="secondary" className="flex-1 py-4 text-lg" onClick={() => onNavigate('login')}>Admin Dashboard</Button>
      </div>
    </main>

    <footer className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-slate-500 relative z-10">
      <div>© 2024 TaskEarn Inc.</div>
      <div className="hover:text-slate-300 cursor-pointer">Terms & Conditions</div>
      <div className="hover:text-slate-300 cursor-pointer">Privacy Policy</div>
      <div className="hover:text-slate-300 cursor-pointer">Support</div>
    </footer>
  </div>
);

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) onLogin(user);
    else setError('Invalid credentials. Hint: Check metadata for Admin login.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <Icons.Tasks className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-slate-500">Log in to manage your tasks</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full py-3">Sign In</Button>
        </form>
        
        <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase font-bold mb-2">Demo Credentials</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-400">Admin:</span> {ADMIN_CREDENTIALS.email}</p>
            <p><span className="text-slate-400">Pass:</span> {ADMIN_CREDENTIALS.password}</p>
            <div className="h-px bg-slate-700 my-2"></div>
            <p><span className="text-slate-400">User:</span> demo@user.com</p>
            <p><span className="text-slate-400">Pass:</span> password</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- User Module ---

const UserLayout: React.FC<{ user: User; onLogout: () => void; children: React.ReactNode; currentPage: string; onNavigate: (p: string) => void }> = ({ user, onLogout, children, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 md:pb-0 md:pl-64">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Icons.Tasks className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">TaskEarn</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
            { id: 'tasks', label: 'Available Tasks', icon: Icons.Tasks },
            { id: 'wallet', label: 'Wallet', icon: Icons.Wallet },
            { id: 'notifications', label: 'Notifications', icon: Icons.Bell },
            { id: 'profile', label: 'Profile', icon: Icons.Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPage === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-500/10" onClick={onLogout}>Logout</Button>
        </div>
      </aside>

      {/* Header Mobile */}
      <header className="md:hidden p-4 flex justify-between items-center bg-slate-900 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-lg bg-opacity-80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icons.Tasks className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold">TaskEarn</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Balance</p>
            <p className="font-bold text-blue-500">${user.balance.toFixed(2)}</p>
          </div>
          <button onClick={() => onNavigate('profile')} className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700"></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
        {children}
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex justify-around p-2 z-40">
        {[
          { id: 'dashboard', label: 'Home', icon: Icons.Dashboard },
          { id: 'tasks', label: 'Tasks', icon: Icons.Tasks },
          { id: 'wallet', label: 'Wallet', icon: Icons.Wallet },
          { id: 'notifications', label: 'Alerts', icon: Icons.Bell },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentPage === item.id ? 'text-blue-500' : 'text-slate-500'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const UserDashboard = ({ user, tasks, proofs }: { user: User, tasks: Task[], proofs: TaskProof[] }) => {
  const userProofs = proofs.filter(p => p.userId === user.id);
  const pending = userProofs.filter(p => p.status === ProofStatus.PENDING).length;
  const approved = userProofs.filter(p => p.status === ProofStatus.APPROVED).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">Hi, {user.email.split('@')[0]}!</h2>
          <p className="text-slate-400">Track your earnings and progress.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-slate-500 text-sm">Total Balance</p>
          <p className="text-4xl font-black text-blue-500">${user.balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none">
          <p className="text-blue-100 text-sm font-medium">Available Tasks</p>
          <p className="text-4xl font-bold text-white mt-1">{tasks.filter(t => !t.isDeleted && t.status === TaskStatus.PUBLISHED).length}</p>
          <div className="mt-4 flex items-center text-blue-100 text-xs">
            <Icons.Check className="w-3 h-3 mr-1" /> Ready to earn
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm font-medium">Pending Proofs</p>
          <p className="text-4xl font-bold text-white mt-1">{pending}</p>
          <div className="mt-4 flex items-center text-slate-500 text-xs">
             Awaiting admin review
          </div>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm font-medium">Completed Tasks</p>
          <p className="text-4xl font-bold text-white mt-1">{approved}</p>
          <div className="mt-4 flex items-center text-green-500 text-xs">
            <Icons.Check className="w-3 h-3 mr-1" /> Success rate 100%
          </div>
        </Card>
      </div>

      <h3 className="text-xl font-bold mt-8">Recent Activity</h3>
      <div className="space-y-3">
        {userProofs.length === 0 ? (
          <p className="text-slate-500 italic">No activity yet. Start a task to earn!</p>
        ) : (
          userProofs.slice(0, 5).map(p => (
            <Card key={p.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${p.status === ProofStatus.APPROVED ? 'bg-green-500/10' : 'bg-slate-700/50'}`}>
                  <Icons.Tasks className={`w-5 h-5 ${p.status === ProofStatus.APPROVED ? 'text-green-500' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-sm">{p.taskTitle}</p>
                  <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-500">+${p.reward.toFixed(2)}</p>
                <Badge status={p.status} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const TaskListView = ({ tasks, onSelectTask }: { tasks: Task[], onSelectTask: (t: Task) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-black">All Tasks</h2>
      <div className="flex gap-2">
        <Button variant="secondary" className="text-xs">Filter</Button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.filter(t => !t.isDeleted && t.status === TaskStatus.PUBLISHED).map(task => (
        <Card key={task.id} className="hover:border-blue-500/50 cursor-pointer group transition-all" onClick={() => onSelectTask(task)}>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-600/10 p-3 rounded-2xl">
              <Icons.Tasks className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">${task.reward.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Reward</p>
            </div>
          </div>
          <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{task.title}</h3>
          <p className="text-slate-400 text-sm mt-2 line-clamp-2">{task.description}</p>
          <div className="mt-6 flex justify-between items-center border-t border-slate-700 pt-4">
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase font-bold">Progress</span>
               <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(task.completedCount / task.quantity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold">{task.completedCount}/{task.quantity}</span>
               </div>
            </div>
            <Button className="px-6">Earn Now</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const TaskDetailView = ({ task, user, onSubmit, onBack }: { task: Task, user: User, onSubmit: (file: string) => void, onBack: () => void }) => {
  const [file, setFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setFile(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleFinish = () => {
    if (!file) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(file);
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">← Back to List</Button>
      <Card>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black">{task.title}</h2>
          <div className="text-right">
            <p className="text-3xl font-black text-blue-500">${task.reward.toFixed(2)}</p>
            <p className="text-xs text-slate-500">Fixed Reward</p>
          </div>
        </div>
        <div className="p-4 bg-blue-500/10 rounded-xl mb-6">
          <p className="text-blue-400 font-bold text-sm mb-2">Instructions:</p>
          <p className="text-slate-300 text-sm whitespace-pre-wrap">{task.instructions}</p>
        </div>
        
        <div className="space-y-4">
          <p className="font-bold text-sm">Upload Proof Screenshot:</p>
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-green-500 bg-green-500/5' : 'border-slate-700 hover:border-blue-500 bg-slate-900/50'}`}
          >
            {file ? (
              <div className="relative w-full aspect-video">
                <img src={file} className="w-full h-full object-contain rounded-lg" alt="Proof" />
                <button onClick={() => setFile(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg">
                  <Icons.X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Icons.Plus className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Click to upload screenshot</p>
                <p className="text-slate-600 text-xs">JPG, PNG up to 5MB</p>
                <input type="file" accept="image/*" className="absolute opacity-0 w-full h-full cursor-pointer" onChange={handleFileChange} />
              </>
            )}
          </div>
          
          <Button 
            className="w-full py-4 text-lg" 
            disabled={!file || submitting} 
            onClick={handleFinish}
          >
            {submitting ? 'Submitting Proof...' : 'Submit Verification'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const WalletView = ({ user, withdrawals, onRequestWithdrawal }: { user: User, withdrawals: Withdrawal[], onRequestWithdrawal: (data: any) => void }) => {
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState<CryptoNetwork>(CryptoNetwork.BEP20);
  const [address, setAddress] = useState('');

  const canWithdraw = parseFloat(amount) >= 1 && parseFloat(amount) <= user.balance && address.length > 20;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-3xl font-black">My Wallet</h2>
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Icons.Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Active Balance</p>
              <p className="text-4xl font-black text-white">${user.balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-white/80 text-sm">
            <span>Verified Account</span>
            <span className="flex items-center gap-1"><Icons.Check className="w-4 h-4" /> Secure</span>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-6">Request Withdrawal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Network</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setNetwork(CryptoNetwork.BEP20)}
                  className={`py-3 rounded-xl border font-bold transition-all ${network === CryptoNetwork.BEP20 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                >
                  BEP20
                </button>
                <button 
                  onClick={() => setNetwork(CryptoNetwork.TRC20)}
                  className={`py-3 rounded-xl border font-bold transition-all ${network === CryptoNetwork.TRC20 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                >
                  TRC20
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Wallet Address</label>
              <Input placeholder="Enter your crypto address" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (Min $1.00)</label>
              <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <Button className="w-full py-4" disabled={!canWithdraw} onClick={() => onRequestWithdrawal({ amount: parseFloat(amount), network, walletAddress: address })}>
              Withdraw Funds
            </Button>
            <p className="text-[10px] text-slate-500 text-center">Standard processing time: 24-48 hours.</p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-black">History</h2>
        <div className="space-y-3">
          {withdrawals.length === 0 ? (
            <p className="text-slate-500 italic">No withdrawals yet.</p>
          ) : (
            withdrawals.map(w => (
              <Card key={w.id} className="flex justify-between items-center py-4">
                <div>
                  <p className="font-bold text-sm">${w.amount.toFixed(2)} - {w.network}</p>
                  <p className="text-[10px] text-slate-500 truncate w-32">{w.walletAddress}</p>
                </div>
                <Badge status={w.status} />
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Admin Module ---

const AdminLayout: React.FC<{ user: User; onLogout: () => void; children: React.ReactNode; currentPage: string; onNavigate: (p: string) => void }> = ({ user, onLogout, children, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Admin */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Icons.Tasks className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl leading-none">Admin</h1>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Control Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          {[
            { id: 'admin-dashboard', label: 'Overview', icon: Icons.Dashboard },
            { id: 'admin-tasks', label: 'Tasks Management', icon: Icons.Tasks },
            { id: 'admin-proofs', label: 'Approvals Queue', icon: Icons.Check },
            { id: 'admin-users', label: 'User Directory', icon: Icons.Users },
            { id: 'admin-withdrawals', label: 'Withdrawal Hub', icon: Icons.Wallet },
            { id: 'admin-settings', label: 'System Settings', icon: Icons.Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${currentPage === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <span className="font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
           <Card className="bg-slate-800 border-slate-700/50 p-4">
             <div className="flex items-center gap-3 mb-3">
               <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                 <Icons.Users className="w-4 h-4 text-blue-400" />
               </div>
               <p className="text-xs font-bold text-slate-400">T6068422</p>
             </div>
             <Button variant="danger" className="w-full text-xs py-2" onClick={onLogout}>Sign Out</Button>
           </Card>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto max-h-screen custom-scrollbar">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-black capitalize tracking-tight">{currentPage.replace('admin-', '').replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg"><Icons.Bell className="w-5 h-5" /></button>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"></div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const AdminDashboard = ({ db }: { db: any }) => {
  const chartData = [
    { name: 'Mon', signups: 12, completions: 45 },
    { name: 'Tue', signups: 19, completions: 52 },
    { name: 'Wed', signups: 15, completions: 38 },
    { name: 'Thu', signups: 22, completions: 65 },
    { name: 'Fri', signups: 30, completions: 80 },
    { name: 'Sat', signups: 25, completions: 90 },
    { name: 'Sun', signups: 28, completions: 110 },
  ];

  const stats = [
    { label: 'Total Users', value: db.users.length, subValue: '+14% from last week' },
    { label: 'Pending Proofs', value: db.proofs.filter((p: any) => p.status === 'PENDING').length, subValue: 'Action Required' },
    { label: 'Withdrawal Req', value: db.withdrawals.filter((w: any) => w.status === 'PENDING').length, subValue: 'Action Required' },
    { label: 'Total Payouts', value: `$${db.withdrawals.filter((w: any) => w.status === 'APPROVED').reduce((acc: any, w: any) => acc + w.amount, 0).toFixed(2)}`, subValue: 'USD' },
  ];

  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-96">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-300">Registration Growth</h3>
             <Badge status="ACTIVE" />
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="signups" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSignups)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-96">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-300">Task Completion Trend</h3>
             <span className="text-xs text-slate-500">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
              <Bar dataKey="completions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card>
            <h3 className="font-bold mb-4">Latest Tasks</h3>
            <div className="space-y-2">
               {db.tasks.slice(0, 3).map((t: any) => (
                 <div key={t.id} className="flex justify-between items-center p-3 hover:bg-slate-800/50 rounded-xl transition-all">
                   <div>
                     <p className="font-bold text-sm">{t.title}</p>
                     <p className="text-[10px] text-slate-500">{t.completedCount}/{t.quantity} Slots Filled</p>
                   </div>
                   <Badge status={t.status} />
                 </div>
               ))}
            </div>
         </Card>
         <Card>
            <h3 className="font-bold mb-4">Urgent Actions</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <Icons.Wallet className="w-5 h-5 text-red-500" />
                <p className="text-sm font-medium">12 Withdrawal requests pending</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Icons.Check className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium">8 Proofs awaiting verification</p>
              </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

const TaskManager = ({ db, onCreate, onToggleStatus, onDelete }: { db: any, onCreate: (t: any) => void, onToggleStatus: (id: string, s: TaskStatus) => void, onDelete: (id: string) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', reward: '', quantity: '', instructions: '' });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input placeholder="Search tasks..." className="w-64 py-2 text-sm" />
          <Button variant="secondary" className="text-sm">Bulk Actions</Button>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Create New Task</Button>
      </div>

      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase font-bold">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Reward</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {db.tasks.filter((t: any) => !t.isDeleted).map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-all text-sm group">
                <td className="px-6 py-4 font-bold">{t.title}</td>
                <td className="px-6 py-4 text-blue-500 font-bold">${t.reward.toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-400">{t.completedCount} / {t.quantity}</td>
                <td className="px-6 py-4"><Badge status={t.status} /></td>
                <td className="px-6 py-4 text-slate-500 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleStatus(t.id, t.status === TaskStatus.PUBLISHED ? TaskStatus.HOLD : TaskStatus.PUBLISHED)} className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg">
                      {t.status === TaskStatus.PUBLISHED ? 'Hold' : 'Publish'}
                    </button>
                    <button onClick={() => onDelete(t.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Icons.Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-xl animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Task</h2>
              <button onClick={() => setShowModal(false)}><Icons.X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <div className="space-y-4">
              <Input placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              <textarea 
                className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Reward Amount" value={newTask.reward} onChange={e => setNewTask({ ...newTask, reward: e.target.value })} />
                <Input type="number" placeholder="Total Quantity" value={newTask.quantity} onChange={e => setNewTask({ ...newTask, quantity: e.target.value })} />
              </div>
              <textarea 
                className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Step-by-step instructions"
                value={newTask.instructions}
                onChange={e => setNewTask({ ...newTask, instructions: e.target.value })}
              />
              <Button className="w-full py-4" onClick={() => { onCreate({ ...newTask, reward: parseFloat(newTask.reward), quantity: parseInt(newTask.quantity), status: TaskStatus.PUBLISHED }); setShowModal(false); }}>
                Publish Task
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const ProofApprovals = ({ proofs, onReview }: { proofs: TaskProof[], onReview: (id: string, s: ProofStatus, note: string) => void }) => {
  const [selectedProof, setSelectedProof] = useState<TaskProof | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase font-bold">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {proofs.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-all text-sm group">
                <td className="px-6 py-4 font-bold">{p.userName}</td>
                <td className="px-6 py-4 text-slate-400">{p.taskTitle}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4"><Badge status={p.status} /></td>
                <td className="px-6 py-4 text-right">
                  <Button variant="secondary" className="text-xs" onClick={() => setSelectedProof(p)}>Inspect</Button>
                </td>
              </tr>
            ))}
            {proofs.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No proofs pending review.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Proof Inspection</h2>
              <button onClick={() => setSelectedProof(null)}><Icons.X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img src={selectedProof.screenshot} className="w-full rounded-xl border border-slate-700 shadow-lg" alt="User Proof" />
              </div>
              <div className="space-y-4">
                <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">User Information</p>
                   <p className="text-sm font-bold text-white">{selectedProof.userName}</p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Reward At Stake</p>
                   <p className="text-xl font-black text-blue-500">${selectedProof.reward.toFixed(2)}</p>
                </div>
                <div className="h-px bg-slate-800 my-4"></div>
                <div className="flex flex-col gap-2">
                   <Button onClick={() => { onReview(selectedProof.id, ProofStatus.APPROVED, "Verified by Admin"); setSelectedProof(null); }}>Approve & Pay</Button>
                   <Button variant="danger" onClick={() => { onReview(selectedProof.id, ProofStatus.REJECTED, "Invalid proof provided"); setSelectedProof(null); }}>Reject Submission</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Main App Entry ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState('home');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const { 
    db, login, createTask, updateTaskStatus, softDeleteTask, 
    submitProof, reviewProof, requestWithdrawal, reviewWithdrawal,
    updateUserStatus
  } = useStore();

  useEffect(() => {
    // If we're logged in, set default dashboard
    if (currentUser) {
      if (currentUser.role === UserRole.ADMIN) setPage('admin-dashboard');
      else setPage('dashboard');
    } else {
      setPage('home');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('home');
  };

  const handleTaskSubmit = (screenshot: string) => {
    if (!activeTask || !currentUser) return;
    submitProof({
      taskId: activeTask.id,
      userId: currentUser.id,
      userName: currentUser.email.split('@')[0],
      taskTitle: activeTask.title,
      screenshot: screenshot,
      reward: activeTask.reward
    });
    setPage('dashboard');
    setActiveTask(null);
  };

  // --- Router ---
  
  if (page === 'home') return <LandingPage onNavigate={setPage} />;
  if (page === 'login') return <LoginPage onLogin={setCurrentUser} />;
  if (page === 'register') return <LoginPage onLogin={setCurrentUser} />; // Simplified

  // Role: User Views
  if (currentUser?.role === UserRole.USER) {
    let content;
    switch (page) {
      case 'dashboard': content = <UserDashboard user={currentUser} tasks={db.tasks} proofs={db.proofs} />; break;
      case 'tasks': content = <TaskListView tasks={db.tasks} onSelectTask={(t) => { setActiveTask(t); setPage('task-detail'); }} />; break;
      case 'task-detail': content = activeTask ? <TaskDetailView user={currentUser} task={activeTask} onBack={() => setPage('tasks')} onSubmit={handleTaskSubmit} /> : null; break;
      case 'wallet': content = <WalletView user={currentUser} withdrawals={db.withdrawals.filter((w: any) => w.userId === currentUser.id)} onRequestWithdrawal={requestWithdrawal} />; break;
      case 'notifications': content = <Card className="text-center py-12"><Icons.Bell className="w-12 h-12 mx-auto mb-4 text-slate-700" /><p className="text-slate-500">No new alerts.</p></Card>; break;
      case 'profile': content = <Card><h2 className="text-xl font-bold mb-4">Profile Settings</h2><Input value={currentUser.email} disabled /><div className="mt-4"><Badge status={currentUser.status} /></div></Card>; break;
      default: content = <UserDashboard user={currentUser} tasks={db.tasks} proofs={db.proofs} />;
    }
    return <UserLayout user={currentUser} onLogout={handleLogout} currentPage={page} onNavigate={setPage}>{content}</UserLayout>;
  }

  // Role: Admin Views
  if (currentUser?.role === UserRole.ADMIN) {
    let content;
    switch (page) {
      case 'admin-dashboard': content = <AdminDashboard db={db} />; break;
      case 'admin-tasks': content = <TaskManager db={db} onCreate={createTask} onToggleStatus={updateTaskStatus} onDelete={softDeleteTask} />; break;
      case 'admin-proofs': content = <ProofApprovals proofs={db.proofs.filter((p: any) => p.status === ProofStatus.PENDING)} onReview={reviewProof} />; break;
      case 'admin-users': content = (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {db.users.map((u: User) => (
                <tr key={u.id} className="text-sm">
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 text-blue-500 font-bold">${u.balance.toFixed(2)}</td>
                  <td className="px-6 py-4"><Badge status={u.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" className="text-xs" onClick={() => updateUserStatus(u.id, u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE')}>
                       {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ); break;
      case 'admin-withdrawals': content = (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Network</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {db.withdrawals.map((w: Withdrawal) => (
                <tr key={w.id} className="text-sm">
                  <td className="px-6 py-4 font-bold">{w.userName || 'Anonymous'}</td>
                  <td className="px-6 py-4 text-blue-500 font-black">${w.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-500">{w.network}</td>
                  <td className="px-6 py-4"><Badge status={w.status} /></td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {w.status === WithdrawalStatus.PENDING && (
                      <>
                        <Button className="text-[10px] px-3 py-1" onClick={() => reviewWithdrawal(w.id, WithdrawalStatus.APPROVED)}>Pay</Button>
                        <Button variant="danger" className="text-[10px] px-3 py-1" onClick={() => reviewWithdrawal(w.id, WithdrawalStatus.REJECTED)}>Reject</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ); break;
      case 'admin-settings': content = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card>
             <h3 className="font-bold mb-6">General Configuration</h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Platform Currency</label>
                  <Input value={db.settings.currency} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <div>
                    <p className="font-bold">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">Disable all user interactions</p>
                  </div>
                  <button className="w-12 h-6 bg-slate-700 rounded-full relative flex items-center transition-all">
                    <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-1"></div>
                  </button>
                </div>
                <Button className="w-full">Save Changes</Button>
             </div>
           </Card>
           <Card>
             <h3 className="font-bold mb-6">System Health</h3>
             <div className="space-y-4">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Database</span><span className="text-green-500 font-bold">Online</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Gemini AI API</span><span className="text-green-500 font-bold">Connected</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Storage Unit</span><span className="text-green-500 font-bold">Ready</span></div>
                <Button variant="ghost" className="w-full text-red-500">Clear Activity Logs</Button>
             </div>
           </Card>
        </div>
      ); break;
      default: content = <AdminDashboard db={db} />;
    }
    return <AdminLayout user={currentUser} onLogout={handleLogout} currentPage={page} onNavigate={setPage}>{content}</AdminLayout>;
  }

  return null;
};

export default App;
