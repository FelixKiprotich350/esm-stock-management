import React from "react";
import StockExpiredItemsTableComponent from "./stock-expired-items-table.component"




function StockExpired() {

    // TODO: Pull low on stock
   
  return (
    <div style={{ margin: "5px" }}>
      <StockExpiredItemsTableComponent ></StockExpiredItemsTableComponent>
    </div>
  );
}

export default StockExpired;
