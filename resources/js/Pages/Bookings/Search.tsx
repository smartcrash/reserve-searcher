import { Search2Icon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Input,
    Stat,
    StatGroup,
    StatLabel,
    StatNumber,
} from "@chakra-ui/react";
import { Inertia } from "@inertiajs/inertia";
import { addDays } from "date-fns";
import { filter } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MAX_BOOKING_DATE } from "../../constants";
import { diffInDays } from "../../Helper/diffInDays";
import { parseDate } from "../../Helper/parseDate";
import { toCalendar } from "../../Helper/toCalendar";
import { Layout } from "../../Shared/Layout";
import { RoomsDataTable } from "../../Shared/RoomsDataTable";
import { Room } from "../../types";

interface FormData {
    checkIn: string;
    checkOut: string;
    persons: number;
}

interface Props {
    rooms?: Room[];
}

const getDefaultValues = (): Partial<FormData> => {
    const urlParams = new URLSearchParams(window.location.search);

    const checkIn = toCalendar(
        parseDate(urlParams.get("check-in")) || new Date()
    );

    const checkOut = parseDate(urlParams.get("check-out"))
        ? toCalendar(parseDate(urlParams.get("check-out"))!)
        : undefined;

    const defaultValues = {
        checkIn,
        checkOut,
        persons: Number.parseInt(urlParams.get("persons") || "1"),
    };

    return defaultValues;
};

const Search = ({ rooms }: Props) => {
    const {
        handleSubmit,
        register,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ defaultValues: getDefaultValues() });

    const [checkIn, checkOut, persons] = watch([
        "checkIn",
        "checkOut",
        "persons",
    ]);

    const nights = useRef(diffInDays(checkIn, checkOut) || 1).current;

    const onSubmit = handleSubmit(({ checkIn, checkOut, persons }) => {
        if (!parseDate(checkIn)) {
            return setError("checkIn", {
                type: "required",
                message: "Invalid Date",
            });
        }

        if (!parseDate(checkOut)) {
            return setError("checkOut", {
                type: "required",
                message: "Invalid Date",
            });
        }

        Inertia.visit(window.location.href.split("?")[0], {
            replace: true,
            only: ["rooms"],
            data: {
                "check-in": checkIn,
                "check-out": checkOut,
                persons,
            },
        });
    });

    const onClick = useCallback(
        (room: Room) => {
            if (parseDate(checkIn) && parseDate(checkOut)) {
                Inertia.visit("/new", {
                    data: {
                        "check-in": toCalendar(parseDate(checkIn)!),
                        "check-out": toCalendar(parseDate(checkOut)!),
                        roomId: room.id,
                        persons,
                    },
                });
            }
        },
        [checkIn, checkOut, persons]
    );

    return (
        <Layout>
            <Box
                as={"form"}
                onSubmit={onSubmit}
                border={{ base: 0, md: "1px" }}
                borderBottom={"1px"}
                borderRadius={{ base: 0, md: "xl" }}
                borderColor={{ base: "gray.300", md: "gray.300" }}
                px={{ base: 2, md: 8 }}
                py={8}
                mb={10}
            >
                <Grid
                    mb={6}
                    templateColumns={{
                        sm: "1fr",
                        md: "repeat(2, 1fr)",
                    }}
                    gap={6}
                >
                    <GridItem>
                        <FormControl isInvalid={!!errors.checkIn}>
                            <FormLabel htmlFor="check-in">Check-in</FormLabel>
                            <Input
                                id="check-in"
                                type="date"
                                size={"lg"}
                                min={toCalendar(new Date())}
                                max={toCalendar(MAX_BOOKING_DATE)}
                                {...register("checkIn", {
                                    required: true,
                                    valueAsDate: true,
                                })}
                            />
                        </FormControl>
                    </GridItem>

                    <GridItem>
                        <FormControl isInvalid={!!errors.checkOut}>
                            <FormLabel htmlFor="check-out">Check-out</FormLabel>
                            <Input
                                id="check-out"
                                type="date"
                                size={"lg"}
                                min={
                                    parseDate(checkIn)
                                        ? toCalendar(
                                              addDays(parseDate(checkIn)!, 1)
                                          )
                                        : toCalendar(new Date())
                                }
                                max={toCalendar(MAX_BOOKING_DATE)}
                                {...register("checkOut", {
                                    required: true,
                                    valueAsDate: true,
                                })}
                            />
                        </FormControl>
                    </GridItem>
                </Grid>

                <Box>
                    <FormControl isInvalid={!!errors.persons} maxWidth={"40"}>
                        <FormLabel htmlFor="persons">Persons</FormLabel>
                        <Input
                            id={"persons"}
                            type={"number"}
                            step={1}
                            min={1}
                            size={"lg"}
                            {...register("persons", {
                                required: true,
                                valueAsNumber: true,
                            })}
                        />
                    </FormControl>
                </Box>

                <Flex justifyContent={"flex-end"}>
                    <Button
                        type="submit"
                        w={"full"}
                        colorScheme={"purple"}
                        leftIcon={<Search2Icon />}
                        isLoading={isSubmitting}
                        size={"lg"}
                        mt={6}
                    >
                        Search
                    </Button>
                </Flex>
            </Box>

            {rooms &&
                (rooms.length ? (
                    <>
                        <StatGroup mb={10}>
                            <Stat>
                                <StatLabel>Available rooms</StatLabel>
                                <StatNumber fontSize={"4xl"}>
                                    {rooms.length}
                                </StatNumber>
                            </Stat>

                            <Stat display={{ base: "none", md: "block" }}>
                                <StatLabel>Single</StatLabel>
                                <StatNumber fontSize={"4xl"}>
                                    {filter(rooms, { capacity: 1 }).length}
                                </StatNumber>
                            </Stat>

                            <Stat display={{ base: "none", md: "block" }}>
                                <StatLabel>Double</StatLabel>
                                <StatNumber fontSize={"4xl"}>
                                    {filter(rooms, { capacity: 2 }).length}
                                </StatNumber>
                            </Stat>

                            <Stat display={{ base: "none", md: "block" }}>
                                <StatLabel>Triple</StatLabel>
                                <StatNumber fontSize={"4xl"}>
                                    {filter(rooms, { capacity: 3 }).length}
                                </StatNumber>
                            </Stat>

                            <Stat display={{ base: "none", md: "block" }}>
                                <StatLabel>Quadruple</StatLabel>
                                <StatNumber fontSize={"4xl"}>
                                    {filter(rooms, { capacity: 4 }).length}
                                </StatNumber>
                            </Stat>
                        </StatGroup>

                        <RoomsDataTable
                            rooms={rooms}
                            nights={nights}
                            onClick={onClick}
                        />
                    </>
                ) : (
                    <Heading textAlign={"center"} color={"gray.500"} my={"20"}>
                        No rooms available :(
                    </Heading>
                ))}
        </Layout>
    );
};

export default Search;
