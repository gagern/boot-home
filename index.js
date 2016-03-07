'use strict';

const request = require('request');
const md5 = require('md5');
const fs = require('fs');

const cfg = require('./config.json');
const caCert = fs.readFileSync(require.resolve('./ca.pem'), 'utf-8');

console.log('Requesting login page');
request.get({
    url: cfg.url,
    agentOptions: {
        ca: caCert,
    },
}, login);

function post(page, data, next) {
    request.post({
        url: cfg.url.replace(/\/$/, '') + '/' + page,
        form: data,
        agentOptions: {
            ca: caCert,
        },
    }, next);
}

function login(err, resp, body) {
    if (err) throw err;
    let m = /"challenge": *"([^"]*)"/.exec(body);
    let challenge = m[1];
    let c = challenge + '-';
    let pass = cfg.pass.replace(/[^\u0000-\u00ff]/g, '.');
    let bytes = (c + pass).replace(/[^]/g, '$&\0');
    let response = c + md5(bytes);
    let data = {
        response: response,
        username: cfg.user,
        lp: '',
    };
    console.log('Sending login credentials');
    post('/', data, netDev);
}

function netDev(err, resp, body) {
    if (err) throw err;
    let m = /"sid": *"([^"]*)"/.exec(body);
    let sid = m[1];
    let data = {
        xhr: 1,
        sid: sid,
        lang: 'de',
        page: 'netDev',
        type: 'all',
        no_siderenew: '',
    };
    console.log('Listing network devices');
    post('data.lua', data, boot);
}

function boot(err, resp, body) {
    if (err) throw err;
    var json = JSON.parse(body);
    var m = json.data.active.concat(json.data.passive)
        .filter(x => x.name === cfg.machine);
    if (m.length === 0) throw Error("Machine not found");
    if (m.length > 1) throw Error("Multiple matches found");
    m = m[0];
    let data = {
        xhr: 1,
        sid: json.sid,
        lang: 'de',
        no_sidrenew: '',
        plc_desc: m.name,
        dev_name: m.name,
        btn_reset_name: '',
        static_dhcp: 'on',
        kisi_profile: 'filtprof1',
        back_to_page: '/net/net_overview.lua',
        dev: m.UID,
        last_action: '',
        btn_wake: '',
        oldpage: '/net/edit_device.lua',
    };
    console.log('Booting device');
    post('data.lua', data, logout);
}

function logout(err, resp, body) {
    if (err) throw err;
    var json = JSON.parse(body);
    let data = {
        xhr: 1,
        sid: json.sid,
        logout: 1,
        no_sidrenew: '',
    };
    console.log('Logging out');
    post('index.lua', data, done);
}

function done(err, resp, body) {
    if (err) throw err;
    console.log('Done');
}
