import EmberRouter from '@ember/routing/router';
import config from 'ember-basics/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('item', { path: 'item/:id' });
  this.route('not-found', { path: '/*path' });
  this.route('cart');
});
