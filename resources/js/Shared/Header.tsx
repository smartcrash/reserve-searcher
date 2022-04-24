import { Box, Container, Heading, HStack } from "@chakra-ui/react";
import { Link } from "@inertiajs/inertia-react";
import React from "react";
import { GoBack } from "./GoBack";

export const Header = () => {
    return (
        <Box py={"5"} mb={"5"}>
            <Container maxW={"container.xl"}>
                <HStack justifyContent={"space-between"}>
                    <Box>
                        <GoBack />
                    </Box>
                    <Heading
                        textAlign={"center"}
                        fontSize={"6xl"}
                        color={"purple.500"}
                        fontFamily={"Times New Roman"}
                        as={Link}
                        href={"/"}
                    >
                        Bookings
                    </Heading>
                    <Box></Box>
                </HStack>
            </Container>
        </Box>
    );
};
