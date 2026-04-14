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

interface DealOrderTableProps {
  deal: Deal;
}

export const DealOrderTable = ({ deal }: DealOrderTableProps) => {
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
          {/* Sell Order */}
          <TableRow
            onMouseEnter={() =>
              setPreviewImg(
                `https://render.albiononline.com/v1/item/${deal.sellOrder.itemTypeId}.png`
              )
            }
            onMouseLeave={() => setPreviewImg(null)}
            onMouseMove={handleMouseMove}
          >
            <TableCell className="font-medium">Sell Order</TableCell>
            <TableCell>
              {getEnchantmentName(deal.sellOrder.enchantmentLevel)} (
              {deal.sellOrder.enchantmentLevel})
            </TableCell>
            <TableCell>
              {getQualityName(deal.sellOrder.qualityLevel)} (
              {deal.sellOrder.qualityLevel})
            </TableCell>
            <TableCell>{formatNumber(deal.sellOrder.price)}</TableCell>
            <TableCell>
              {formatTimeDelta(Date.now() - deal.sellOrder.createdAt.getTime())}
            </TableCell>
          </TableRow>

          {/* Buy Order */}
          <TableRow
            onMouseEnter={() =>
              setPreviewImg(
                `https://render.albiononline.com/v1/item/${deal.buyOrder.itemTypeId}.png`
              )
            }
            onMouseLeave={() => setPreviewImg(null)}
            onMouseMove={handleMouseMove}
          >
            <TableCell className="font-medium">Buy Order</TableCell>
            <TableCell>
              {getEnchantmentName(deal.buyOrder.enchantmentLevel)} (
              {deal.buyOrder.enchantmentLevel})
            </TableCell>
            <TableCell>
              {getQualityName(deal.buyOrder.qualityLevel)} (
              {deal.buyOrder.qualityLevel})
            </TableCell>
            <TableCell>{formatNumber(deal.buyOrder.price)}</TableCell>
            <TableCell>
              {formatTimeDelta(Date.now() - deal.buyOrder.createdAt.getTime())}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};