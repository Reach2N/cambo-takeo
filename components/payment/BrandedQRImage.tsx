"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import type { Currency } from "@/types";

interface BrandedQRImageProps {
    qrString: string;
    merchantName: string;
    amount: number;
    currency: Currency;
    invoiceNumber?: string;
    billNumber?: string;
    storeLabel?: string;
    terminalLabel?: string;
    purposeOfTransaction?: string;
    onGenerated?: (dataUrl: string) => void;
    className?: string;
}

// KHQR Branding Constants (matching Python image_tools.py)
const HEADER_COLOR = "#CC0000"; // KHQR Red
const TEXT_COLOR = "#000000";
const BG_COLOR = "#FFFFFF";
const DEFAULT_WIDTH = 280;
const DEFAULT_HEIGHT = 480; // Increased height to fit metadata comfortably
const QR_SIZE = 240; // Centered QR code

// Asset cache - loaded once and reused
const assetCache: {
    logo: HTMLImageElement | null;
    usdIcon: HTMLImageElement | null;
    khrIcon: HTMLImageElement | null;
    khqrIcon: HTMLImageElement | null;
    loaded: boolean;
    loading: boolean;
} = {
    logo: null,
    usdIcon: null,
    khrIcon: null,
    khqrIcon: null,
    loaded: false,
    loading: false,
};

// Promise for loading assets (to prevent duplicate loads)
let assetLoadPromise: Promise<void> | null = null;

/**
 * Preload and cache KHQR assets
 */
async function loadAssets(): Promise<void> {
    if (assetCache.loaded) return;
    if (assetLoadPromise) return assetLoadPromise;

    assetCache.loading = true;

    const loadImage = (src: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    };

    assetLoadPromise = Promise.all([
        loadImage("/assets/khqr/logo.png"),
        loadImage("/assets/khqr/USD.png"),
        loadImage("/assets/khqr/KHR.png"),
        loadImage("/assets/khqr/khqr.png"),
    ]).then(([logo, usd, khr, khqr]) => {
        assetCache.logo = logo;
        assetCache.usdIcon = usd;
        assetCache.khrIcon = khr;
        assetCache.khqrIcon = khqr;
        assetCache.loaded = true;
        assetCache.loading = false;
    });

    return assetLoadPromise;
}

/**
 * Format amount based on currency conventions
 */
function formatAmount(amount: number, currency: Currency): string {
    if (!amount || amount <= 0) {
        return "Open Amount";
    }

    if (currency === "USD") {
        return `${amount.toFixed(2)}`;
    } else {
        return `${Math.round(amount).toLocaleString("en-US")}៛`;
    }
}

/**
 * Draw the branded content onto a context
 * Shared logic between component and utility
 */
function drawBrandedContent(
    ctx: CanvasRenderingContext2D,
    qrCanvas: HTMLCanvasElement,
    merchantName: string,
    amount: number,
    currency: Currency,
    invoiceNumber?: string,
    billNumber?: string,
    storeLabel?: string,
    terminalLabel?: string,
    purposeOfTransaction?: string,
) {
    // Clear and fill background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

    // Draw red header
    ctx.fillStyle = HEADER_COLOR;
    ctx.fillRect(0, 0, DEFAULT_WIDTH, 55);

    // Draw logo in header (cached)
    if (assetCache.logo) {
        const logoWidth = 90;
        const logoHeight = 21;
        const logoX = (DEFAULT_WIDTH - logoWidth) / 2;
        ctx.drawImage(assetCache.logo, logoX, 17, logoWidth, logoHeight);
    } else {
        ctx.fillStyle = BG_COLOR;
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("KHQR", DEFAULT_WIDTH / 2, 35);
    }

    // Draw merchant name (left aligned)
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "16px sans-serif";
    ctx.textAlign = "left";
    const displayName = merchantName.length > 25 ? merchantName.slice(0, 25) + "..." : merchantName;
    ctx.fillText(displayName.toUpperCase(), 20, 85);

    // Draw amount
    const amountText = formatAmount(amount, currency);
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(amountText, 20, 120);

    // Primary reference: Use billNumber (custom) if available, otherwise fallback to invoiceNumber
    const primaryRef = billNumber || invoiceNumber;
    if (primaryRef) {
        ctx.fillStyle = "#888888";
        ctx.font = "12px sans-serif";
        // Positioned BELOW amount
        ctx.fillText(`#${primaryRef}`, 20, 140);
    }

    // Optional labels (Store, Terminal, Purpose)
    let labelY = primaryRef ? 160 : 140;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#666666";

    // Metadata labels - removed invoiceNumber duplication here
    const meta: string[] = [];

    if (storeLabel) meta.push(`Store: ${storeLabel}`);
    if (terminalLabel) meta.push(`Term: ${terminalLabel}`);
    if (purposeOfTransaction) meta.push(`Note: ${purposeOfTransaction}`);

    if (meta.length > 0) {
        // Draw metadata in one or two lines if needed
        const metaText = meta.join(" | ");
        if (ctx.measureText(metaText).width > DEFAULT_WIDTH - 40) {
            // Split if too long (simple split for 3 items)
            if (meta.length >= 2) {
                ctx.fillText(`${meta[0]} | ${meta[1]}`, 20, labelY);
                labelY += 15;
                if (meta[2]) ctx.fillText(meta[2], 20, labelY);
            } else {
                ctx.fillText(metaText, 20, labelY);
            }
        } else {
            ctx.fillText(metaText, 20, labelY);
        }
        labelY += 15;
    }

    // Draw dashed separator
    ctx.strokeStyle = "#EEEEEE";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const separatorY = Math.max(labelY, 155);
    ctx.moveTo(15, separatorY);
    ctx.lineTo(DEFAULT_WIDTH - 15, separatorY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw QR code - centered
    const qrX = (DEFAULT_WIDTH - QR_SIZE) / 2;
    const qrY = separatorY + 15;
    ctx.drawImage(qrCanvas, qrX, qrY, QR_SIZE, QR_SIZE);

    // Draw currency icon overlay on QR (cached) - centered
    const currencyIcon =
        !amount || amount <= 0
            ? assetCache.khqrIcon
            : currency === "USD"
                ? assetCache.usdIcon
                : assetCache.khrIcon;

    if (currencyIcon) {
        const iconSize = 44;
        const iconX = DEFAULT_WIDTH / 2 - iconSize / 2;
        const iconY = qrY + QR_SIZE / 2 - iconSize / 2;
        ctx.drawImage(currencyIcon, iconX, iconY, iconSize, iconSize);
    }

    // Draw decorative red corner triangle
    const foldSize = 60;
    ctx.fillStyle = HEADER_COLOR;
    ctx.beginPath();
    ctx.moveTo(DEFAULT_WIDTH - foldSize, 0);
    ctx.lineTo(DEFAULT_WIDTH, 0);
    ctx.lineTo(DEFAULT_WIDTH, foldSize);
    ctx.closePath();
    ctx.fill();

    // Bottom text
    ctx.fillStyle = "#999999";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scan to Pay", DEFAULT_WIDTH / 2, DEFAULT_HEIGHT - 18);
}

/**
 * Branded KHQR Image Component
 */
export function BrandedQRImage({
    qrString,
    merchantName,
    amount,
    currency,
    invoiceNumber,
    billNumber,
    storeLabel,
    terminalLabel,
    purposeOfTransaction,
    onGenerated,
    className,
}: BrandedQRImageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const qrRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [assetsLoaded, setAssetsLoaded] = useState(assetCache.loaded);

    useEffect(() => {
        if (!assetCache.loaded) {
            loadAssets().then(() => setAssetsLoaded(true));
        }
    }, []);

    const drawBrandedQR = useCallback(() => {
        const canvas = canvasRef.current;
        const qrContainer = qrRef.current;

        if (!canvas || !qrContainer || !assetsLoaded) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const qrCanvas = qrContainer.querySelector("canvas");
        if (!qrCanvas) return;

        const dpr = window.devicePixelRatio || 2;
        canvas.width = DEFAULT_WIDTH * dpr;
        canvas.height = DEFAULT_HEIGHT * dpr;
        canvas.style.width = `${DEFAULT_WIDTH}px`;
        canvas.style.height = `${DEFAULT_HEIGHT}px`;
        ctx.scale(dpr, dpr);

        drawBrandedContent(
            ctx,
            qrCanvas,
            merchantName,
            amount,
            currency,
            invoiceNumber,
            billNumber,
            storeLabel,
            terminalLabel,
            purposeOfTransaction
        );

        setIsReady(true);
        onGenerated?.(canvas.toDataURL("image/png"));
    }, [assetsLoaded, merchantName, amount, currency, invoiceNumber, billNumber, storeLabel, terminalLabel, purposeOfTransaction, onGenerated]);

    useEffect(() => {
        if (assetsLoaded && qrString) {
            const timer = setTimeout(drawBrandedQR, 50);
            return () => clearTimeout(timer);
        }
    }, [assetsLoaded, qrString, drawBrandedQR]);

    return (
        <div className={`relative ${className || ""}`} style={{ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }}>
            {!isReady && (
                <div
                    className="absolute inset-0 rounded-xl overflow-hidden animate-pulse"
                    style={{
                        background: `linear-gradient(to bottom, ${HEADER_COLOR} 0%, ${HEADER_COLOR} 55px, ${BG_COLOR} 55px)`,
                    }}
                >
                    <div className="absolute bg-gray-200 rounded-lg flex items-center justify-center shadow-inner"
                        style={{ top: 160, left: (DEFAULT_WIDTH - QR_SIZE) / 2, width: QR_SIZE, height: QR_SIZE }}>
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded blur-sm" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                    </div>
                </div>
            )}

            <div ref={qrRef} className="absolute opacity-0 pointer-events-none">
                <QRCodeCanvas value={qrString} size={QR_SIZE * 2} level="M" includeMargin={false} />
            </div>

            <canvas
                ref={canvasRef}
                className={`rounded-xl shadow-xl transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
                style={{ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }}
            />
        </div>
    );
}

/**
 * Generate branded QR image as data URL (utility function)
 * Identical logic to component for consistency
 */
export async function generateBrandedQRDataUrl(
    qrString: string,
    merchantName: string,
    amount: number,
    currency: Currency,
    invoiceNumber?: string,
    billNumber?: string,
    storeLabel?: string,
    terminalLabel?: string,
    purposeOfTransaction?: string
): Promise<string> {
    await loadAssets();

    return new Promise((resolve, reject) => {
        import("qrcode").then((QRCode) => {
            const qrCanvas = document.createElement("canvas");

            QRCode.toCanvas(qrCanvas, qrString, { width: QR_SIZE * 2, margin: 0 }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const canvas = document.createElement("canvas");
                    const dpr = 2;
                    canvas.width = DEFAULT_WIDTH * dpr;
                    canvas.height = DEFAULT_HEIGHT * dpr;

                    const ctx = canvas.getContext("2d");
                    if (!ctx) throw new Error("Canvas context not available");
                    ctx.scale(dpr, dpr);

                    drawBrandedContent(
                        ctx,
                        qrCanvas,
                        merchantName,
                        amount,
                        currency,
                        invoiceNumber,
                        billNumber,
                        storeLabel,
                        terminalLabel,
                        purposeOfTransaction
                    );

                    resolve(canvas.toDataURL("image/png"));
                } catch (e) {
                    reject(e);
                }
            });
        });
    });
}

if (typeof window !== "undefined") {
    loadAssets();
}
