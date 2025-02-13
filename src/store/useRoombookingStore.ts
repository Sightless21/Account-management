//FIXME : Don't need it any more
import { create } from "zustand";
import axios from "axios";

//FIXME : change this to used the react query to fetch user from backend
interface RoombookingState {
  bookings: RoombookingType[];
  fetchRoombookings: () => Promise<void>;
  createRoombooking: (roombooking: RoombookingType) => Promise<void>;
  updateRoombooking: (roombooking: RoombookingType) => Promise<void>;
  deleteRoombooking: (id: string) => Promise<void>;
}

export interface RoombookingType {
  id: string
  username: string
  date: Date
  startTime: string
  endTime: string
  createAt: Date
  updateAt: Date
}

export const useRoombookingStore = create<RoombookingState>((set) => ({
  bookings: [],
  fetchRoombookings: async () => {
    try {
      const response = await axios.get("/api/roombooking");
      set({ bookings: response.data });
      console.log("fechRoombookings suscess: ",response.data);
    } catch (error) {
      console.error(error);
    }
  },
  createRoombooking: async (roombooking: RoombookingType) => {
    try {
      const response = await axios.post("/api/roombooking", roombooking);
      set((state) => ({ bookings: [...state.bookings, response.data] }));
    } catch (error) {
      console.error(error);
    }
  },
  updateRoombooking: async (roombooking: RoombookingType) => {
    try {
      const response = await axios.patch(`/api/roombooking/${roombooking.id}`, roombooking);
      set((state) => ({
        bookings: state.bookings.map((booking) => (booking.id === roombooking.id ? response.data : booking)),
      }));
    } catch (error) {
      console.error(error);
    }
  },
  deleteRoombooking: async (id: string) => {
    try {
      await axios.delete(`/api/roombooking/${id}`);
      set((state) => ({ bookings: state.bookings.filter((booking) => booking.id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },
}));