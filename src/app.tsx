import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import { theme } from '@ringcentral-integration/engage-voice-widgets/theme';

import { createPhone } from './modules/Phone';
import prefix from './prefix';
import { parseUri } from './lib/parseURI';
import { App } from './containers/App';

const sdkConfig = process.env.API_CONFIG;
const version = process.env.APP_VERSION;
const buildHash = process.env.BUILD_HASH;
const brandConfig = process.env.BRAND_CONFIG;
const evSdkConfig = process.env.AGENT_CONFIG;
const authConfig = process.env.AUTH_CONFIG;

const currentUri = window.location.href;
const pathParams = parseUri(currentUri);
const { hideCallNote } = pathParams;
// @ts-ignore
const phone = createPhone({
  sdkConfig,
  brandConfig,
  evSdkConfig,
  authConfig,
  prefix,
  version,
  buildHash,
  hideCallNote: !!hideCallNote,
  runTimeEnvironment: process.env.NODE_ENV,
});

const store = createStore(phone.reducer);

phone.setStore(store);

window.phone = phone;

ReactDOM.render(
  <App phone={phone} theme={theme} />,
  document.querySelector('div#viewport'),
);