var RockStorPaginatedCollection = Backbone.Collection.extend({
  
  initialize: function() {
    _.bindAll(this, 'parse', 'url', 'pageInfo', 'nextPage', 'prevPage');
    typeof(options) != 'undefined' || (options = {});
    this.page = 1;
    this.perPage = RockStorGlobals.pageSize;
  },

  parse: function(resp) {
    this.count = resp.count;
    return resp.results;
  },

  url: function() {
    return this.baseUrl + '?' + $.param(this.extraParams());
  },
  
  pageInfo: function() {
    var info = {
      count: this.count,
      page: this.page,
      perPage: this.perPage,
      pages: Math.ceil(this.count / this.perPage),
      prev: false,
      next: false
    };

    var max = Math.min(this.count, this.page * this.perPage);

    if (this.total == this.pages * this.perPage) {
      max = this.total;
    }

    info.range = [(this.page - 1) * this.perPage + 1, max];

    if (this.page > 1) {
      info.prev = this.page - 1;
    }

    if (this.page < info.pages) {
      info.next = this.page + 1;
    }

    return info;
  },

  nextPage: function() {
    if (!this.pageInfo().next) {
      return false;
    }
    return this.goToPage(this.page + 1);
  },

  prevPage: function() {
    if (!this.pageInfo().prev) {
      return false;
    }
    return this.goToPage(this.page - 1);
  },
  
  goToPage: function(newPage) {
    this.page = newPage;
    return this.fetch();
  },

  extraParams: function() {
    return { page: this.page, format: "json" };
  }

});