


import { Service } from "@/types/types";
import { $Enums } from "@prisma/client";

export const formatPrice = (s: Service) => {
    const txt: Record<$Enums.PricingUnit, string> = {
        FIXED: `${s.price} BYN`,
        PER_HOUR: `${s.price} BYN / час`,
        PER_ITEM: `${s.price} BYN / шт.`,
    };

    const priceString = txt[s.unit];

    return s.isStartingPrice ? `от ${priceString}` : priceString;
}