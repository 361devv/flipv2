import { getDeals } from "@/lib/deals";
import { getItemName } from "@/utils/items";
import { createClient } from "@/utils/supabase/server";
import { parseDealSearchParams } from "@/utils/utils";
import { getWorldName } from "@/utils/worlds";
import type { Metadata } from "next";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Deal } from "./data/schema";

export const metadata: Metadata = {
  title: "Deals",
  description:
    "Live view of profitable Black Market flips based on your latest data.",
  alternates: { canonical: "/authenticated/deals" },
};

export default async function Deals({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const supabase = await createClient();

  const params = await searchParams;
  const {
    tier,
    minProfit,
    qualityUpgrade,
    enchantmentUpgrade,
    premium,
    minPercentualProfit,
    profitGate,
  } = parseDealSearchParams(params);

  let buyOrderQuery = supabase
    .from("orders")
    .select(
      "id, item_type_id, location_id, item_group_type_id, enchantment_level, quality_level, unit_price_silver, amount, created_at"
    )
    .eq("action_type", "request");
  if (tier) {
    buyOrderQuery = buyOrderQuery.eq("tier", tier);
  }
  const buyOrdersResult = await buyOrderQuery;
  if (buyOrdersResult.error) {
    console.error("Error fetching buy orders:", buyOrdersResult.error);
    return <div>Error fetching buy orders</div>;
  }

  let sellOrderQuery = supabase
    .from("orders")
    .select(
      "id, item_type_id, location_id, item_group_type_id, tier, enchantment_level, quality_level, unit_price_silver, amount, created_at"
    )
    .eq("action_type", "offer");
  if (tier) {
    sellOrderQuery = sellOrderQuery.eq("tier", tier);
  }
  const sellOrdersResult = await sellOrderQuery;
  if (sellOrdersResult.error) {
    console.error("Error fetching sell orders:", sellOrdersResult.error);
    return <div>Error fetching sell orders</div>;
  }

  const buyOrders = buyOrdersResult.data || [];
  const sellOrders = sellOrdersResult.data || [];

  const { deals, potentialDealsCount } = getDeals({
    sellOrders: sellOrders.map((order) => ({
      ...order,
      created_at: new Date(order.created_at),
    })),
    buyOrders: buyOrders.map((order) => ({
      ...order,
      created_at: new Date(order.created_at),
    })),
    premium,
    minProfit,
    minPercentualProfit,
    profitGate,
    qualityUpgrade,
    enchantmentUpgrade,
  });

  const tableData: Deal[] = deals.map((deal) => ({
    amount: deal.amount,
    name: getItemName(deal.orders.buyOrder.item_group_type_id),
    tier: deal.orders.sellOrder.tier.toString(),
    profit: deal.orders.profit,
    percentualProfit: deal.orders.percentualProfit,
    qualityUpgradeRequired: deal.orders.qualityUpgrade,
    qualityUpgradeCost: deal.orders.qualityUpgradeCost,
    enchantmentUpgradeRequired: deal.orders.enchantmentUpgrade,
    enchantmentUpgradeCost: deal.orders.enchantmentUpgradeCost,
    enchantmentUpgradeShoppingList: deal.orders.enchantmentUpgradeShoppingList,
    buyOrder: {
      id: deal.orders.buyOrder.id,
      location: getWorldName(deal.orders.buyOrder.location_id),
      itemTypeId: deal.orders.buyOrder.item_type_id,
      enchantmentLevel: deal.orders.buyOrder.enchantment_level,
      qualityLevel: deal.orders.buyOrder.quality_level,
      price: deal.orders.buyOrder.unit_price_silver,
      createdAt: deal.orders.buyOrder.created_at,
    },
    sellOrder: {
      id: deal.orders.sellOrder.id,
      location: getWorldName(deal.orders.sellOrder.location_id),
      itemTypeId: deal.orders.sellOrder.item_type_id,
      enchantmentLevel: deal.orders.sellOrder.enchantment_level,
      qualityLevel: deal.orders.sellOrder.quality_level,
      price: deal.orders.sellOrder.unit_price_silver,
      createdAt: deal.orders.sellOrder.created_at,
    },
  }));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deals</h1>
          <p className="text-muted-foreground">
            Found {potentialDealsCount} profitable flips from{" "}
            {sellOrders.length} sell orders and {buyOrders.length} buy
            orders.
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
