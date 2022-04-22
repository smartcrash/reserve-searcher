import { Container, List, ListItem } from "@chakra-ui/react";
import React from "react";
import { BookingCard } from "../../Shared/BookingCard";
import { Booking } from "../../types";

interface Props {
    bookings: Booking[];
}

const Index = ({ bookings }: Props) => {
    return (
        <Container>
            <List spacing={6}>
                {bookings.map((item) => {
                    return (
                        <ListItem key={item.id}>
                            <BookingCard booking={item} />
                        </ListItem>
                    );
                })}
            </List>
        </Container>
    );
};

export default Index;
