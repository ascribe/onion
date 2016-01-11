'use strict';

import React from 'react';
import { History } from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import MarketAdditionalDataForm from './market_forms/market_additional_data_form';

import Property from '../../../../ascribe_forms/property';
import RegisterPieceForm from '../../../../ascribe_forms/form_register_piece';

import PieceActions from '../../../../../actions/piece_actions';
import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';
import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';
import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import SlidesContainer from '../../../../ascribe_slides_container/slides_container';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';

let MarketRegisterPiece = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState(){
        return mergeOptions(
            PieceListStore.getState(),
            UserStore.getState(),
            WhitelabelStore.getState(),
            {
                step: 0
            });
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);

        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();

        // Reset the piece store to make sure that we don't display old data
        // if the user repeatedly registers works
        PieceActions.updatePiece({});
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleRegisterSuccess(response) {
        this.refreshPieceList();

        // Use the response's piece for the next step if available
        let pieceId = null;
        if (response && response.piece) {
            pieceId = response.piece.id;
            PieceActions.updatePiece(response.piece);
        }

        this.incrementStep();
        this.refs.slidesContainer.nextSlide({ piece_id: pieceId });
    },

    handleAdditionalDataSuccess() {
        this.refreshPieceList();

        this.history.push('/collection');
    },

    // We need to increase the step to lock the forms that are already filled out
    incrementStep() {
        this.setState({
            step: this.state.step + 1
        });
    },

    getPieceFromQueryParam() {
        const queryParams = this.props.location.query;

        // Since every step of this register process is atomic,
        // we may need to enter the process at step 1 or 2.
        // If this is the case, we'll need the piece number to complete submission.
        // It is encoded in the URL as a queryParam and we're checking for it here.
        return queryParams && queryParams.piece_id;
    },

    refreshPieceList() {
        PieceListActions.fetchPieceList(
            this.state.page,
            this.state.pageSize,
            this.state.searchTerm,
            this.state.orderBy,
            this.state.orderAsc,
            this.state.filterBy
        );
    },

    render() {
        const {
            step,
            whitelabel: {
                name: whitelabelName = 'Market'
            } } = this.state;

        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <SlidesContainer
                ref="slidesContainer"
                forwardProcess={true}
                glyphiconClassNames={{
                    pending: 'glyphicon glyphicon-chevron-right',
                    completed: 'glyphicon glyphicon-lock'
                }}
                location={this.props.location}>
                <div data-slide-title={getLangText('Register work')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                disabled={step > 0}
                                enableLocalHashing={false}
                                headerMessage={getLangText('Consign to %s', whitelabelName)}
                                submitMessage={getLangText('Proceed to additional details')}
                                isFineUploaderActive={true}
                                enableSeparateThumbnail={false}
                                handleSuccess={this.handleRegisterSuccess}
                                location={this.props.location}>
                                <Property
                                    name="num_editions"
                                    label={getLangText('Specify editions')}>
                                    <input
                                        type="number"
                                        placeholder="(e.g. 32)"
                                        min={0}
                                        required />
                                </Property>
                            </RegisterPieceForm>
                        </Col>
                    </Row>
                </div>
                <div data-slide-title={getLangText('Additional details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <MarketAdditionalDataForm
                                handleSuccess={this.handleAdditionalDataSuccess}
                                pieceId={this.getPieceFromQueryParam()}
                                showHeading />
                        </Col>
                    </Row>
                </div>
            </SlidesContainer>
        );
    }
});

export default MarketRegisterPiece;
