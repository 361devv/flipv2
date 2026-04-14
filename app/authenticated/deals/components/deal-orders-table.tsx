"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Deal } from "../data/schema";

const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

const getEnchantmentName = (level: number): string => {
  if (level === 0) return "None";
  if (level === 1) return "Bright";
  if (level === 2) return "Shimmering";
  if (level === 3) return "Glowing";
  if (level === 4) return "Luminous";
  return `Exceptional (${level})`;
};

const getQualityName = (level: number): string => {
  if (level === 1) return "Normal";
  if (level === 2) return "Good";
  if (level === 3) return "Outstanding";
  if (level === 4) return "Excellent";
  return `Quality (${level})`;
};

interface DealOrdersTableProps {
  deal: Deal;
}

export const DealOrdersTable = ({ deal }: DealOrdersTableProps) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

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
            <TableHead>Age</TableHead>
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
              {formatTimeAgo(deal.sellOrder.createdAt)}
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
              {formatTimeAgo(deal.buyOrder.createdAt)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
