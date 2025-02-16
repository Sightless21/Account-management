export type CarType = "SEDAN" | "SUV" | "VAN"
export type TripStatus = "ONGOING" | "COMPLETED" | "CANCELLED"
export interface ReservationType {
  cars:         Car[];
  reservations: CarReservationType[];
}

export interface Car {
  id:     string;
  name:   string;
  plate:  string;
  type:   CarType;
}

export interface CarReservationType {
  id:           string | null | undefined;
  userId:       string;
  employeeName: string;
  date: {
    from: Date;
    to:   Date;
  }
  destination:  string;
  startTime:    string;
  endTime:      string;
  tripStatus:   TripStatus;
  carId:        string;
  car:          Car;
}
