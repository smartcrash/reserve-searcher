import React, { useMemo } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";
import { Room } from "../types";
import { getRoomType } from "../Helper/getRoomType";
import { toCurrency } from "../Helper/toCurrency";
import { capitalize, padStart } from "lodash";

interface Props {
    rooms: Room[];
    nights: number;
    onClick?: (room: Room) => void;
}

export const RoomsDataTable = ({
    rooms,
    nights,
    onClick = () => {},
}: Props) => {
    const data = useMemo(
        () =>
            rooms.map(({ number, capacity, dailyPrice }) => ({
                number: padStart(number, 2, "0"),
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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable(
            {
                columns,
                data,
            },
            useSortBy
        );

    return (
        <Table {...getTableProps()}>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                            <Th
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
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <Tr
                            {...row.getRowProps()}
                            style={{ cursor: "pointer" }}
                            onClick={() => onClick(rooms[row.index])}
                        >
                            {row.cells.map((cell) => (
                                <Td {...cell.getCellProps()}>
                                    {cell.render("Cell")}
                                </Td>
                            ))}
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
};
