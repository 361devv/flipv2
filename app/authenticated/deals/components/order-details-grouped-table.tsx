import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEnchantmentName, getQualityName } from "@/lib/items";
import { formatNumber, formatTimeDelta } from "@/lib/locale";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Deal } from "../data/schema";

interface DealOrderGroupedTableProps {
  deal: Deal;
  allOrders?: {
    sellOrders: Deal[];
    buyOrders: Deal[];
  };
}

export const DealOrderGroupedTable = ({ deal, allOrders }: DealOrderGroupedTableProps) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Handler for mouse move to update preview position
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Render the preview image near the mouse
  const renderPreview = () => {
    if (!previewImg) return null;
    return (
      <div
        className="fixed pointer-events-none z-50 bg-background border rounded-lg p-2 shadow-lg"
        style={{
          left: mousePos.x + 10,
          top: mousePos.y + 10,
        }}
      >
        <img src={previewImg} alt="Item preview" className="w-16 h-16" />
      </div>
    );
  };

  // Group orders by price
  const groupOrdersByPrice = (orders: Deal[]) => {
    const grouped = new Map<number, Deal[]>();
    
    orders.forEach((order) => {
      const price = order.sellOrder.price;
      if (!grouped.has(price)) {
        grouped.set(price, []);
      }
      grouped.get(price)!.push(order);
    });
    
    return grouped;
  };

  const sellOrdersGrouped = allOrders ? groupOrdersByPrice(allOrders.sellOrders) : new Map([[deal.sellOrder.price, [deal]]]);
  const buyOrdersGrouped = allOrders ? groupOrdersByPrice(allOrders.buyOrders) : new Map([[deal.buyOrder.price, [deal]]]);

  return (
    <>
      {renderPreview()}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Type</TableHead>
            <TableHead>Enchantment</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>
              Age
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-2 h-4 w-4 inline" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows how long ago the order was added to the database.</p>
                </TooltipContent>
              </Tooltip>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(sellOrdersGrouped.entries()).map(([price, orders], groupIndex) => (
            <React.Fragment key={`sell-${price}-${groupIndex}`}>
              {orders.map((order, index) => (
                <TableRow
                  key={`sell-${price}-${index}`}
                  className={index > 0 ? "border-t-0" : ""}
                  onMouseEnter={() =>
                    setPreviewImg(
                      `https://render.albiononline.com/v1/item/${order.sellOrder.itemTypeId}.png`
                    )
                  }
                  onMouseLeave={() => setPreviewImg(null)}
                  onMouseMove={handleMouseMove}
                >
                  {index === 0 && (
                    <>
                      <TableCell rowSpan={orders.length} className="font-medium">
                        Sell Order
                      </TableCell>
                      <TableCell colSpan={5} className="text-sm text-muted-foreground">
                        Price: {formatNumber(price)} - Total Amount: {orders.reduce((sum, o) => sum + o.amount, 0)}
                      </TableCell>
                    </>
                  )}
                  {index > 0 && (
                    <>
                      <TableCell>{getEnchantmentName(order.sellOrder.enchantmentLevel)} ({order.sellOrder.enchantmentLevel})</TableCell>
                      <TableCell>{getQualityName(order.sellOrder.qualityLevel)} ({order.sellOrder.qualityLevel})</TableCell>
                      <TableCell>{formatNumber(order.sellOrder.price)}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{formatTimeDelta(Date.now() - order.sellOrder.createdAt.getTime())}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
          {Array.from(buyOrdersGrouped.entries()).map(([price, orders], groupIndex) => (
            <React.Fragment key={`buy-${price}-${groupIndex}`}>
              {orders.map((order, index) => (
                <TableRow
                  key={`buy-${price}-${index}`}
                  className={index > 0 ? "border-t-0" : ""}
                  onMouseEnter={() =>
                    setPreviewImg(
                      `https://render.albiononline.com/v1/item/${order.buyOrder.itemTypeId}.png`
                    )
                  }
                  onMouseLeave={() => setPreviewImg(null)}
                  onMouseMove={handleMouseMove}
                >
                  {index === 0 && (
                    <>
                      <TableCell rowSpan={orders.length} className="font-medium">
                        Buy Order
                      </TableCell>
                      <TableCell colSpan={5} className="text-sm text-muted-foreground">
                        Price: {formatNumber(price)} - Total Amount: {orders.reduce((sum, o) => sum + o.amount, 0)}
                      </TableCell>
                    </>
                  )}
                  {index > 0 && (
                    <>
                      <TableCell>{getEnchantmentName(order.buyOrder.enchantmentLevel)} ({order.buyOrder.enchantmentLevel})</TableCell>
                      <TableCell>{getQualityName(order.buyOrder.qualityLevel)} ({order.buyOrder.qualityLevel})</TableCell>
                      <TableCell>{formatNumber(order.buyOrder.price)}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{formatTimeDelta(Date.now() - order.buyOrder.createdAt.getTime())}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
};