import { Box, Container } from "@chakra-ui/react";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: { children?: any }) => {
    return (
        <Box>
            <Header />
            <Container maxW={"container.xl"}>{children}</Container>;
            <Footer />
        </Box>
    );
};
