import React from 'react';

import GeneralUtils from '../utils/general_utils';

let TableColumnMixin = {
    /**
     * Generates the bootstrap grid column declarations automatically using
     * the columnMap.
     */
    calcColumnClasses(list, i, numOfColumns) {
        let bootstrapClasses = ['col-xs-', 'col-sm-', 'col-md-', 'col-lg-'];
        
        let listOfRowValues = list.map((column) => column.rowWidth );
        let numOfUsedColumns = GeneralUtils.sumNumList(listOfRowValues);

        if(numOfUsedColumns > numOfColumns) {
            throw new Error('This table has only ' + numOfColumns + ' columns to assign. You defined ' + numOfUsedColumns + '. Change this in the columnMap you\'re passing to the table.')
        } else {
            return bootstrapClasses.join( listOfRowValues[i] + ' ') + listOfRowValues[i];
        }
    }
};

export default TableColumnMixin;
