import { SmallAddIcon } from "@chakra-ui/icons";
import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
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
            <Flex justifyContent={"center"} mb={12}>
                <Button
                    as={Link}
                    leftIcon={<SmallAddIcon fontSize={"3xl"} />}
                    href="/search"
                    colorScheme={"purple"}
                    size={"lg"}
                    mx={"auto"}
                >
                    New Booking
                </Button>
            </Flex>

            <Grid
                templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                }}
                gap={6}
            >
                {bookings.map((item) => {
                    return (
                        <GridItem key={item.id}>
                            <BookingCard booking={item} />
                        </GridItem>
                    );
                })}
            </Grid>
        </Layout>
    );
};

export default Index;
