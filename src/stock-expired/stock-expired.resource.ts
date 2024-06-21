import { useStockInventory } from "../stock-home/stock-home-inventory-expiry.resource";
import { useStockInventoryItems } from "../stock-home/stock-home-inventory-items.resource";



export function useExpiredItems() {
    const { items: expiryItems, isLoading: inventoryLoading } =
        useStockInventory();
    const { items: stockItems, isLoading } = useStockInventoryItems();
    const currentDate: any = new Date();
    let mergedArray: any[] = expiryItems.map((batch) => {
        const matchingItem = stockItems?.find(
            (item2) => batch?.stockItemUuid === item2.uuid
        );
        return { ...batch, ...matchingItem };
    });

    mergedArray = mergedArray.filter((item) => item.hasExpiration);
    const filteredData = mergedArray.filter((item) => {
        const expiryNotice = item.expiryNotice || 0; // Default to 0 if expiryNotice is undefined or null
        const expirationDate: any = new Date(item.expiration);
        const differenceInDays = Math.ceil(
            (expirationDate - currentDate) / (1000 * 60 * 60 * 24)
        );

        // Include items that have not expired yet or are within the expiry notice period
        return differenceInDays <= expiryNotice || differenceInDays < 0;
    });
    return filteredData;
}