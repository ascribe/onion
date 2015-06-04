class TableColumnContentModel {
    // ToDo: Add validation for all passed-in parameters
    constructor(transformFn, columnName, displayName, displayType, rowWidth, canBeOrdered, link) {
        this.transformFn = transformFn;
        this.columnName = columnName;
        this.displayName = displayName;
        this.displayType = displayType;
        this.rowWidth = rowWidth;
        this.canBeOrdered = canBeOrdered;
        this.link = link;
    }
}

export default TableColumnContentModel;