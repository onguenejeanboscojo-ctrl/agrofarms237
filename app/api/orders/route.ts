import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { waLink, formatFCFA } from "@/lib/whatsapp";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getDeliveryFee } from "@/lib/delivery";

type OptionValue = {
  id?: string;
  label: string;
  available?: boolean;
  price_unit?: string;
  price_1_label?: string;
  price_1?: number | null;
  price_2_label?: string;
  price_2?: number | null;
  children?: OrderOption[];
};

type OrderOption = {
  id?: string;
  label: string;
  values?: Array<OptionValue | string>;
  type?: string;
  required?: boolean;
};

type HomeProduct = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  price: number | null;
  price_unit: string | null;
  price_1_label: string | null;
  price_1: number | null;
  price_2_label: string | null;
  price_2: number | null;
  order_enabled: boolean;
  order_options?: OrderOption[] | null;
  published: boolean;
};

type OrderBody = {
  product_id?: string;
  options?: Record<string, string>;
  quantity?: number;
  client_type?: string;
  client_name?: string;
  delivery_mode?: string;
  delivery_location?: string | null;
  phone?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function finiteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeValue(value: OptionValue | string): OptionValue {
  if (typeof value === "string") return { label: value, available: true };

  return {
    ...value,
    label: typeof value?.label === "string" ? value.label : "",
    available: value?.available !== false,
    children: Array.isArray(value?.children) ? value.children : [],
  };
}

function defaultOptions(name: string): OrderOption[] {
  const n = name.trim().toLowerCase();

  if (n.includes("silure")) {
    return [
      {
        label: "État",
        values: [
          { label: "Frais", available: true },
          { label: "Fumé", available: false },
        ],
      },
    ];
  }

  // Un porcelet se vend à la pièce : il ne doit pas hériter des options du porc.
  if (n.includes("porcelet")) {
    return [];
  }

  if (n.includes("porc")) {
    return [
