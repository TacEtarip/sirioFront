import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import axios from 'axios';
import * as compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { existsSync } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import 'reflect-metadata';
import { SitemapStream } from 'sitemap';
import { Readable } from 'stream';
import { createGzip } from 'zlib';
import 'zone.js/dist/zone-node';
import { AppServerModule } from './src/main.server';

// ssr DOM
const domino = require('domino');
const fs = require('fs');
const path = require('path');
// index from browser build!
const template = fs
  .readFileSync(path.join('.', 'dist/inventarioSirioFront', 'index.html'))
  .toString();
// for mock global window by domino
const win = domino.createWindow(template);
// mock
// tslint:disable-next-line: no-string-literal
global['window'] = win;
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
// tslint:disable-next-line: no-string-literal
global['document'] = win.document;
// tslint:disable-next-line: no-string-literal
global['CSS'] = null;
// tslint:disable-next-line: no-string-literal
global['Prism'] = null;

enableProdMode();
export function app(): express.Express {
  const server = express();
  server.use(compression());

  const distFolder = join(process.cwd(), 'dist/inventarioSirioFront/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

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

  server.use(helmet({ contentSecurityPolicy: false }));
  server.use(cookieParser());

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('/assets/sitemap.xml', async (_req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    try {
      const preLista = await axios.get(
        'https://inventario-sirio-dinar.herokuapp.com/inventario/getSiteMap'
      );
      const listaURL: any[] = preLista.data;
      const smStream = new SitemapStream({
        hostname: 'https://inventario.siriodinar.com/',
      });
      const pipeline = smStream.pipe(createGzip());

      const readable = Readable.from(listaURL);
      readable.pipe(smStream);
      pipeline.pipe(res).on('error', (e) => {
        throw e;
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });

  server.get('/auth/signOut', (req, res) => {
    res.cookie('jwt_token', '', {
      maxAge: -1,
      httpOnly: false,
    });
    res.cookie('usuario_tipo', '', {
      maxAge: -1,
      httpOnly: false,
    });
    res.cookie('usuario_user_show', '', {
      maxAge: -1,
      httpOnly: false,
    });
    res.cookie('usuario_user', '', {
      maxAge: -1,
      httpOnly: false,
    });

    res.cookie('login_info', '', {
      maxAge: -1,
      httpOnly: false,
    });

    res.cookie('login_version', '', {
      maxAge: -1,
      httpOnly: false,
    });
    res.status(200).send({ status: 'authenticated' });
  });

  server.post(
    '/auth/signIn',
    express.json(),
    express.urlencoded({ extended: true }),
    (req, res) => {
      res.cookie('login_version', 'V2', {
        maxAge: 24 * 60 * 60 * 60 * 1000,
        httpOnly: false,
      });

      res.cookie('jwt_token', req.body.jwt, {
        maxAge: 24 * 60 * 60 * 60 * 1000,
        httpOnly: false,
      });
      res.cookie('usuario_tipo', req.body.type, {
        maxAge: 24 * 60 * 60 * 60 * 1000,
        httpOnly: false,
      });
      res.cookie('usuario_user_show', req.body.usershow, {
        maxAge: 24 * 60 * 60 * 60 * 1000,
        httpOnly: false,
      });
      res.cookie('usuario_user', req.body.usuario, {
        maxAge: 24 * 60 * 60 * 60 * 1000,
        httpOnly: false,
      });

      res.cookie(
        'login_info',
        req.body.usuario + ' ' + req.body.jwt + ' ' + req.body.type,
        {
          maxAge: 24 * 60 * 60 * 60 * 1000,
          httpOnly: false,
        }
      );

      return res.status(200).send({
        token: req.body.jwt || '',
        type: req.body.type || '',
        user: req.body.usuario || '',
        userShow: req.body.usershow || '',
        authenticated: true,
      });
    }
  );

  server.get('/auth/isLoggedV2', (req, res) => {
    return res.status(200).send({ authenticated: !!req.cookies.jwt_token });
  });

  server.get('/auth/getAuhtInfo', (req, res) => {
    try {
      return res.status(200).send({
        token: req.cookies.jwt_token || '',
        type: req.cookies.usuario_tipo || '',
        user: req.cookies.usuario_user || '',
        userShow: req.cookies.usuario_user_show || '',
        authenticated: !!req.cookies.jwt_token,
      });
    } catch (error) {
      return res.json(error.message);
    }
  });

  server.get('/auth/getUserType', (req, res) => {
    return res.status(200).send({ type: req.cookies.usuario_tipo || '' });
  });

  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  server.get('*', (req, res) => {
    // tslint:disable-next-line: no-string-literal
    global['navigator'] = {
      userAgent: req['headers']['user-agent'],
    } as Navigator;
    const http = req.headers['x-forwarded-proto'] ?? 'http';

    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        {
          provide: 'ORIGIN_URL',
          useValue: `${http}://${req.headers.host}`,
        },
      ],
    });
  });
  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  const server = app();
  server.listen(port, () => {});
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
