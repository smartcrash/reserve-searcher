import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";

export const Footer = () => {
    return (
        <Box py={"5"} mt={"2"} bg={"gray.200"}>
            <Container maxW={"container.xl"}>
                <Text textAlign={"right"} color={"gray.500"}>
                    Made with ❤️ by{" "}
                    <a href="https://github.com/smartcrash" target={"_blank"}>
                        Diego
                    </a>
                </Text>
            </Container>
        </Box>
    );
};
