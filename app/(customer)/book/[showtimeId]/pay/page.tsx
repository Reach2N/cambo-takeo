"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CreditCard, QrCode, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getShowtimeById,
  getMovieById,
  formatDate,
  formatPrice,
} from "@/lib/mock-data";
import { useState, useEffect } from "react";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const seats = searchParams.get("seats")?.split(",") || [];
  const showtime = getShowtimeById(params.showtimeId as string);
  const movie = showtime ? getMovieById(showtime.movieId) : null;

  const [paymentMethod, setPaymentMethod] = useState<"bakong" | "visa">("bakong");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!showtime || !movie || seats.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black mb-2">
            Session Expired
          </h1>
          <Link href="/" className="text-gold hover:text-gold-dark text-sm font-medium">
            Back to Home
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
    router.push(`/book/${params.showtimeId}/success?seats=${seats.join(",")}&total=${total}`);
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-warm-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/book/${params.showtimeId}?seats=${seats.join(",")}`}
            className="flex items-center gap-1 text-sm text-warm-dark hover:text-gold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className={`flex items-center gap-1.5 text-sm font-[family-name:var(--font-mono)] font-medium ${timeLeft < 60 ? "text-error" : "text-warm-muted"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Select Seats", "Payment", "Confirmation"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i <= 1 ? (i === 1 ? "text-gold font-medium" : "text-success") : "text-warm-tertiary"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i < 1 ? "bg-success text-cream" : i === 1 ? "bg-gold text-warm-black" : "bg-cream-dark text-warm-tertiary"
                }`}>
                  {i < 1 ? "\u2713" : i + 1}
                </div>
                <span className="text-xs hidden sm:inline">{step}</span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-px bg-warm-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Guest info */}
            <div className="bg-cream-light border border-warm-border rounded-xl p-5">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
                Guest Information
              </h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="phone" className="text-xs text-warm-muted">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="012 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 bg-cream border-warm-border focus:ring-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs text-warm-muted">Email (optional)</Label>
                  <Input
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-cream border-warm-border focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-cream-light border border-warm-border rounded-xl p-5">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
                Payment Method
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setPaymentMethod("bakong")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${
                    paymentMethod === "bakong"
                      ? "border-gold bg-gold/10"
                      : "border-warm-border bg-cream hover:border-gold/50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "bakong" ? "border-gold" : "border-warm-border"
                  }`}>
                    {paymentMethod === "bakong" && <div className="w-2 h-2 rounded-full bg-gold" />}
                  </div>
                  <QrCode className="w-5 h-5 text-gold" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-warm-black">Bakong QR</div>
                    <div className="text-[11px] text-warm-muted">Scan with any bank app</div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("visa")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition ${
                    paymentMethod === "visa"
                      ? "border-gold bg-gold/10"
                      : "border-warm-border bg-cream hover:border-gold/50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "visa" ? "border-gold" : "border-warm-border"
                  }`}>
                    {paymentMethod === "visa" && <div className="w-2 h-2 rounded-full bg-gold" />}
                  </div>
                  <CreditCard className="w-5 h-5 text-warm-muted" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-warm-black">Visa / Mastercard</div>
                    <div className="text-[11px] text-warm-muted">Pay with card</div>
                  </div>
                </button>
              </div>

              {/* Mock QR */}
              {paymentMethod === "bakong" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 flex flex-col items-center"
                >
                  <div className="w-48 h-48 bg-cream border-2 border-warm-border rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-20 h-20 text-warm-dark mx-auto" />
                      <p className="text-[10px] text-warm-muted mt-2">Mock QR Code</p>
                    </div>
                  </div>
                  <p className="text-xs text-warm-muted mt-3 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" />
                    Scan to pay with Bakong
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-cream-light border border-warm-border rounded-xl p-5 sticky top-32">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
                Order Summary
              </h2>

              <div className="flex gap-3 mb-4">
                <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={64}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-warm-black">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-warm-muted mt-0.5">
                    {formatDate(showtime.date)} &bull; {showtime.time}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {seats.map((seat) => (
                      <span
                        key={seat}
                        className="text-[10px] font-[family-name:var(--font-mono)] px-1.5 py-0.5 bg-gold/20 text-gold-dark rounded font-medium"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-warm-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-muted">Subtotal ({seats.length} seats)</span>
                  <span className="font-[family-name:var(--font-mono)] text-warm-black">{formatPrice(subtotal)}</span>
                </div>

                {/* Promo */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="text-xs bg-cream border-warm-border h-8"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-warm-border hover:border-gold shrink-0 h-8"
                    onClick={() => {
                      if (promoCode === "SAVE10") setPromoApplied(true);
                    }}
                  >
                    Apply
                  </Button>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Discount (10%)</span>
                    <span className="font-[family-name:var(--font-mono)] text-success">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="border-t border-warm-border pt-2 flex justify-between">
                  <span className="font-semibold text-warm-black">Total</span>
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-warm-black">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!phone.trim()}
                className="w-full mt-4 bg-gold hover:bg-gold-light text-warm-black font-semibold shadow-lg shadow-gold/20 disabled:opacity-40"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
