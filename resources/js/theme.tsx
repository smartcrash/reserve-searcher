import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        FormLabel: {
            baseStyle: {
                fontWeight: "bold",
                mb: 1,
            },
        },
    },
});

export { theme };
