import { CopyIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, useClipboard } from "@chakra-ui/react";
import React from "react";

interface Props {
    value: string;
    children: JSX.Element;
}

export const CopyToClipboard = ({ value, children }: Props) => {
    const { hasCopied, onCopy } = useClipboard(value);

    return (
        <HStack spacing={2} alignItems={"center"}>
            <Box>{children}</Box>
            {hasCopied ? (
                <Text fontSize={"xs"} color={"gray.500"}>
                    Copied
                </Text>
            ) : (
                <IconButton
                    size={"xs"}
                    aria-label="Copy"
                    icon={<CopyIcon />}
                    onClick={onCopy}
                />
            )}
        </HStack>
    );
};
