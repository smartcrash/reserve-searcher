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
import { addDays, isValid } from "date-fns";
import React from "react";
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

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            checkIn: toCalendar(
                parseDate(urlParams.get("check-in")) || new Date()
            ),
            checkOut: toCalendar(
                parseDate(urlParams.get("check-out")) || new Date()
            ),
            persons: parseInt(urlParams.get("persons") || "1"),
        },
    });

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
                                min={toCalendar(new Date())}
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

            <RoomsDataTable rooms={rooms} nights={1} />
        </Layout>
    );
};

export default Search;
