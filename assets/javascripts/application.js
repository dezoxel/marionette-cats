window.MyApp = new Backbone.Marionette.Application();

window.MyApp.addRegions({
  mainRegion: '#content'
});

var AngryCat = Backbone.Model.extend({});

var AngryCats = Backbone.Collection.extend({
  model: AngryCat
});