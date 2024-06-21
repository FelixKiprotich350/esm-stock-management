import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResourceRepresentation } from "../core/api/api";
import { usePagination } from "@openmrs/esm-framework";
import { useExpiredItems } from "./stock-expired.resource";
import { useStockInventory } from "../stock-home/stock-home-inventory-expiry.resource";
import { useStockInventoryItems } from "../stock-home/stock-home-inventory-items.resource";
import { StockItemFilter, useStockItems } from "../stock-items/stock-items.resource";


export function useStockExpiredItemsPages(v?: ResourceRepresentation) {
  const { t } = useTranslation();
  const itemss = []//useExpiredItems()
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [searchString, setSearchString] = useState(null);

  // Drug filter type
  const [isDrug, setDrug] = useState("");
  const [stockItemFilter, setStockItemFilter] = useState<StockItemFilter>({
    startIndex: currentPage - 1,
    v: v || ResourceRepresentation.Default,
    limit: 10,
    q: null,
    totalCount: true,
  });
  
  // const { items, isLoading, isError } = useStockInventoryItems(ResourceRepresentation.Full);


  const { items: expiryItems, isLoading: inventoryLoading } = useStockInventory();
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

  const pagination = usePagination(filteredData, currentPageSize); 


  useEffect(() => {
    setStockItemFilter({
      startIndex: currentPage - 1,
      v: ResourceRepresentation.Default,
      limit: currentPageSize,
      q: searchString,
      totalCount: true,
      isDrug: isDrug,
    });
  }, [searchString, currentPage, currentPageSize, isDrug]);




  return {
    items: pagination.results,
    pagination,
    totalCount: filteredData.length,
    currentPageSize,
    currentPage,
    setCurrentPage,
    setPageSize,
    pageSizes,
    isLoading,
    isDrug,
    setDrug: (drug: string) => {
      setCurrentPage(1);
      setDrug(drug);
    },
    setSearchString,
  };
}


