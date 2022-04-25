import React, { useMemo } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    chakra,
    Box,
    HStack,
    Button,
    ButtonGroup,
    Text,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
    TableInstance,
    usePagination,
    UsePaginationInstanceProps,
    UsePaginationState,
    useSortBy,
    UseSortByInstanceProps,
    useTable,
} from "react-table";
import { Room } from "../types";
import { getRoomType } from "../Helper/getRoomType";
import { toCurrency } from "../Helper/toCurrency";
import { capitalize, padStart } from "lodash";

interface Props {
    rooms: Room[];
    nights: number;
    onClick?: (room: Room) => void;
}
export type UseTableWithPlugins<T extends object> = TableInstance<T> &
    UsePaginationInstanceProps<T> &
    UseSortByInstanceProps<T> & {
        state: UsePaginationState<T>;
    };

export const RoomsDataTable = ({
    rooms,
    nights,
    onClick = () => {},
}: Props) => {
    const data = useMemo(
        () =>
            rooms.map(({ id, number, capacity, dailyPrice }) => ({
                id,
                number: `#${padStart(number, 2, "0")}`,
                roomType: capitalize(getRoomType(capacity)),
                dailyPrice: `${toCurrency(dailyPrice)}/night`,
                totalPrice: toCurrency(dailyPrice * nights),
            })),
        [nights]
    );

    const columns = useMemo(
        () => [
            {
                Header: "Number",
                accessor: "number" as const,
            },
            {
                Header: "Room Type",
                accessor: "roomType" as const,
            },
            {
                Header: "Price",
                accessor: "dailyPrice" as const,
            },
            {
                Header: "Charge/stay",
                accessor: "totalPrice" as const,
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page,
        canNextPage,
        canPreviousPage,
        nextPage,
        previousPage,
        pageCount,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        usePagination
    ) as UseTableWithPlugins<typeof data[0]>;

    return (
        <>
            <Table {...getTableProps()} data-testid={"table"}>
                <Thead>
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any) => (
                                <Box
                                    bg={"gray.100"}
                                    borderBottom={"1px"}
                                    borderColor={"gray.200"}
                                    as={Th}
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    {column.render("Header")}
                                    <chakra.span pl="4">
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <TriangleDownIcon aria-label="sorted descending" />
                                            ) : (
                                                <TriangleUpIcon aria-label="sorted ascending" />
                                            )
                                        ) : null}
                                    </chakra.span>
                                </Box>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <Box
                                as={Tr}
                                cursor={"pointer"}
                                _hover={{ bg: "gray.200" }}
                                data-testid={`room-${row.original.id}`}
                                onClick={() => onClick(rooms[row.index])}
                                {...row.getRowProps()}
                            >
                                {row.cells.map((cell) => (
                                    <Td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </Td>
                                ))}
                            </Box>
                        );
                    })}
                </Tbody>
            </Table>

            <HStack
                justifyContent={{ base: "flex-end", md: "space-between" }}
                mt={3}
            >
                <Text
                    color={"gray.500"}
                    display={{ base: "none", md: "block" }}
                >
                    Showing {page.length} of {rows.length} results Page{" "}
                </Text>

                <HStack spacing={4}>
                    <Text color={"gray.500"}>
                        Page {pageIndex + 1} of {pageCount}
                    </Text>
                    <ButtonGroup spacing={3} variant={"outline"}>
                        <Button
                            onClick={previousPage}
                            disabled={!canPreviousPage}
                        >
                            Previous
                        </Button>
                        <Button onClick={nextPage} disabled={!canNextPage}>
                            Next
                        </Button>
                    </ButtonGroup>
                </HStack>
            </HStack>
        </>
    );
};
