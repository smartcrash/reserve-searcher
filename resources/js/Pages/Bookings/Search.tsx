import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { Inertia } from "@inertiajs/inertia";
import { addDays, differenceInDays, isValid } from "date-fns";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { MAX_BOOKING_DATE } from "../../constants";
import { formatDate } from "../../Helper/formatDate";
import { Layout } from "../../Shared/Layout";
import { RoomsDataTable } from "../../Shared/RoomsDataTable";
import { Room } from "../../types";

interface FormData {
    checkIn: string;
    checkOut: string;
    persons: number;
}

interface Props {
    rooms: Room[];
}

const toCalendar = (date: Date) => formatDate(date, "y-MM-dd");

const parseDate = (value: string | null) => {
    if (!value) return undefined;

    const date = new Date(value);

    if (!isValid(date)) return undefined;

    return addDays(date, 1);
};

const Search = ({ rooms }: Props) => {
    const urlParams = new URLSearchParams(window.location.search);

    const defaultValues = {
        checkIn: toCalendar(parseDate(urlParams.get("check-in")) || new Date()),
        checkOut: parseDate(urlParams.get("check-out"))
            ? toCalendar(parseDate(urlParams.get("check-out"))!)
            : undefined,
        persons: parseInt(urlParams.get("persons") || "1"),
    };

    const {
        handleSubmit,
        register,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ defaultValues });

    const [checkIn, checkOut, persons] = watch([
        "checkIn",
        "checkOut",
        "persons",
    ]);

    const nights =
        parseDate(checkIn) && parseDate(checkOut)
            ? Math.abs(
                  differenceInDays(parseDate(checkIn)!, parseDate(checkOut)!)
              )
            : 1;

    const onSubmit = handleSubmit(({ checkIn, checkOut, persons }) => {
        if (!isValid(checkIn)) {
            return setError("checkIn", {
                type: "required",
                message: "Invalid Date",
            });
        }

        if (!isValid(checkOut)) {
            return setError("checkOut", {
                type: "required",
                message: "Invalid Date",
            });
        }

        Inertia.visit(window.location.href.split("?")[0], {
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
            <form onSubmit={onSubmit}>
                <HStack>
                    <Box flexGrow={1}>
                        <FormControl isInvalid={!!errors.checkIn}>
                            <FormLabel htmlFor="check-in">Check-in</FormLabel>
                            <Input
                                id="check-in"
                                type="date"
                                min={toCalendar(new Date())}
                                max={toCalendar(MAX_BOOKING_DATE)}
                                {...register("checkIn", {
                                    required: true,
                                    valueAsDate: true,
                                })}
                            />
                        </FormControl>
                    </Box>

                    <Box flexGrow={1}>
                        <FormControl isInvalid={!!errors.checkOut}>
                            <FormLabel htmlFor="check-out">Check-out</FormLabel>
                            <Input
                                id="check-out"
                                type="date"
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
                    </Box>
                </HStack>

                <Box>
                    <FormControl isInvalid={!!errors.persons}>
                        <FormLabel htmlFor="persons">Persons</FormLabel>
                        <NumberInput step={1} min={1} max={4}>
                            <NumberInputField
                                id={"persons"}
                                {...register("persons", {
                                    required: true,
                                    valueAsNumber: true,
                                })}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </Box>

                <Button
                    type="submit"
                    colorScheme={"purple"}
                    isLoading={isSubmitting}
                >
                    Search
                </Button>
            </form>

            <RoomsDataTable rooms={rooms} nights={nights} onClick={onClick} />
        </Layout>
    );
};

export default Search;
