import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    GridItem,
    Textarea,
    Heading,
    Input,
    Text,
} from "@chakra-ui/react";
import { Inertia } from "@inertiajs/inertia";
import { differenceInDays, parse } from "date-fns";
import { capitalize, padStart } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { formatDate } from "../../Helper/formatDate";
import { getRoomType } from "../../Helper/getRoomType";
import { toCalendar } from "../../Helper/toCalendar";
import { toCurrency } from "../../Helper/toCurrency";
import { Layout } from "../../Shared/Layout";
import { Room } from "../../types";

type FormData = {
    fullName: string;
    email: string;
    phoneNumber: string;
    comment: string;
};

interface Props {
    checkIn: string;
    checkOut: string;
    persons: string;
    room: Room;
}

const Create = ({ room }: Props) => {
    const urlParams = new URLSearchParams(window.location.search);

    const checkIn = parse(urlParams.get("checkIn")!, "y-MM-dd", new Date());
    const checkOut = parse(urlParams.get("checkOut")!, "y-MM-dd", new Date());
    const persons = Number.parseInt(urlParams.get("persons")!);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const onSubmit = handleSubmit(
        ({ fullName, email, phoneNumber, comment }) => {
            const roomId = room.id;

            const data = {
                checkIn: toCalendar(checkIn),
                checkOut: toCalendar(checkOut),
                persons,
                fullName,
                email,
                phoneNumber,
                roomId,
                comment,
            };

            Inertia.post("/new", data, {});
        }
    );

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn));

    const attributes = {
        "Check-in": formatDate(checkIn),
        "Check-out": formatDate(checkOut),
        Nights: nights,
        Price: toCurrency(room.dailyPrice * nights),
        Persons: persons,
        "Room Number": `#${padStart(room.number, 2, "0")}`,
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
                            <FormErrorMessage>
                                {errors.fullName?.message}
                            </FormErrorMessage>
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
                                    <FormErrorMessage>
                                        {errors.email?.message}
                                    </FormErrorMessage>
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
                                    <FormErrorMessage>
                                        {errors.phoneNumber?.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </GridItem>
                        </Grid>

                        <FormControl isInvalid={!!errors.comment} mb={6}>
                            <FormLabel htmlFor="comment">Comment</FormLabel>
                            <Textarea
                                id="comment"
                                size={"lg"}
                                placeholder={"(Optional)"}
                                {...register("comment", {})}
                            />
                            <FormErrorMessage>
                                {errors.comment?.message}
                            </FormErrorMessage>
                        </FormControl>

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
