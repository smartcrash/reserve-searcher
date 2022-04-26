export interface Guest {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface Room {
    id: number;
    number: string;
    capacity: number;
    dailyPrice: number;
}

export interface Booking {
    id: number;
    identifier: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    persons: number;
    comment: string;
    roomId: number;
    room: Room;
    guestId: number;
    guest: Guest;
    createdAt: string;
}
