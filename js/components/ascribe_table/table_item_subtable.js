import React from 'react';

import TableColumnContentModel from '../../models/table_column_content_model';

// ToDo: Create Table-specific Utils to not lock it to projects utilities
import GeneralUtils from '../../utils/general_utils';

import TableItemSubtableButton from './table_item_subtable_button';
import Table from './table';


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
        this.props.store.listen(this.onChange);
    },

    loadEditionList() {
        this.props.actions.fetchEditionList(this.props.columnContent.id);

        this.setState({
            'open': true,
            'editionList': this.props.store.getState()
        });
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

            // let columnList = [
            //     new TableColumnContentModel('thumbnail', '', TableItemImg, 2, false),
            //     new TableColumnContentModel('artist_name', 'Artist', TableItemText, 4, true),
            //     new TableColumnContentModel('title', 'Title', TableItemText, 4, true)
            // ];

            if(this.state.open) {
                return (
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Table itemList={this.state.editionList}></Table>
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
                        <TableItemSubtableButton content="Editions" onClick={this.loadEditionList}>
                        </TableItemSubtableButton>
                    </div>
                </div>
                {renderEditionListTable()}
            </div> 
        );
    }
});

export default TableItemSubtable;
