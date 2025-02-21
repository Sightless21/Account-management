// store/reservationModalStore.ts
import { create } from 'zustand'
import { CarReservationType } from '@/types/car-reservation'

type ModalMode = 'create' | 'edit' | 'view'

interface ReservationModalState {
  isOpen: boolean
  mode: ModalMode
  selectedReservation: CarReservationType | null
  openModal: (mode: ModalMode, reservation?: CarReservationType) => void
  closeModal: () => void
}

export const useCarReservationUI = create<ReservationModalState>((set) => ({
  isOpen: false,
  mode: 'view',
  selectedReservation: null,
  openModal: (mode, reservation) => set({ 
    isOpen: true, 
    mode, 
    selectedReservation: reservation || null 
  }),
  closeModal: () => set({ 
    isOpen: false, 
    mode: 'view', 
    selectedReservation: null 
  }),
}))