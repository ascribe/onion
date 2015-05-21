class TableColumnItem {
    constructor(columnName, displayName, displayType, rowWidth, canBeOrdered) {
        this.columnName = columnName;
        this.displayName = displayName;
        this.displayType = displayType;
        this.rowWidth = rowWidth;
        this.canBeOrdered = canBeOrdered;
    }

}

export default TableColumnItem;