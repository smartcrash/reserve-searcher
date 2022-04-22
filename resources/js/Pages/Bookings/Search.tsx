import React from "react";
import {
    Box,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Input,
    HStack,
    Button,
} from "@chakra-ui/react";
import { Layout } from "../../Shared/Layout";
import { useForm } from "react-hook-form";
import { formatDate } from "../../Helper/formatDate";
import { MAX_BOOKING_DATE } from "../../constants";
import { isValid } from "date-fns";

interface FormData {
    checkIn: string;
    checkOut: string;
    persons: number;
}

const Search = () => {
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            checkIn: formatDate(new Date(), "y-MM-dd"),
            persons: 1,
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

        console.log({ checkIn, checkOut, persons });
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
                                min={formatDate(new Date(), "y-MM-dd")}
                                max={formatDate(MAX_BOOKING_DATE, "y-MM-dd")}
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
                                min={formatDate(new Date(), "y-MM-dd")}
                                max={formatDate(MAX_BOOKING_DATE, "y-MM-dd")}
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
                    Buscar
                </Button>
            </form>
        </Layout>
    );
};

export default Search;
