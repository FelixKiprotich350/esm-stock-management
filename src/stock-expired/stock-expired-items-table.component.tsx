import {
  Button,
  TabPanel,
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tile,
  Tooltip,
} from "@carbon/react";
import { Edit } from "@carbon/react/icons";
import { isDesktop } from "@openmrs/esm-framework";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResourceRepresentation } from "../core/api/api";
import { useStockExpiredItemsPages } from "./stock-expired-items-table.resource";
import styles from "./stock-expired-items-table.scss";

interface StockItemsTableProps {
  from?: String;
}

const StockExpiredItemsTableComponent: React.FC<StockItemsTableProps> = () => {
  const { t } = useTranslation();
  const [searchterm,setSearchTerm]=useState(null);
  const {
    isLoading,
    items,
    totalCount,
    currentPageSize,
    pageSizes,
    currentPage,
    setCurrentPage, 
    setSearchString
      } = useStockExpiredItemsPages(ResourceRepresentation.Full);


  const tableHeaders = useMemo(
    () => [
      {
        id: 0,
        header: t("type", "Type"),
        key: "type",
      },
      {
        id:1,
        header:t("batchno","Batch No"),
        key:"batchno"
      },
      {
        id: 2,
        header: t("commonName", "Common Name"),
        key: "commonName",
      },
      {
        id: 3,
        header: t("categoryname", "Category Name"),
        key: "categoryname",
      },
      {
        id: 4,
        header: t("stocklevel", "Stock Level"),
        key: "stocklevel",
      },
      {
        id: 5,
        header: t("expirydate", "Expiry Date"),
        key: "expirydate",
      }
    ],
    [t]
  );

  const tableRows = useMemo(() => {
    return items?.map((stockItem, index) => ({
      ...stockItem,
      id: stockItem?.uuid,
      key: `key-${stockItem?.uuid}`,
      uuid: `${stockItem?.uuid}`,
      type: stockItem?.drugUuid ? t("drug", "Drug") : t("other", "Other"),
      batchno: stockItem.batchNo,    
      commonName: stockItem?.commonName,  
      categoryname: stockItem?.categoryName, 
      reorderLevel:
        stockItem?.reorderLevelUoMName && stockItem?.reorderLevel
          ? `${stockItem?.reorderLevel?.toLocaleString()} ${
              stockItem?.reorderLevelUoMName
            }`
          : "",
      expirydate:stockItem.expiration? new Date(stockItem.expiration.toLocaleString()).toLocaleDateString("en-US"): "Not Specified"
    }));
  }, [items, t]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
   }
    
   
  return (
    <>
      <TabPanel>
        {"List of all Expired Items"}
      </TabPanel>

      <DataTable
        rows={tableRows}
        headers={tableHeaders}
        isSortable
        useZebraStyles
        render={({
          rows,
          headers,
          getHeaderProps,
          getTableProps,
          getRowProps,
          getBatchActionProps,
          onInputChange,
        }) => (
          <TableContainer>
            <TableToolbar
              style={{
                position: "static",
                overflow: "visible",
                backgroundColor: "color",
              }}
            >
              <TableBatchActions {...getBatchActionProps()}></TableBatchActions>
              <TableToolbarContent
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TableToolbarSearch persistent onChange={(e)=>{setSearchString(e.target.value)}} />
               
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(
                    (header) =>
                      header.key !== "details" && (
                        <TableHeader
                          {...getHeaderProps({
                            header,
                            isSortable: header.isSortable,
                          })}
                          className={
                            isDesktop
                              ? styles.desktopHeader
                              : styles.tabletHeader
                          }
                          key={`${header.key}`}
                          isSortable={header.key !== "name"}
                        >
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      )
                  )}
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className={
                          isDesktop ? styles.desktopRow : styles.tabletRow
                        }
                        {...getRowProps({ row })}
                        key={row.id}
                      >
                        {row.cells.map(
                          (cell) =>
                            cell?.info?.header !== "details" && (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            )
                        )}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            {rows.length === 0 ? (
              <div className={styles.tileContainer}>
                <Tile className={styles.tile}>
                  <div className={styles.tileContent}>
                    <p className={styles.content}>
                      {t("noItemsToDisplay", "No Expired Items to display")}
                    </p>
                   
                  </div>
                </Tile>
              </div>
            ) : null}
          </TableContainer>
        )}
      ></DataTable>

      <Pagination
        page={currentPage}
        pageSize={currentPageSize}
        pageSizes={pageSizes}
        totalItems={totalCount}
        onChange={({ page }) => setCurrentPage(page)}
        className={styles.paginationOverride}
      />
    </>
  );
};

export default StockExpiredItemsTableComponent;
