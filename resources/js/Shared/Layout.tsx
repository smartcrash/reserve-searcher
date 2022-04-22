import { Container } from "@chakra-ui/react";
import React from "react";

export const Layout = ({ children }: { children?: any }) => {
    return <Container maxW={"container.xl"}>{children}</Container>;
};
