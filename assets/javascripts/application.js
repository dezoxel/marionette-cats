window.MyApp = new Backbone.Marionette.Application();

window.MyApp.addRegions({
  mainRegion: '#content'
});

var AngryCat = Backbone.Model.extend({
  defaults: {
    rank: 0
  }
});

var AngryCats = Backbone.Collection.extend({
  model: AngryCat
});

var AngryCatView = Backbone.Marionette.ItemView.extend({
  template: '#angry_cat-template',
  tagName: 'tr',
  className: 'angry_cat'
});

var AngryCatsView = Backbone.Marionette.CompositeView.extend({
  template: '#angry_cats-template',
  tagName: 'table',
  id: 'angry_cats',
  className: 'table_striped table-bordered',
  itemView: AngryCatView,
  appendHtml: function(collectionView, itemView) {
    collectionView.$('tbody').append(itemView.el);
  }
});

MyApp.addInitializer(function(options) {
  var angryCatsView = new AngryCatsView({
    collection: options.cats
  });

  MyApp.mainRegion.show(angryCatsView);
});

$(document).ready(function() {
  var cats = new AngryCats([
    new AngryCat({name: 'Wet Cat', image_path: './assets/images/cat2.jpg'}),
    new AngryCat({name: 'Bitey Cat', image_path: './assets/images/cat1.jpg'}),
    new AngryCat({name: 'Surprised Cat', image_path: './assets/images/cat3.jpg'})
  ]);

  MyApp.start({cats: cats});
});