import GeneralUtils from '../utils/general_utils';

let TableColumnMixin = {
    /**
     * Generates the bootstrap grid column declarations automatically using
     * the columnMap.
     */
    calcColumnClasses(obj) {
        let bootstrapClasses = ['col-xs-', 'col-sm-', 'col-md-', 'col-lg-'];
        let numOfColumns = GeneralUtils.valuesOfObject(obj).length;

        return bootstrapClasses.join( numOfColumns + ' ') + numOfColumns;
    }
};

export default TableColumnMixin;