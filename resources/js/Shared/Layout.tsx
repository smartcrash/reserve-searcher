import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Container,
    VStack,
} from "@chakra-ui/react";
import { usePage } from "@inertiajs/inertia-react";
import { isEmpty, isString } from "lodash";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: { children?: any }) => {
    const {
        props: { error, message },
    } = usePage();

    return (
        <VStack
            minH={"100vh"}
            justifyContent={"stretch"}
            alignItems={"stretch"}
        >
            <Header />

            <Box flexGrow={1} pb={10}>
                <Container maxW={"container.xl"}>
                    {isString(error) && !isEmpty(error) && (
                        <Alert status="error" mb={6}>
                            <AlertIcon />
                            <AlertTitle mr={2}>Error:</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isString(message) && !isEmpty(message) && (
                        <Alert status="info" mb={6}>
                            <AlertIcon />
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    {children}
                </Container>
            </Box>
            <Footer />
        </VStack>
    );
};
