"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, CreditCard, QrCode, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  formatDate,
  formatPrice,
} from "@/lib/mock-data";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { isShowtimeUpcoming } from "@/lib/calendar-utils";
import { useState, useEffect, useRef } from "react";
import { useI18n, currencySymbol } from "@/lib/i18n";
import { PaymentModal } from "@/components/payment/PaymentModal";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const seats = searchParams.get("seats")?.split(",") || [];

  const showtimes = useCinemaStore((s) => s.showtimes);
  const movies = useCinemaStore((s) => s.movies);
  const updateShowtime = useCinemaStore((s) => s.updateShowtime);
  const addPurchasedTicket = useCinemaStore((s) => s.addPurchasedTicket);

  const showtime = showtimes.find((s) => s.id === params.showtimeId);
  const movie = showtime ? getStoreMovieById(movies, showtime.movieId) : null;

  const [paymentMethod, setPaymentMethod] = useState<"bakong" | "visa">("bakong");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [mockQrString, setMockQrString] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");

  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus phone input on mount to highlight importance
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error(t("booking.sessionExpired"));
      router.push("/");
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, router, t]);

  if (!showtime || !movie || seats.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
            {t("booking.sessionExpired")}
          </h1>
          <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const expired = !isShowtimeUpcoming(showtime.date, showtime.time);

  if (expired) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
            {t("booking.showtimeExpired")}
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {t("pay.expiredDesc")}
          </p>
          <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
            {t("booking.browseMovies")}
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = seats.length * showtime.price;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handlePayment = () => {
    if (!phone.trim()) {
      toast.error(t("pay.phone") + " is required");
      phoneInputRef.current?.focus();
      return;
    }

    // Generate Invoice Number
    const newInvoiceNo = `INV-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
    setInvoiceNo(newInvoiceNo);

    // Generate Mock QR String (KHQR format roughly)
    const qr = `00020101021229300012kh.com.bakong01101234567890520460005303840540${total.toFixed(2)}5802KH5916Cambo Cinema Ltd6010Phnom Penh62200116${newInvoiceNo}6304${Math.floor(Math.random() * 10000)}`;
    setMockQrString(qr);

    // Open Modal
    setIsPaymentModalOpen(true);
    setIsPaymentSuccess(false);

    // Simulate checking for payment
    setTimeout(() => {
        setIsPaymentSuccess(true);

        // Update Store Logic (moved from before)
        updateShowtime(params.showtimeId as string, {
          bookedSeats: [...showtime.bookedSeats, ...seats],
        });

        addPurchasedTicket({
          id: String(Date.now()),
          showtimeId: params.showtimeId as string,
          movieId: showtime.movieId,
          seats,
          total,
          invoiceNumber: newInvoiceNo,
          purchaseDate: new Date().toISOString(),
        });

        toast.success(t("pay.success"));
    }, 5000); // Wait 5 seconds to simulate payment process
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
    if (isPaymentSuccess) {
         router.push(`/book/${params.showtimeId}/success?seats=${seats.join(",")}&total=${total}`);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      {/* Top bar */}
      <div className="sticky top-24 z-30 bg-background/95 backdrop-blur-sm border-b border-border rounded-xl mx-4 mb-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/book/${params.showtimeId}?seats=${seats.join(",")}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" /> {t("common.back")}
          </Link>
          <div className={`flex items-center gap-1.5 text-sm font-[family-name:var(--font-mono)] font-medium ${timeLeft < 60 ? "text-destructive" : "text-muted-foreground"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[t("booking.step1"), t("booking.step2"), t("booking.step3")].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i <= 1 ? (i === 1 ? "text-primary font-medium" : "text-success") : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i < 1 ? "bg-success text-white" : i === 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {i < 1 ? "\u2713" : i + 1}
                </div>
                <span className="text-xs hidden sm:inline">{step}</span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Guest info */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
                {t("pay.guestInfo")}
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <Label htmlFor="phone" className="text-xs font-medium text-foreground flex items-center gap-1">
                    {t("pay.phone")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    ref={phoneInputRef}
                    id="phone"
                    placeholder="012 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 bg-background border-primary/50 focus:border-primary ring-1 ring-primary/20 focus:ring-primary h-12 text-lg"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                     We will send the ticket to this number.
                  </p>
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs text-muted-foreground">{t("pay.email")}</Label>
                  <Input
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-background border-border focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
                {t("pay.method")}
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setPaymentMethod("bakong")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${
                    paymentMethod === "bakong"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "bakong" ? "border-primary" : "border-border"
                  }`}>
                    {paymentMethod === "bakong" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <QrCode className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">Bakong KHQR</div>
                    <div className="text-[11px] text-muted-foreground">{t("pay.scanBakong")}</div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("visa")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${
                    paymentMethod === "visa"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "visa" ? "border-primary" : "border-border"
                  }`}>
                    {paymentMethod === "visa" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">Visa / Mastercard</div>
                    <div className="text-[11px] text-muted-foreground">{t("pay.payCard")}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-32">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
                {t("pay.orderSummary")}
              </h2>

              <div className="flex gap-3 mb-4">
                <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden shrink-0 bg-secondary">
                  {movie.posterUrl && movie.backdropUrl ? (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      width={64}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <Film className="w-4 h-4 text-muted-foreground/40" />
                      <span className="text-[7px] text-muted-foreground/50 text-center px-1">{t("common.noPoster")}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(showtime.date)} &bull; {showtime.time}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {seats.map((seat) => (
                      <span
                        key={seat}
                        className="text-[10px] font-[family-name:var(--font-mono)] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-medium"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("pay.subtotal")} ({seats.length} {t("common.seats")})</span>
                  <span className="font-[family-name:var(--font-mono)] text-foreground">{formatPrice(subtotal)}</span>
                </div>

                {/* Promo */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="text-xs bg-background border-border h-8"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-border hover:border-primary shrink-0 h-8"
                    onClick={() => {
                      if (promoCode === "SAVE10") {
                        setPromoApplied(true);
                        toast.success("Promo code applied! 10% off");
                      } else if (promoCode) {
                        toast.error("Invalid promo code");
                      }
                    }}
                  >
                    {t("common.apply")}
                  </Button>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">{t("pay.discount")} (10%)</span>
                    <span className="font-[family-name:var(--font-mono)] text-success">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-semibold text-foreground">{t("common.total")}</span>
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
              >
                {t("pay.confirm")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleModalClose}
        qrString={mockQrString}
        amount={total.toString()}
        currency="USD"
        merchantName="Cambo Cinema"
        invoiceNumber={invoiceNo}
        purposeOfTransaction={`Tickets for ${movie.title}`}
        isNewPayment={true}
        isPaid={isPaymentSuccess}
        payerName={isPaymentSuccess ? "Simulated Payer" : undefined}
        paidAt={isPaymentSuccess ? new Date().toISOString() : undefined}
        onDownload={() => toast.success("QR Code downloaded")}
        onShare={() => toast.success("Link copied")}
      />
    </div>
  );
}
