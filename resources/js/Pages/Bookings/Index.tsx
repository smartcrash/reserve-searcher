import { Search2Icon, SmallAddIcon } from "@chakra-ui/icons";
import {
    Button,
    Flex,
    FormControl,
    Grid,
    GridItem,
    Input,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";
import { Link } from "@inertiajs/inertia-react";
import React, { useRef, ChangeEventHandler } from "react";
import useFuzzy from "../../Hooks/useFuzzy";
import { BookingCard } from "../../Shared/BookingCard";
import { Layout } from "../../Shared/Layout";
import { Booking } from "../../types";

interface Props {
    bookings: Booking[];
}

const Index = ({ bookings }: Props) => {
    const inputValue = useRef("");
    const { result, search } = useFuzzy(bookings, [
        "identifier",
        "guest.fullName",
    ]);

    const data = inputValue.current ? result : bookings;

    const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.value.trim();
        inputValue.current = value;
        search(value);
    };

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

            <FormControl mb={10} maxW={"50%"} marginX={"auto"}>
                <InputGroup size={"lg"}>
                    <InputLeftElement
                        pointerEvents={"none"}
                        children={<Search2Icon />}
                        color={"gray.500"}
                    />
                    <Input
                        type="search"
                        onChange={onInputChange}
                        placeholder={"Search by indentifier or guest name"}
                        borderRadius={"full"}
                        borderColor={"gray.300"}
                        _placeholder={{ color: "gray.500" }}
                    />
                </InputGroup>
            </FormControl>

            <Grid
                templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                }}
                gap={6}
            >
                {data.map((item) => {
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
