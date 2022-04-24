import {
    Box,
    Button,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Input,
    HStack,
} from "@chakra-ui/react";
import { Inertia } from "@inertiajs/inertia";
import { addDays, differenceInDays } from "date-fns";
import { capitalize } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { formatDate } from "../../Helper/formatDate";
import { getRoomType } from "../../Helper/getRoomType";
import { toCurrency } from "../../Helper/toCurrency";
import { Layout } from "../../Shared/Layout";
import { Room } from "../../types";

type FormData = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

interface Props {
    checkIn: string;
    checkOut: string;
    persons: string;
    room: Room;
}

const Create = ({ room, ...props }: Props) => {
    const checkIn = addDays(new Date(props.checkIn), 1);
    const checkOut = addDays(new Date(props.checkOut), 1);
    const persons = parseInt(props.persons);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const onSubmit = handleSubmit(({ fullName, email, phoneNumber }) => {
        const roomId = room.id;

        const data = {
            checkIn,
            checkOut,
            persons,
            fullName,
            email,
            phoneNumber,
            roomId,
        };

        Inertia.post("/new", data);
    });

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn));

    const attributes = {
        "Check-in": formatDate(checkIn),
        "Check-out": formatDate(checkOut),
        Nights: nights,
        Price: toCurrency(room.dailyPrice * nights),
        Persons: persons,
        "Room Type": capitalize(getRoomType(room.capacity)),
    };

    return (
        <Layout>
            <Heading mb={12} color={"gray.500"}>
                New Booking
            </Heading>

            <Grid
                gap={{ base: 8, lg: 14 }}
                templateColumns={{ base: "1fr", lg: "1fr 500px" }}
            >
                <GridItem>
                    <Box as={"form"} onSubmit={onSubmit}>
                        <FormControl isInvalid={!!errors.fullName} mb={6}>
                            <FormLabel htmlFor="fullName">Full name</FormLabel>
                            <Input
                                id="fullName"
                                type="text"
                                min={4}
                                size={"lg"}
                                placeholder={"Jhon Doe"}
                                {...register("fullName", { required: true })}
                            />
                        </FormControl>

                        <Grid
                            templateColumns={{
                                base: "1fr",
                                md: "repeat(2, 1fr)",
                            }}
                            gap={6}
                        >
                            <GridItem>
                                <FormControl isInvalid={!!errors.email}>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        size={"lg"}
                                        placeholder={"jhondoe@gmail.com"}
                                        {...register("email", {
                                            required: true,
                                        })}
                                    />
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl isInvalid={!!errors.phoneNumber}>
                                    <FormLabel htmlFor="phoneNumber">
                                        Phone number
                                    </FormLabel>
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        size={"lg"}
                                        placeholder={"+58 1234567"}
                                        {...register("phoneNumber", {
                                            required: true,
                                        })}
                                    />
                                </FormControl>
                            </GridItem>
                        </Grid>

                        <Flex justifyContent={"flex-end"}>
                            <Button
                                type="submit"
                                colorScheme={"purple"}
                                isLoading={isSubmitting}
                                size={"lg"}
                                mt={6}
                            >
                                Create Booking
                            </Button>
                        </Flex>
                    </Box>
                </GridItem>

                <GridItem>
                    <Box
                        borderWidth={"1px"}
                        borderColor={"gray.300"}
                        p={6}
                        py={8}
                        borderRadius={"xl"}
                    >
                        <Heading
                            color={"gray.600"}
                            fontSize={"2xl"}
                            mb={4}
                            pb={4}
                            borderBottomWidth={"1px"}
                            borderColor={"gray.300"}
                        >
                            Details
                        </Heading>

                        {Object.entries(attributes).map(([key, value]) => (
                            <dl key={`${key}-${value}`}>
                                <Grid
                                    bg={"gray.50"}
                                    py={3}
                                    templateColumns={"repeat(2, 1fr)"}
                                >
                                    <GridItem
                                        as={"dt"}
                                        color={"gray.500"}
                                        fontSize={"lg"}
                                    >
                                        <Text>{key}</Text>
                                    </GridItem>
                                    <GridItem
                                        as={"dd"}
                                        color={"gray.600"}
                                        fontSize={"lg"}
                                    >
                                        <Text textAlign={"right"}>{value}</Text>
                                    </GridItem>
                                </Grid>
                            </dl>
                        ))}
                    </Box>
                </GridItem>
            </Grid>
        </Layout>
    );
};

export default Create;
