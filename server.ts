
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { join } from 'path';
import {enableProdMode} from '@angular/core';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as compression from 'compression';

// tslint:disable-next-line: no-string-literal


// ssr DOM
const domino = require('domino');
const fs = require('fs');
const path = require('path');
// index from browser build!
const template = fs.readFileSync(path.join('.', 'dist/inventarioSirioFront', 'index.html')).toString();
// for mock global window by domino
const win = domino.createWindow(template);
// mock
// tslint:disable-next-line: no-string-literal
global['window'] = win;
// not implemented property and functions
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
// mock documnet
// tslint:disable-next-line: no-string-literal
global['document'] = win.document;
// othres mock
// tslint:disable-next-line: no-string-literal
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
// tslint:disable-next-line: no-string-literal
global['Prism'] = null;


enableProdMode();
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.use(compression());

  const distFolder = join(process.cwd(), 'dist/inventarioSirioFront/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  const redirectohttps = true;

  server.use((req, res, next) => {
    if (req.url === '/index.html') {
      return res.redirect(301, 'https://' + req.hostname);
    }

    if (
      redirectohttps &&
      req.headers['x-forwarded-proto'] !== 'https' &&
      req.hostname !== 'localhost'
    ) {
      // special for robots.txt
      if (req.url === '/robots.txt') {
        next();
        return;
      }
      return res.redirect(301, 'https://' + req.hostname + req.url);
    }
    next();
  });

  server.use(helmet({contentSecurityPolicy: false}));
  server.use(cookieParser());
  // server.use(enforce.HTTPS({ trustProtoHeader: true }));
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  /*server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));*/

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('/auth/signOut', (req, res) => {
    res.cookie('jwt_token', '', {
      maxAge: -1,
      httpOnly: true,

    });
    res.cookie('usuario_tipo', '', {
      maxAge: -1,
      httpOnly: true,

    });
    res.cookie('usuario_user_show', '', {
      maxAge: -1,
      httpOnly: true,

    });
    res.cookie('usuario_user', '', {
      maxAge: -1,
      httpOnly: true,

    });

    res.cookie('login_info', '', {
      maxAge: -1,
      httpOnly: false,
    });
    res.status(200).send({status: 'authenticated'});
  });
  server.post('/auth/signIn', express.json(), express.urlencoded({extended: true}), (req, res) => {
    res.cookie('jwt_token', req.body.jwt, {
      maxAge: 24 * 60 * 60 * 60 * 1000,
      httpOnly: true,

    });
    res.cookie('usuario_tipo', req.body.type, {
      maxAge: 24 * 60 * 60 * 60 * 1000,
      httpOnly: true,

    });
    res.cookie('usuario_user_show', req.body.usershow, {
      maxAge: 24 * 60 * 60 * 60 * 1000,
      httpOnly: true,

    });
    res.cookie('usuario_user', req.body.usuario, {
      maxAge: 24 * 60 * 60 * 60 * 1000,
      httpOnly: true,

    });

    res.cookie('login_info', req.body.usuario + ' ' + req.body.jwt + ' ' + req.body.type, {
      maxAge: 24 * 60 * 60 * 60 * 1000,
      httpOnly: false,
    });
    res.status(200).send({status: 'authenticated'});
  });

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/auth/isLogged', express.json(), express.urlencoded({extended: true}), (req, res) => {
    res.status(200).send({authenticated: !!req.cookies.jwt_token});
  });

  // All regular routes use the Universal engine

  server.get('*', (req, res) => {
    // tslint:disable-next-line: no-string-literal
    global['navigator'] = { userAgent: req['headers']['user-agent'] } as Navigator;
    const http =
      req.headers['x-forwarded-proto'] === undefined ? 'http' : req.headers['x-forwarded-proto'];

    res.render(indexHtml, {req,
      providers: [
        { provide: APP_BASE_HREF,
          useValue: req.baseUrl },
        {
          provide: 'ORIGIN_URL',
          useValue: `${http}://${req.headers.host}`,
        }] });
  });
  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
