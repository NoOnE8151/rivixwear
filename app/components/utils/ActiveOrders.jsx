"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Package, Truck } from "lucide-react";

const ActiveOrders = ({ orders = [] }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const activeOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status !== "delivered" &&
        order.status !== "cancelled"
    );
  }, [orders]);

  const hasOrders = activeOrders.length > 0;

  const messages = hasOrders
    ? [
        `${activeOrders.length} ${
          activeOrders.length === 1 ? "order" : "orders"
        } on the way`,
        "Your RIVIX order is moving",
        "Something good is coming",
      ]
    : [
        "Your next RIVIX drop?",
        "Ready for your next order?",
        "Something good could be on the way",
      ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <motion.button
      type="button"
      onClick={() => {
        window.location.href = hasOrders ? "/orders" : "/shop";
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        fixed
        bottom-4
        left-1/2
        z-[90]
        -translate-x-1/2

        flex
        items-center
        gap-2.5

        rounded-full
        border
        border-white/[0.08]

        ${
          hasOrders
            ? "bg-[#0b0b0b]/85"
            : "bg-[#0b0b0b]/70"
        }

        px-3
        py-2

        backdrop-blur-md

        shadow-[0_6px_25px_rgba(0,0,0,0.18)]

        transition-colors
        duration-300

        hover:border-white/[0.14]
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full

          ${
            hasOrders
              ? "bg-white/[0.09] text-white/80"
              : "bg-white/[0.06] text-white/50"
          }
        `}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={hasOrders ? "truck" : "package"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {hasOrders ? (
              <Truck size={14} strokeWidth={1.8} />
            ) : (
              <Package size={14} strokeWidth={1.8} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text */}
      <div className="relative w-[150px] overflow-hidden sm:w-[180px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={messageIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className={`
              block
              truncate
              text-left
              text-[11px]
              font-medium
              tracking-[-0.01em]

              ${
                hasOrders
                  ? "text-white/75"
                  : "text-white/45"
              }
            `}
          >
            {messages[messageIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={13}
        strokeWidth={1.7}
        className="
          shrink-0
          text-white/25
          transition-colors
          duration-300
          group-hover:text-white/50
        "
      />
    </motion.button>
  );
};

export default ActiveOrders;