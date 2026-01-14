
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum TaskStatus {
  PUBLISHED = 'PUBLISHED',
  HOLD = 'HOLD'
}

export enum ProofStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum CryptoNetwork {
  BEP20 = 'BEP20',
  TRC20 = 'TRC20'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  quantity: number;
  completedCount: number;
  status: TaskStatus;
  instructions: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface TaskProof {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  taskTitle: string;
  screenshot: string;
  status: ProofStatus;
  adminNote?: string;
  createdAt: string;
  reward: number;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  network: CryptoNetwork;
  walletAddress: string;
  status: WithdrawalStatus;
  createdAt: string;
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  maintenanceMode: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Log {
  id: string;
  userId: string;
  action: string;
  details: string;
  createdAt: string;
}
