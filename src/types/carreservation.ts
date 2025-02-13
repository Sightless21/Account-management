export interface CarReservation {
  cars:         Car[];
  reservations: Reservation[];
}

export interface Car {
  name:  string;
  plate: string;
  type:  string;
}

export interface Reservation {
  userId:       string;
  employeeName: string;
  date:         Date;
  destination:  string;
  startTime:    string;
  endTime:      string;
  status:       string;
  car:          string;
  tripStatus:   string;
}
