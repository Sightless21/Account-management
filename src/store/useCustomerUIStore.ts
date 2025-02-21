// store/useCustomerUIStore.ts
import { create } from 'zustand';
import { Customer } from '@/schema/formCustomer';

interface CustomerModalState {
  isOpen: boolean;
  customer: Customer | null;
  mode: 'create' | 'edit';
  openModal: (customer?: Customer, mode?: 'create' | 'edit') => void;
  closeModal: () => void;
}

export const useCustomerModalStore = create<CustomerModalState>((set) => ({
  isOpen: false,
  customer: null,
  mode: 'create',
  openModal: (customer?: Customer, mode: 'create' | 'edit' = 'create') => 
    set({ 
      isOpen: true, 
      customer: customer || null, 
      mode 
    }),
  closeModal: () => set({ isOpen: false, customer: null, mode: 'create' }),
}));