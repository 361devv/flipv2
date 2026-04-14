import { Row } from "@tanstack/react-table";
import { Deal } from "../data/schema";
import { DealCostBreakdown } from "./order-details-cost-breakdown";
import { DealOrdersTable } from "./deal-orders-table";

interface DealExpandedRowProps {
  row: Row<Deal>;
}

export function DealExpandedRow({ row }: DealExpandedRowProps) {
  const deal = row.original;

  return (
    <div className="p-4 space-y-4">
      <DealOrdersTable deal={deal} />
      {deal.qualityUpgradeRequired && <DealCostBreakdown deal={deal} />}
    </div>
  );
}
