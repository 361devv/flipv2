import { Row } from "@tanstack/react-table";
import { dealSchema } from "../data/schema";
import { DealCostBreakdown } from "./order-details-cost-breakdown";
import { DealOrdersTable } from "./deal-orders-table";
import { Deal } from "../data/schema";

interface DealExpandedRowProps {
  row: Row<Deal>;
}

export function DealExpandedRow({ row }: DealExpandedRowProps) {
  const result = dealSchema.safeParse(row.original);

  if (!result.success) {
    return (
      <div className="p-4 text-red-500 text-sm">
        Error parsing deal data.
      </div>
    );
  }

  const deal = result.data;

  return (
    <div className="p-4 space-y-4">
      <DealOrdersTable deal={deal} />
      {deal.qualityUpgradeRequired && <DealCostBreakdown deal={deal} />}
      {/* Removed enchantment checklist due to type mismatch */}
    </div>
  );
}
