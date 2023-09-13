export class Usage {
    usagePlanId?: string;
    startDate?:   Date;
    endDate?:     Date;
    items?:       Items;
}

export class Items {
    keyname?: Array<number[]>;
}