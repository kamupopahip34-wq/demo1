
import { useState, useEffect } from 'react';
import { 
  User, Task, TaskProof, Withdrawal, AppSettings, 
  UserRole, TaskStatus, ProofStatus, WithdrawalStatus, 
  CryptoNetwork, Notification, Log 
} from './types';
import { ADMIN_CREDENTIALS } from './constants';

const STORAGE_KEY = 'task_earn_db';

const INITIAL_DATA = {
  users: [
    {
      id: 'admin_1',
      email: ADMIN_CREDENTIALS.email,
      role: UserRole.ADMIN,
      balance: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_1',
      email: 'demo@user.com',
      role: UserRole.USER,
      balance: 15.50,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: 'task_1',
      title: 'Follow us on Twitter',
      description: 'Follow our official Twitter handle and send a screenshot.',
      reward: 0.50,
      quantity: 100,
      completedCount: 45,
      status: TaskStatus.PUBLISHED,
      instructions: '1. Visit twitter.com/taskearn\n2. Click Follow\n3. Take a screenshot of the Follow button',
      isDeleted: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task_2',
      title: 'Subscribe to YouTube',
      description: 'Subscribe to our channel and like the latest video.',
      reward: 1.20,
      quantity: 50,
      completedCount: 12,
      status: TaskStatus.PUBLISHED,
      instructions: '1. Visit youtube.com/taskearn\n2. Subscribe & Like\n3. Take a screenshot',
      isDeleted: false,
      createdAt: new Date().toISOString()
    }
  ],
  proofs: [],
  withdrawals: [],
  settings: {
    currency: 'USD',
    currencySymbol: '$',
    maintenanceMode: false
  },
  notifications: [],
  logs: []
};

export const useStore = () => {
  const [db, setDb] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      console.error("Failed to parse storage, resetting to initial data", e);
      return INITIAL_DATA;
    }
  });

  const save = (newDb: any) => {
    setDb(newDb);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDb));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  };

  // Auth
  const login = (email: string, pass: string): User | null => {
    if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
      return db.users.find((u: User) => u.email === email);
    }
    const user = db.users.find((u: User) => u.email === email);
    if (user && pass === 'password') { // Simplified for demo
       return user;
    }
    return null;
  };

  // Task Actions
  const createTask = (taskData: Partial<Task>) => {
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      completedCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      ...taskData
    } as Task;
    save({ ...db, tasks: [...db.tasks, newTask] });
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    save({
      ...db,
      tasks: db.tasks.map((t: Task) => t.id === id ? { ...t, status } : t)
    });
  };

  const softDeleteTask = (id: string) => {
    save({
      ...db,
      tasks: db.tasks.map((t: Task) => t.id === id ? { ...t, isDeleted: true } : t)
    });
  };

  // Proof Actions
  const submitProof = (proofData: any) => {
    const newProof = {
      id: Math.random().toString(36).substr(2, 9),
      status: ProofStatus.PENDING,
      createdAt: new Date().toISOString(),
      ...proofData
    };
    save({ ...db, proofs: [...db.proofs, newProof] });
  };

  const reviewProof = (id: string, status: ProofStatus, note: string) => {
    const proof = db.proofs.find((p: TaskProof) => p.id === id);
    if (!proof) return;

    let updatedUsers = db.users;
    if (status === ProofStatus.APPROVED) {
      updatedUsers = db.users.map((u: User) => 
        u.id === proof.userId ? { ...u, balance: u.balance + proof.reward } : u
      );
    }

    save({
      ...db,
      users: updatedUsers,
      proofs: db.proofs.map((p: TaskProof) => p.id === id ? { ...p, status, adminNote: note } : p)
    });
  };

  // Withdrawal Actions
  const requestWithdrawal = (withdrawData: any) => {
    const newWithdrawal = {
      id: Math.random().toString(36).substr(2, 9),
      status: WithdrawalStatus.PENDING,
      createdAt: new Date().toISOString(),
      ...withdrawData
    };
    
    // Deduct immediately
    const updatedUsers = db.users.map((u: User) => 
      u.id === withdrawData.userId ? { ...u, balance: u.balance - withdrawData.amount } : u
    );

    save({ 
      ...db, 
      users: updatedUsers,
      withdrawals: [...db.withdrawals, newWithdrawal] 
    });
  };

  const reviewWithdrawal = (id: string, status: WithdrawalStatus) => {
    const w = db.withdrawals.find((item: Withdrawal) => item.id === id);
    if (!w) return;

    let updatedUsers = db.users;
    if (status === WithdrawalStatus.REJECTED) {
      // Refund
      updatedUsers = db.users.map((u: User) => 
        u.id === w.userId ? { ...u, balance: u.balance + w.amount } : u
      );
    }

    save({
      ...db,
      users: updatedUsers,
      withdrawals: db.withdrawals.map((item: Withdrawal) => item.id === id ? { ...item, status } : item)
    });
  };

  return {
    db,
    login,
    createTask,
    updateTaskStatus,
    softDeleteTask,
    submitProof,
    reviewProof,
    requestWithdrawal,
    reviewWithdrawal,
    setSettings: (settings: AppSettings) => save({ ...db, settings }),
    updateUserStatus: (id: string, status: 'ACTIVE' | 'BLOCKED') => {
      save({
        ...db,
        users: db.users.map((u: User) => u.id === id ? { ...u, status } : u)
      });
    }
  };
};
