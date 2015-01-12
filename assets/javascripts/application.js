window.MyApp = new Backbone.Marionette.Application();

window.MyApp.addRegions({
  mainRegion: '#content'
});

var AngryCat = Backbone.Model.extend({
  defaults: {
    votes: 0
  },

  rankUp: function() {
    this.set('rank', this.get('rank') - 1);
  },

  rankDown: function() {
    this.set('rank', this.get('rank') + 1);
  },

  addVote: function() {
    this.set('votes', this.get('votes') + 1);
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

    this.on('add', function(cat) {
      if (!cat.get('rank')) {
        var error = new Error('Cat must have a rank defined before being added to the collection');
        error.name = 'NoRankError';
        throw error;
      }
    });

    var self = this;

    MyApp.vent.on('cat:disqualify', function(cat) {
      var disqualifiedRank = cat.get('rank');

      var catsToUprank = self.filter(function(cat) {
        return cat.get('rank') > disqualifiedRank;
      });

      catsToUprank.forEach(function(cat) {
        cat.rankUp();
      });
    });

    MyApp.vent.on('rank:up', function(cat) {
      if (cat.get('rank') === 1) {
        // can't encrease rank of top-ranked cat
        return true;
      }

      self.rankUpFor(cat);
      self.sort();
    });

    MyApp.vent.on('rank:down', function(cat) {
      if (cat.get('rank') === self.size()) {
        // can't decrease rank of lowest ranked cat
        return true;
      }

      self.rankDownFor(cat);
      self.sort();
    });

  },

  comparator: function(cat) {
    return cat.get('rank');
  },

  rankUpFor: function(cat) {
    var rankToSwap = cat.get('rank') - 1;
    // -1 because rank starting from 1, but array indexing starting from 0
    var rankDownCat = this.at(rankToSwap - 1);

    cat.rankUp();
    rankDownCat.rankDown();
  },

  rankDownFor: function(cat) {
    var rankToSwap = cat.get('rank') + 1;
    // -1 because rank starting from 1, but array indexing starting from 0
    var rankUpCat = this.at(rankToSwap - 1);

    cat.rankDown();
    rankUpCat.rankUp();
  }
});

var AngryCatView = Backbone.Marionette.ItemView.extend({
  template: '#angry_cat-template',
  tagName: 'tr',
  className: 'angry_cat',

  events: {
    'click .rank_up img': 'rankUp',
    'click .rank_down img': 'rankDown',
    'click a.disqualify': 'disqualify'
  },

  initialize: function() {
    this.bindTo(this.model, 'change:votes', this.render);
  },

  rankUp: function() {
    this.model.addVote();
    MyApp.vent.trigger('rank:up', this.model);
  },

  rankDown: function() {
    this.model.addVote();
    MyApp.vent.trigger('rank:down', this.model);
  },

  disqualify: function() {
    MyApp.vent.trigger('cat:disqualify', this.model);
    this.model.destroy();
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

  cats.add(new AngryCat({name: 'Cranky Cat', image_path: './assets/images/cat4.jpg', rank: cats.size() + 1}));
});