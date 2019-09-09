const express = require('express');
const queryString = require('query-string');
const googleUtil = require('../utils/google-util');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html', {'title': 'Application Home'});
});

router.get('/login', (req, res) => {
    res.redirect(googleUtil.urlGoogle());
});

const setCookie = async (req, res, next) => {
    googleUtil.getGoogleAccountFromCode(req.query.code, (err, res) => {
        if (err) {
            res.redirect('/login');
        } else {
            req.session.user = res;
        }
        next();
    });
}

router.get('/auth/success',  setCookie, (req, res) => {
    res.redirect('/redirect');
})

router.get('/redirect', (req, res) => {
    res.render('home.html');
});


router.get('/home', (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        res.render('redirect.html');
    } else {
        res.redirect('/login')
    }
});

// router.get('/test', (req, res) => {
//     if (req.session.user) {
//         res.send('session works' + req.session.user);
//     } else {
//         res.send('error');
//     }
// })

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.redirect('/home');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
})

module.exports = router;