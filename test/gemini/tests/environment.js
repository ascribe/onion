/* eslint-disable strict, no-console */
'use strict';

const MAIN_USER = {
    email: 'dimi@mailinator.com',
    password: '0000000000'
};
const MAIN_PIECE_ID = '12374';
const MAIN_EDITION_ID = '14gw9x3VA9oJaxp4cHaAuK2bvJzvEj4Xvc';

const TIMEOUTS = {
    SHORT: 3000,
    NORMAL: 5000,
    LONG: 10000,
    SUPER_DUPER_EXTRA_LONG: 30000
};

console.log('==================  Test environment  ==================\n');
console.log('Main user:');
console.log(`    Email: ${MAIN_USER.email}`);
console.log(`    Password: ${MAIN_USER.password}\n`);
console.log(`Main piece: ${MAIN_PIECE_ID}`);
console.log(`Main edition: ${MAIN_EDITION_ID}\n`);
console.log('Timeouts:');
console.log(`    Short: ${TIMEOUTS.SHORT}`);
console.log(`    Normal: ${TIMEOUTS.NORMAL}`);
console.log(`    Long: ${TIMEOUTS.LONG}`);
console.log(`    Super duper extra long: ${TIMEOUTS.SUPER_DUPER_EXTRA_LONG}\n`);
console.log('========================================================\n');

module.exports = {
    MAIN_USER,
    MAIN_PIECE_ID,
    MAIN_EDITION_ID,
    TIMEOUTS
};
