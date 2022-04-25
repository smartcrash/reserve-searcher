import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Link,
    Text,
} from "@chakra-ui/react";
import { Inertia } from "@inertiajs/inertia";
import { differenceInDays } from "date-fns";
import { capitalize, padStart } from "lodash";
import React from "react";
import { formatDate } from "../Helper/formatDate";
import { getRoomType } from "../Helper/getRoomType";
import { toCurrency } from "../Helper/toCurrency";
import { Booking } from "../types";
import { CopyToClipboard } from "./CopyToClipboard";

interface Props {
    booking: Booking;
}

export const BookingCard = ({ booking }: Props) => {
    const {
        id,
        identifier,
        room,
        createdAt,
        checkIn,
        persons,
        checkOut,
        guest,
        totalPrice,
    } = booking;

    const attributes = {
        "Check-in": formatDate(checkIn),
        "Check-out": formatDate(checkOut),
        Nights: differenceInDays(new Date(checkOut), new Date(checkIn)),
        Price: toCurrency(totalPrice),
        Persons: persons,
        "Room Type": capitalize(getRoomType(room.capacity)),
    };

    const onDelete = () => {
        if (
            window.confirm("Are you sure do you want to delete this booking?")
        ) {
            Inertia.delete(`/${id}`);
        }
    };

    return (
        <Box
            bg={"white"}
            border={"1px"}
            borderColor={"gray.300"}
            rounded={"lg"}
            boxShadow={"sm"}
            data-testid={`booking-${id}`}
        >
            <Box px={4} py={5}>
                <CopyToClipboard value={identifier}>
                    <Heading
                        fontSize={"lg"}
                        as={"h3"}
                        lineHeight={6}
                        fontWeight={"bold"}
                        color={"gray.900"}
                    >
                        Booking: {identifier}
                    </Heading>
                </CopyToClipboard>

                <Text mt={1} fontSize={"sm"} color={"gray.500"}>
                    Room #{padStart(room.number, 2, "0")}
                </Text>

                <Text mt={1} fontSize={"sm"} color={"gray.500"}>
                    Was made: {formatDate(createdAt)}
                </Text>
            </Box>

            <Box borderTop={"1px"} borderColor={"gray.300"}>
                {Object.entries(attributes).map(([key, value]) => (
                    <dl key={`${key}-${value}`}>
                        <Grid
                            bg={"gray.50"}
                            px={4}
                            py={2}
                            gridColumn={2}
                            templateColumns={"repeat(3, 1fr)"}
                            gap={4}
                        >
                            <GridItem
                                as={"dt"}
                                fontSize={"sm"}
                                fontWeight={"medium"}
                                color={"gray.500"}
                            >
                                <Text>{key}</Text>
                            </GridItem>
                            <GridItem
                                as={"dd"}
                                mt={{
                                    base: 0,
                                    md: 1,
                                }}
                                fontSize={"sm"}
                                color={"gray.900"}
                                colSpan={{
                                    base: 3,
                                    md: 2,
                                }}
                            >
                                <Text>{value}</Text>
                            </GridItem>
                        </Grid>
                    </dl>
                ))}

                <Box
                    py={4}
                    mt={4}
                    px={4}
                    borderTop={"1px"}
                    borderColor={"gray.300"}
                >
                    <Heading fontSize={"md"} mb={3}>
                        Contact
                    </Heading>

                    <Text fontSize={"sm"} color={"gray.500"}>
                        Name
                    </Text>
                    <Text>{guest.fullName}</Text>

                    <Flex justifyContent={"space-between"} mt={2}>
                        <Box>
                            <Text fontSize={"sm"} color={"gray.500"}>
                                Phone
                            </Text>
                            <a href=""></a>
                            <Link
                                href={`tel:${guest.phoneNumber}`}
                                color={"gray.900"}
                                textDecor={"underline"}
                            >
                                {guest.phoneNumber}
                            </Link>
                        </Box>

                        <Box>
                            <Text fontSize={"sm"} color={"gray.500"}>
                                Email
                            </Text>
                            <Link
                                href={`mailto:${guest.email}`}
                                color={"gray.900"}
                                textDecor={"underline"}
                            >
                                {guest.email}
                            </Link>
                        </Box>
                    </Flex>
                </Box>

                <Box
                    py={2}
                    mt={4}
                    px={4}
                    borderTop={"1px"}
                    borderColor={"gray.300"}
                >
                    <HStack justifyContent={"flex-end"}>
                        <Button
                            onClick={onDelete}
                            variant={"ghost"}
                            colorScheme={"red"}
                            size={"sm"}
                        >
                            Delete
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </Box>
    );
};
