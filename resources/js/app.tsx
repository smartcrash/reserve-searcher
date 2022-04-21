import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";

InertiaProgress.init();

createInertiaApp({
    resolve: (name) => require(`./Pages/${name}`),
    setup({ el, App, props }) {
        createRoot(el).render(
            <ChakraProvider theme={theme}>
                <App {...props} />
            </ChakraProvider>
        );
    },
});
