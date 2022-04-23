import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Inertia } from "@inertiajs/inertia";
import { addDays } from "date-fns";
import React from "react";
import { useForm } from "react-hook-form";
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

    return (
        <Layout>
            <form onSubmit={onSubmit}>
                <FormControl isInvalid={!!errors.fullName}>
                    <FormLabel htmlFor="fullName">Full name</FormLabel>
                    <Input
                        id="fullName"
                        type="text"
                        min={4}
                        {...register("fullName", { required: true })}
                    />
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                        id="email"
                        type="email"
                        {...register("email", { required: true })}
                    />
                </FormControl>

                <FormControl isInvalid={!!errors.phoneNumber}>
                    <FormLabel htmlFor="phoneNumber">Phone number</FormLabel>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        {...register("phoneNumber", { required: true })}
                    />
                </FormControl>

                <Button
                    type="submit"
                    colorScheme={"purple"}
                    isLoading={isSubmitting}
                >
                    Create Booking
                </Button>
            </form>
        </Layout>
    );
};

export default Create;
