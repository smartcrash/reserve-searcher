import { ChevronLeftIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import React from "react";

export const GoBack = ({ href }: { href: string }) => {
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
