"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Share2, Download, RefreshCw, CheckCircle2, Clock, User, Hash, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, currencySymbol } from "@/lib/i18n";
import { BrandedQRImage } from "./BrandedQRImage";
import type { Currency, Activity } from "@/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Activity data (for viewing existing)
  activity?: Activity | null;
  // For new payment generation
  qrString?: string;
  amount?: string;
  currency?: Currency;
  merchantName?: string;
  invoiceNumber?: string;
  billNumber?: string;
  storeLabel?: string;
  terminalLabel?: string;
  purposeOfTransaction?: string;
  // Is this a new payment (show timer) or viewing existing activity (no timer)
  isNewPayment?: boolean;
  // Callbacks
  onShare?: () => void;
  onDownload?: () => void;
  onManualCheck?: () => void;
  // Status from parent (for real-time updates)
  isPaid?: boolean;
  payerName?: string;
  payerAccount?: string;
  paidAt?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  activity,
  qrString: directQrString,
  amount: directAmount,
  currency: directCurrency,
  merchantName: directMerchantName,
  invoiceNumber,
  billNumber,
  storeLabel,
  terminalLabel,
  purposeOfTransaction,
  onShare,
  onDownload,
  onManualCheck,
  isPaid: externalIsPaid,
  payerName: externalPayerName,
  payerAccount: externalPayerAccount,
  paidAt: externalPaidAt,
}: PaymentModalProps) {
  const { t } = useI18n();
  // Derive values from activity or direct props
  const qrString = activity?.qrString || directQrString || "";
  const amount = activity?.amount || directAmount || "0";
  const currency = activity?.currency || directCurrency || "USD";
  const merchantName = activity?.merchantName || directMerchantName || "";
  const status = activity?.status || (externalIsPaid ? "PAID" : "PENDING");
  const payerName = activity?.transactionDetails?.payerName || externalPayerName;
  const payerAccount = activity?.transactionDetails?.payerAccount || externalPayerAccount;
  const paidAt = activity?.transactionDetails?.paidAt || externalPaidAt;

  // Derive advanced fields from activity if available
  const invNo = activity?.invoiceNumber || invoiceNumber;
  const billNo = activity?.billNumber || billNumber;
  const storeLbl = activity?.storeLabel || storeLabel;
  const termLbl = activity?.terminalLabel || terminalLabel;
  const purpose = activity?.purposeOfTransaction || purposeOfTransaction;

  // Determine if viewing activity (no timer, manual check only) or new payment
  const isViewingActivity = !!activity;

  // State
  const [isChecking, setIsChecking] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle drag end for swipe-to-close
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const shouldClose = info.offset.y > 100 || info.velocity.y > 500;
      if (shouldClose) onClose();
    },
    [onClose]
  );

  // Handle manual check with loading state
  const handleManualCheck = useCallback(async () => {
    if (isChecking || !onManualCheck) return;
    setIsChecking(true);
    try {
      await onManualCheck();
    } finally {
      setTimeout(() => setIsChecking(false), 500);
    }
  }, [isChecking, onManualCheck]);


  // Format paidAt date
  const formattedPaidAt = useMemo(() => {
    if (!paidAt) return "";
    try {
      return new Date(paidAt).toLocaleString();
    } catch {
      return paidAt;
    }
  }, [paidAt]);

  const isPending = status === "PENDING";
  const isPaidStatus = status === "PAID";
  const numAmount = parseFloat(amount) || 0;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50",
              "bg-card rounded-t-3xl",
              "max-h-[92vh] overflow-hidden",
              // Desktop centered
              "md:inset-x-auto md:left-1/2 md:-translate-x-1/2",
              "md:bottom-auto md:top-1/2 md:-translate-y-1/2",
              "md:w-full md:max-w-md md:rounded-3xl"
            )}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Close button (desktop) */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-4 md:p-6 flex flex-col items-center gap-4">
              {/* QR Code or Success State */}
              {isPaidStatus ? (
                // Success state
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-500">
                      {t("pay.paymentReceived")}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {currencySymbol(currency)}
                      {currency === "KHR"
                        ? Math.floor(numAmount).toLocaleString()
                        : numAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {merchantName}
                    </p>
                  </div>

                  {/* Payer info */}
                  {(payerName || payerAccount || formattedPaidAt) && (
                    <div className="w-full space-y-2 bg-muted/50 rounded-xl p-4 mt-2">
                      {payerName && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm whitespace-nowrap"><User className="w-4 h-4 text-muted-foreground flex-shrink-0" /></span>
                          <span className="text-sm">{payerName}</span>
                        </div>
                      )}
                      {payerAccount && (
                        <div className="flex items-center gap-3">
                          <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-mono truncate">
                            {payerAccount.length > 24
                              ? `${payerAccount.slice(0, 10)}...${payerAccount.slice(-10)}`
                              : payerAccount}
                          </span>
                        </div>
                      )}
                      {formattedPaidAt && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {formattedPaidAt}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Additional info during success */}
                  {(billNo || storeLbl || termLbl || purpose) && (
                    <div className="w-full flex flex-wrap gap-2 justify-center mt-2 px-2">
                      {billNo && (
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1 text-[10px] text-muted-foreground">
                          <Hash className="w-3 h-3" />
                          <span>Bill: {billNo}</span>
                        </div>
                      )}
                      {storeLbl && (
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1 text-[10px] text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          <span>Store: {storeLbl}</span>
                        </div>
                      )}
                      {termLbl && (
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1 text-[10px] text-muted-foreground">
                          <Hash className="w-3 h-3" />
                          <span>Term: {termLbl}</span>
                        </div>
                      )}
                      {purpose && (
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1 text-[10px] text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          <span>Note: {purpose}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                // QR Code state with BrandedQRImage
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="relative">
                    <div className={cn("transition-all duration-300")}>
                      {qrString ? (
                        <BrandedQRImage
                          qrString={qrString}
                          merchantName={merchantName}
                          amount={numAmount}
                          currency={currency}
                          invoiceNumber={invNo}
                          billNumber={billNo}
                          storeLabel={storeLbl}
                          terminalLabel={termLbl}
                          purposeOfTransaction={purpose}
                        />
                      ) : (
                        // Loading placeholder
                        <div
                          className="bg-white rounded-xl flex items-center justify-center"
                          style={{ width: 280, height: 420 }}
                        >
                          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Action buttons */}
              {!isPaidStatus && (
                <div className="flex items-center gap-3 w-full">
                  {onShare && (
                    <button
                      onClick={onShare}
                      disabled={!qrString}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2",
                        "py-3 px-4 rounded-xl",
                        "bg-primary text-primary-foreground",
                        "font-medium transition-all",
                        "hover:opacity-90 active:scale-[0.98]",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      <Share2 className="w-4 h-4" />
                      {t("pay.share")}
                    </button>
                  )}

                  {onDownload && (
                    <button
                      onClick={onDownload}
                      disabled={!qrString}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2",
                        "py-3 px-4 rounded-xl",
                        "bg-muted text-foreground",
                        "font-medium transition-all",
                        "hover:bg-muted/80 active:scale-[0.98]",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      <Download className="w-4 h-4" />
                      {t("pay.download")}
                    </button>
                  )}
                </div>
              )}

              {/* Manual check button - only for activities (not new payments with WebSocket polling) */}
              {isPending && onManualCheck && isViewingActivity && (
                <button
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  className={cn(
                    "flex items-center gap-2 py-2",
                    "text-foreground text-sm",
                    "hover:text-muted-foreground bg-green-500 rounded-xl py-3 px-4 mb-4 transition-colors",
                    "disabled:opacity-50"
                  )}
                >
                  <RefreshCw className={cn("w-4 h-4", isChecking && "animate-spin")} />
                  {isChecking ? t("pay.checking") : t("pay.checkStatus")}
                </button>
              )}

              {/* Done button for paid status */}
              {isPaidStatus && (
                <button
                  onClick={onClose}
                  className={cn(
                    "w-full py-3 px-4 rounded-xl",
                    "bg-primary text-primary-foreground",
                    "font-medium transition-all",
                    "hover:opacity-90 active:scale-[0.98]"
                  )}
                >
                  {t("pay.done")}
                </button>
              )}
            </div>

            <div className="mb-8">
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
