import { Button, List, ListItem } from "@chakra-ui/react";
import { Link } from "@inertiajs/inertia-react";
import React from "react";
import { BookingCard } from "../../Shared/BookingCard";
import { Layout } from "../../Shared/Layout";
import { Booking } from "../../types";

interface Props {
    bookings: Booking[];
}

const Index = ({ bookings }: Props) => {
    return (
        <Layout>
            <Button as={Link} href="/search" colorScheme={"purple"}>
                New Booking
            </Button>

            <List spacing={6}>
                {bookings.map((item) => {
                    return (
                        <ListItem key={item.id}>
                            <BookingCard booking={item} />
                        </ListItem>
                    );
                })}
            </List>
        </Layout>
    );
};

export default Index;
