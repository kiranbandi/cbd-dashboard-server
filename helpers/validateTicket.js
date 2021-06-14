const axios = require('axios');

// PAWS Validate URL
let pawsValidateURL = 'https://cas.usask.ca/cas/serviceValidate';

function validateTicket({ ticket }, service) {
    return new Promise((resolve, reject) => {
        // validate the ticket against paws
        axios.get(pawsValidateURL, { 'params': { ticket, 'service': service + '/' } })
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