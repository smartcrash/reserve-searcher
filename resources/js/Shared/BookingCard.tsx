import {
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    GridItem,
    Heading,
    Link,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { differenceInDays } from "date-fns";
import { capitalize, padStart } from "lodash";
import React from "react";
import { formatDate } from "../Helper/formatDate";
import { toCurrency } from "../Helper/toCurrency";
import { Booking } from "../types";
import { CopyToClipboard } from "./CopyToClipboard";

interface Props {
    booking: Booking;
}

const ROOM_TYPES: Record<number, string> = {
    1: "single",
    2: "double",
    3: "triple",
    4: "quadruple",
};

export const BookingCard = ({ booking }: Props) => {
    const { isOpen, onToggle } = useDisclosure();

    const {
        identifier,
        room,
        createdAt,
        startDate,
        guestCount,
        endDate,
        guest,
        totalPrice,
    } = booking;

    const attributes = {
        "Check-in": formatDate(startDate),
        "Check-out": formatDate(endDate),
        Nights: differenceInDays(new Date(endDate), new Date(startDate)),
        Price: toCurrency(totalPrice),
        Persons: guestCount,
        "Room Type": capitalize(ROOM_TYPES[room.capacity]),
    };

    return (
        <Box
            bg={"white"}
            border={"1px"}
            borderColor={"gray.200"}
            rounded={"lg"}
        >
            <Box px={{ sm: 6, md: 4 }} py={5}>
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

            <Box borderTop={"1px"} borderColor={"gray.200"}>
                {Object.entries(attributes).map(([key, value]) => (
                    <dl>
                        <Grid
                            bg={"gray.50"}
                            px={{ sm: 6, md: 4 }}
                            py={2}
                            gridColumn={2}
                            templateColumns={"repeat(3, 1fr)"}
                            gap={{ sm: 4 }}
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
                                    sm: 0,
                                    md: 1,
                                }}
                                fontSize={"sm"}
                                color={"gray.900"}
                                colSpan={{
                                    sm: 3,
                                    md: 2,
                                }}
                            >
                                <Text>{value}</Text>
                            </GridItem>
                        </Grid>
                    </dl>
                ))}

                <Box
                    py={3}
                    px={{ sm: 6, md: 4 }}
                    borderTop={"1px"}
                    borderColor={"gray.200"}
                >
                    <Button
                        onClick={onToggle}
                        variant={"outline"}
                        size={"sm"}
                        colorScheme={"blue"}
                    >
                        See {isOpen ? "less" : "more"}
                    </Button>

                    <Collapse in={isOpen}>
                        <Box pt={5}>
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
                    </Collapse>
                </Box>
            </Box>
        </Box>
    );
};