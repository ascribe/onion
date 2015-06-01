class TableColumnContentModel {
    // ToDo: Add validation for all passed-in parameters
    constructor(transformFn, columnName, displayName, displayType, rowWidth, canBeOrdered) {
        this.transformFn = transformFn;
        this.columnName = columnName;
        this.displayName = displayName;
        this.displayType = displayType;
        this.rowWidth = rowWidth;
        this.canBeOrdered = canBeOrdered;
    }
}

export default TableColumnContentModel;