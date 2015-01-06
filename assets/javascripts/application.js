window.MyApp = new Backbone.Marionette.Application();

window.MyApp.addRegions({
  mainRegion: '#content'
});

var AngryCat = Backbone.Model.extend({});

var AngryCats = Backbone.Collection.extend({
  model: AngryCat
});

var AngryCatView = Backbone.Marionette.ItemView.extend({
  template: '#angry_cat-template',
  tagName: 'tr',
  className: 'angry_cat'
});