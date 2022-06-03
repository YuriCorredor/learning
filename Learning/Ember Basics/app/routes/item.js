import Route from '@ember/routing/route';

export default class ItemRoute extends Route {
  model(params) {
    const { id } = params;
    return id;
  }
}
