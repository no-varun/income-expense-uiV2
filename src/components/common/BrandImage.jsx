const BANK_IMAGES = {
    pnb: "/images/banks/pnb.png",
    rbl: "/images/banks/rbl.png",
    icici: "/images/banks/icici.png",
    cash: "/images/banks/cash.png",
    amazonpay: "/images/banks/amazonpay.png",
    meesho: "/images/banks/messo.png",
    meeso: "/images/banks/messo.png",
    other: "/images/banks/card.png",
};

const PAYMENT_IMAGES = {
    cash: "/images/payment/cash.png",
    paytm: "/images/payment/paytm.png",
    phonepe: "/images/payment/phonepe.png",
    gpay: "/images/payment/GPay.png",
    bhim: "/images/payment/Bhim.png",
    amazonpay: "/images/payment/amazonpay.png",
    banktransfer: "/images/payment/BankTransfer.png",
    card: "/images/payment/card.png",
    other: "/images/payment/card.png",
};

const BrandImage = ({ type, value, size = "2.25rem", className = "" }) => {
    const normalizedValue = String(value || "").replace(/[\s_-]/g, "").toLowerCase();
    const imageMap = type === "bank" ? BANK_IMAGES : PAYMENT_IMAGES;
    const src = imageMap[normalizedValue] || imageMap.other || "/images/payment/card.png";

    if (!value) return <span className="text-muted">-</span>;

    return (
        <img
            src={src}
            alt={String(value)}
            className={className}
            style={{ width: size, height: size, objectFit: "contain", verticalAlign: "middle" }}
            onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = type === "bank"
                    ? "/images/banks/card.png"
                    : "/images/payment/card.png";
            }}
        />
    );
};

export default BrandImage;
