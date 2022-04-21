import React from "react";
import { render } from "react-dom";
import { createInertiaApp, Head } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";

InertiaProgress.init();

createInertiaApp({
    resolve: (name) => require(`./Pages/${name}`),
    setup({ el, App, props }) {
        render(
            <ChakraProvider theme={theme}>
                <App {...props} />
            </ChakraProvider>,
            el
        );
    },
});
