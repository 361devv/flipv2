import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Deal } from "../data/schema";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const name = row.original.name ?? "Unknown";
      const tier = row.original.tier ?? "0";
      const enchant = row.original.sellOrder?.enchantmentLevel ?? 0;
      const copyText = `${name} T${tier}.${enchant}`;

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigator.clipboard.writeText(copyText)}
          className="pl-0 font-medium"
        >
          {name}
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tier",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tier" />,
  },
  {
    accessorKey: "profit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Profit" />,
    cell: ({ row }) => row.original.profit.toLocaleString(),
  },
  {
    accessorKey: "percentualProfit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Margin (%)" />,
    cell: ({ row }) => `${row.original.percentualProfit}%`,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => row.original.sellOrder.location || row.original.buyOrder.location,
  },
];