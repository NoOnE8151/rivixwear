// app/sections/WhyUsSection.js

const iconClass =
  "w-full h-full stroke-accent stroke-[1.5] stroke-linecap-round stroke-linejoin-round fill-none";

const reasons = [
  {
    num: "01",
    title: "Premium Quality",
    desc: "380gsm heavyweight fabric. Pre-shrunk, fade-resistant. Designed to outlast trends and wash cycles.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className={iconClass}
      >
        <path d="M24 4L6 14V26C6 35.9 14.1 45.3 24 48C33.9 45.3 42 35.9 42 26V14L24 4Z" />
        <polyline points="17,24 22,29 31,20" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Pan-India Delivery",
    desc: "Dispatched within 48 hours. Delivered all over india. You'll know exactly where your order is.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className={iconClass}
      >
        <path d="M6 12L18 8L30 12L42 8V38L30 42L18 38L6 42V12Z" />
        <path d="M18 8V38M30 12V42" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Easy Returns",
    desc: "7-day hassle-free returns. No questions asked. We make it simple because we stand behind our product.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className={iconClass}
      >
        <path d="M8 16L24 8L40 16V28L24 40L8 28V16Z" />
        <path d="M16 24L22 30L34 18" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Secure Payment",
    desc: "SSL encrypted checkout. UPI, Cards, Net Banking, and Cash on Delivery — all accepted.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className={iconClass}
      >
        <rect x="6" y="14" width="36" height="26" rx="2" />
        <path d="M6 22H42M16 14V10C16 7.8 17.8 6 20 6H28C30.2 6 32 7.8 32 10V14" />
        <circle cx="24" cy="31" r="4" />
      </svg>
    ),
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-background-inverse px-5 py-20 text-foreground-inverse sm:px-6 md:px-12 md:py-24 lg:px-18">
      <div className="text-accent font-poppins flex items-center reveal mb-5 sm:mb-6">
        <hr className="w-10" />&nbsp;The Rivix Standard
      </div>

      <h2 className="reveal reveal-d1 mb-5 font-bebas text-[clamp(30px,3vw,62px)] font-semibold leading-none text-white">
        WHY{" "}
        <em className="font-serif text-[0.8em] font-normal italic">
          Choose
        </em>{" "}
        US
      </h2>

      <p className="reveal reveal-d2 max-w-130 text-sm font-light leading-[1.9] text-white/50 sm:text-[15px]">
        We obsess over every thread, every stitch, every detail — so you never
        have to settle.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-px bg-white/8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r, i) => (
          <div
            key={r.title}
            className={`
              reveal
              relative
              flex
              min-h-80
              flex-col
              justify-end
              overflow-hidden
              bg-background-inverse
              p-7
              text-accent
              transition-all
              duration-500
              hover:bg-[#111]
              sm:min-h-85
              md:p-10
              ${i > 0 ? `reveal-d${i}` : ""}
            `}
          >
            {/* Background Number */}
            <div className="pointer-events-none absolute right-5 top-4 select-none font-bebas text-[60px] leading-none tracking-[-0.03em] text-white/[0.03] sm:right-6 sm:top-[18px] sm:text-[72px]">
              {r.num}
            </div>

            {/* Icon */}
            <div className="mb-7 h-12 w-12 sm:mb-8 sm:h-[52px] sm:w-[52px]">
              {r.icon}
            </div>

            {/* Title */}
            <div className="mb-3 font-bebas text-[22px] uppercase leading-none tracking-[0.08em] text-white sm:mb-[14px] sm:text-2xl">
              {r.title}
            </div>

            {/* Description */}
            <div className="text-[13px] font-light leading-[1.9] text-white/50">
              {r.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}