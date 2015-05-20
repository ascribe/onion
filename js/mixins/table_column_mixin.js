import GeneralUtils from '../utils/general_utils';

let TableColumnMixin = {
    /**
     * Generates the bootstrap grid column declarations automatically using
     * the columnMap.
     */
    calcColumnClasses(obj, i) {
        let bootstrapClasses = ['col-xs-', 'col-sm-', 'col-md-', 'col-lg-'];
        
        let rowData = GeneralUtils.valuesOfObject(obj);
        let listOfRowValues = rowData.map((val) => val.rowWidth );
        let numOfColumns = GeneralUtils.sumNumList(listOfRowValues);

        if(numOfColumns > 12) {
            throw new Error('Bootstrap has only 12 columns to assign. You defined ' + numOfColumns + '. Change this in the columnMap you\'re passing to the table.')
        } else {
            return bootstrapClasses.join( listOfRowValues[i] + ' ') + listOfRowValues[i];
        }
    }
};

export default TableColumnMixin;