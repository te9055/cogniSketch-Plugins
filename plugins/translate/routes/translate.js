
const cs = require.main.require('../cs/cs')();
const csp = require.main.require('../cs/cs_private');
const express = require.main.require('express');

const router = express.Router();

router.get('/:proj', function(req, res, next) {
    cs.log.debug('GET - example');

    if (cs.security.isLoggedIn(req)) {
        let result = {};

        result.label = csp.getQueryParameter(req, 'label');
        result.text = csp.getQueryParameter(req, 'text');

        cs.response.returnJson(res, result);
    } else {
        res.sendStatus(401);
    }
});

/** Module exports */
module.exports = router;
