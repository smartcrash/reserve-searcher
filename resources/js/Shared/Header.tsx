import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Container, Heading, HStack, IconButton } from "@chakra-ui/react";
import { Link, usePage } from "@inertiajs/inertia-react";
import React from "react";

export const Header = () => {
    const { url } = usePage();
    const goBack = () => window.history.back();

    return (
        <Box py={"5"} mb={"5"}>
            <Container maxW={"container.xl"}>
                <HStack justifyContent={"space-between"}>
                    <Box>
                        {url !== "/" && (
                            <IconButton
                                onClick={goBack}
                                aria-label="Go back"
                                size={"lg"}
                                icon={<ChevronLeftIcon fontSize={"4xl"} />}
                            />
                        )}
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
