export class Client {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    apikey!: string;
    usagePlanId!: string;  // Changed to an array of strings
    currentUsage?: number;
    remainingUsage?: number;
}
