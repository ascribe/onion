'use strict';

import alt from '../../../../alt';

import PrizeJuryActions from '../actions/prize_jury_actions';

class PrizeJuryStore {
    constructor() {
        this.members = [];
        this.membersActive = [];
        this.membersPending = [];
        this.membersInactive = [];
        this.bindActions(PrizeJuryActions);
    }

    onUpdatePrizeJury( members ) {
        this.members = members;
        this.splitJuryMembers();
    }

    onRemovePrizeJury( email ) {
        let memberInactive = this.members.filter((item)=> item.email === email );
        this.membersActive = this.membersActive.filter((item)=> item.email !== email );
        this.membersPending = this.membersPending.filter((item)=> item.email !== email );
        this.membersInactive = this.membersInactive.concat(memberInactive);
    }

    splitJuryMembers(){
        this.membersActive = this.members.filter((item)=> item.status === 'Invitation accepted' );
        this.membersPending = this.members.filter((item)=> item.status === 'Invitation pending' );
        this.membersInactive = this.members.filter((item)=> item.status === 'Deactivated' );
    }
}

export default alt.createStore(PrizeJuryStore, 'PrizeJuryStore');