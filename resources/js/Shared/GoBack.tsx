import { ChevronLeftIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { usePage } from "@inertiajs/inertia-react";
import React from "react";

export const GoBack = () => {
    const { url } = usePage();
    const goBack = () => window.history.back();

    if (url === "/") return <></>;

    return (
        <IconButton
            onClick={goBack}
            aria-label="Go back"
            size={"lg"}
            icon={<ChevronLeftIcon fontSize={"4xl"} />}
        />
    );
};
