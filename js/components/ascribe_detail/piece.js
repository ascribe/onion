'use strict';

import React from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import CollapsibleParagraph from './../ascribe_collapsible/collapsible_paragraph';

import DetailProperty from './detail_property';

import FurtherDetails from './further_details';
import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import MediaContainer from './media_container';

import EditionDetailProperty from './detail_property';

import AclButtonList from './../ascribe_buttons/acl_button_list';
import CreateEditionsForm from '../ascribe_forms/create_editions_form';
import CreateEditionsButton from '../ascribe_buttons/create_editions_button';

import { getLangText } from '../../utils/lang_utils';
import { mergeOptions } from '../../utils/general_utils';

/**
 * This is the component that implements display-specific functionality
 */
let Piece = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        loadPiece: React.PropTypes.func
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            {
                showCreateEditionsDialog: false
            }
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    toggleCreateEditionsDialog() {
        this.setState({
            showCreateEditionsDialog: !this.state.showCreateEditionsDialog
        });
    },

    getCreateEditionsDialog() {
        if(this.props.piece.num_editions < 1 && this.state.showCreateEditionsDialog) {
            return (
                <div style={{marginTop: '1em'}}>
                    <CreateEditionsForm
                        pieceId={this.props.piece.id}
                        handleSuccess={this.handleEditionCreationSuccess} />
                    <hr/>
                </div>
            );
        } else {
            return (<hr/>);
        }
    },

    render() {
        return (
            <Row>
                <Col md={6}>
                    <MediaContainer
                        content={this.props.piece}/>
                </Col>
                <Col md={6} className="ascribe-edition-details">
                    <div className="ascribe-detail-header">
                        <EditionDetailProperty label="TITLE" value={<div className="ascribe-detail-title">{this.props.piece.title}</div>} />
                        <EditionDetailProperty label="BY" value={this.props.piece.artist_name} />
                        <EditionDetailProperty label="DATE" value={ this.props.piece.date_created.slice(0, 4) } />
                        {this.props.piece.num_editions > 0 ? <EditionDetailProperty label="NUMBER OF EDITIONS" value={ this.props.piece.num_editions } /> : null}
                        <hr/>
                    </div>
                    <div className="ascribe-detail-header">
                        <DetailProperty label={getLangText('REGISTREE')} value={ this.props.piece.user_registered } />
                    </div>

                    <AclButtonList
                        className="text-center ascribe-button-list"
                        availableAcls={this.props.piece.acl}
                        editions={this.props.piece}
                        handleSuccess={this.props.handleSuccess}>
                            <CreateEditionsButton
                                piece={this.props.piece}
                                toggleCreateEditionsDialog={this.toggleCreateEditionsDialog}/>
                    </AclButtonList>

                    {this.getCreateEditionsDialog()}

                    <CollapsibleParagraph
                        title="Further Details"
                        show={this.props.piece.acl.indexOf('edit') > -1
                            || Object.keys(this.props.piece.extra_data).length > 0
                            || this.props.piece.other_data !== null}
                        defaultExpanded={true}>
                        <FurtherDetails
                            editable={this.props.piece.acl.indexOf('edit') > -1}
                            pieceId={this.props.piece.id}
                            extraData={this.props.piece.extra_data}
                            otherData={this.props.piece.other_data}
                            handleSuccess={this.props.loadPiece}/>
                    </CollapsibleParagraph>
                </Col>
            </Row>
        );
    }
});

export default Piece;
