import { Box, Container, VStack } from "@chakra-ui/react";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: { children?: any }) => {
    return (
        <VStack
            minH={"100vh"}
            justifyContent={"stretch"}
            alignItems={"stretch"}
        >
            <Header />
            <Box flexGrow={1}>
                <Container maxW={"container.xl"}>{children}</Container>
            </Box>
            <Footer />
        </VStack>
    );
};
