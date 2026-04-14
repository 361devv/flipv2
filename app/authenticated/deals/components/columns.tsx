import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Deal } from "../data/schema";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Deal>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const tier = row.original.tier;
      const enchantmentLevel = row.original.sellOrder.enchantmentLevel;
      
      const copyText = `${name} T${tier}.${enchantmentLevel}`;
      
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(copyText);
          }}
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tier" />
    ),
    cell: ({ row }) => <div>{row.getValue("tier")}</div>,
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profit" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.profit.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "percentualProfit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Margin (%)" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.percentualProfit.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <div>{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location =
        row.original.sellOrder.location || row.original.buyOrder.location;
      return <div>{location}</div>;
    },
  },
];
