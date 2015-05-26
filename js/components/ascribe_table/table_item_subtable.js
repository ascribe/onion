import React from 'react';

import TableColumnContentModel from '../../models/table_column_content_model';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';

// ToDo: Create Table-specific Utils to not lock it to projects utilities
import GeneralUtils from '../../utils/general_utils';

import Table from './table';
import TableItem from './table_item';
import TableItemText from './table_item_text';
import TableItemSubtableButton from './table_item_subtable_button';


let TableItemSubtable = React.createClass({
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        columnContent: React.PropTypes.object
    },

    getInitialState() {
        return {
            'open': false
        };
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange);
    },

    loadEditionList() {
        if(this.state.open) {
            this.setState({
                'open': false
            });
        } else {
            EditionListActions.fetchEditionList(this.props.columnContent.id);
            this.setState({
                'open': true,
                'editionList': EditionListStore.getState()
            });
        }
    },

    calcColumnClasses(list, i) {
        let bootstrapClasses = ['col-xs-', 'col-sm-', 'col-md-', 'col-lg-'];
        
        let listOfRowValues = list.map((column) => column.rowWidth );
        let numOfColumns = GeneralUtils.sumNumList(listOfRowValues);

        if(numOfColumns > 10) {
            throw new Error('Bootstrap has only 12 columns to assign. You defined ' + numOfColumns + '. Change this in the columnMap you\'re passing to the table.')
        } else {
            return bootstrapClasses.join( listOfRowValues[i] + ' ') + listOfRowValues[i];
        }
    },

    render() {

        let calcColumnElementContent = () => {
            return this.props.columnList.map((column, i) => {

                let TypeElement = column.displayType;
                let columnClass = this.calcColumnClasses(this.props.columnList, i);

                return (
                    <div className={columnClass + ' ascribe-table-item-column'} key={i}>
                        <TypeElement content={this.props.columnContent[column.columnName]} width="50" />
                    </div>
                );

            });
        };


        let renderEditionListTable = () => {

            let columnList = [
                new TableColumnContentModel('edition_number', 'Edition Number', TableItemText, 2, false),
                new TableColumnContentModel('user_registered', 'User', TableItemText, 4, true),
                new TableColumnContentModel('bitcoin_id', 'Bitcoin Address', TableItemText, 4, true)
            ];

            if(this.state.open && this.state.editionList[this.props.columnContent.id] && this.state.editionList[this.props.columnContent.id].length) {
                return (
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Table itemList={this.state.editionList[this.props.columnContent.id]} columnList={columnList}>
                            {this.state.editionList[this.props.columnContent.id].map((edition, i) => {
                                return (
                                    <TableItem
                                        key={i}>
                                    </TableItem>
                                );
                            })} 
                        </Table>
                      </div>  
                    </div>
                );
            }
        };

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ascribe-table-item">
                <div className="row">
                    {calcColumnElementContent()}
                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 ascribe-table-item-column">
                        <TableItemSubtableButton content={this.props.columnContent['num_editions'] + ' Editions'}
                                                 onClick={this.loadEditionList} />
                    </div>
                </div>
                {renderEditionListTable()}
            </div> 
        );
    }
});

export default TableItemSubtable;
