const axios = require('axios');
require('dotenv').config();

// PAWS Validate URL
let pawsValidateURL = process.env.PAWS_VALIDATE_URL || 'https://cas.usask.ca/cas/serviceValidate';
const webUrl = (process.env.WEB_URL || 'https://localhost.usask.ca:8080').replace(/\/$/, '');
const serviceUrl = `${webUrl}/#/`;

function validateTicket({ ticket }) {
    return new Promise((resolve, reject) => {
        // validate the ticket against paws
        axios.get(pawsValidateURL, { 'params': { ticket, 'service': serviceUrl } })
            .then((response) => {
                const { data = '' } = response;
                if (data.indexOf('INVALID_TICKET') >= 1) {
                    reject('Invalid Ticket');
                } else if (data.indexOf('INVALID_SERVICE') >= 1) {
                    reject('Invalid Service');
                } else if (data.indexOf('authenticationSuccess') >= 1) {
                    let responseSplits = data.split('\n');
                    try {
                        let nsid = responseSplits[2].split('>')[1].split('<')[0];
                        resolve(nsid);
                    } catch (err) {
                        reject('Error parsing paws response');
                    }
                }
            })
            .catch((err) => {
                reject('Paws service authentication is unavailable');
            });
    });
}

module.exports = validateTicket;