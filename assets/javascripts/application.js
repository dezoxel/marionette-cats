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
  model: AngryCat,

  initialize: function(cats) {
    var rank = 1;
    _.each(cats, function(cat) {
      cat.set('rank', rank);
      ++rank;
    });
  }
});

var AngryCatView = Backbone.Marionette.ItemView.extend({
  template: '#angry_cat-template',
  tagName: 'tr',
  className: 'angry_cat',

  events: {
    'click .rank_up img': 'rankUp',
    'click .rank_down img': 'rankDown'
  },

  rankUp: function() {
    console.log('Rank Up');
  },

  rankDown: function() {
    console.log('Rank Down');
  }
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