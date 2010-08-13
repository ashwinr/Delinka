// Our cute delinka object
var delinka = {
    
    // Properties
    // The callback is called with the results after they're fetched from delicious
    callback: null,
    // Count determines the number of results to return
    count: 10,
    
    // Methods
    // Gets the delicious hot list
    getHotlist: function() {
        delinka._fetchBookmarks(delinka.url);
    },

    // Gets the most recent global bookmarks
    getRecentBookmarks: function() {
        delinka._fetchBookmarks(delinka.url + 'recent/');
    },

    // Gets the most recent global bookmarks with the specified tags
    // "tags" is an array of strings
    getRecentBookmarksByTag: function(tags) {
        delinka._fetchBookmarks(delinka.url + 'tag/' + delinka._getTagString(tags));
    },

    // Gets the most popular global bookmarks
    getPopularBookmarks: function() {
        delinka.getPopularBookmarksByTag(null);
    },

    // Gets the most popular global bookmarks with the specified tags
    getPopularBookmarksByTag: function(tags) {
        delinka._fetchBookmarks(delinka.url + 'popular/' + delinka._getTagString(tags));
    },


    // Gets delicious site alerts
    getRecentSiteAlerts: function() {
        delinka._fetchBookmarks(delinka.url + 'alerts/');
    },
    
    // Gets the public bookmarks for the specified user
    getBookmarksForUser: function(user) {
        delinka._fetchBookmarks(delinka.url + user);
    },
    
    // Gets the private bookmarks for the specified user and key
    getPrivateBookmarksForUser: function(user, key) {
        delinka._fetchBookmarks(delinka.url + user + '?private=' + key);
    },

    // Gets the public bookmarks for the specified user and tags
    getBookmarksForUserByTag: function(user, tags) {
        delinka._fetchBookmarks(delinka.url + user + '/' + delinka._getTagString(tags));
    },
    
    // Gets the tags for the specified user
    getTagsForUser: function(user) {
        delinka._fetchTags(delinka.url + 'tags/' + user);
    },

    // Gets the related tags for the user and tags specified
    getRelatedTagsForUser: function(user, tags) {
        var url = delinka.url + 'tags/' + user + '/' + delinka._getTagString(tags);
        delinka._fetchTags(url);
    },

    // Gets the bookmarks for the specified user from their list of subscriptions
    getBookmarksForUserFromSubscriptions: function(user) {
        delinka._fetchBookmarks(delinka.url + 'subscriptions/' + user);
    },

    // Gets the user's network's members' bookmarks
    getMemberNetworkBookmarksForUser: function(user) {
        delinka._fetchBookmarks(delinka.url + 'network/' + user);
    },

    // Gets the user's network's members' bookmarks with the specified tags
    getMemberNetworkBookmarksForUserByTag: function(user, tags) {
        var url = delinka.url + 'network/' + user + '/' + delinka._getTagString(tags);
        delinka._fetchBookmarks(url);
    },

    // There's some problem with the delicious interface which prevents
    // the following functions from working properly. I'm in contact
    // with the delicious support staff.
    
    // Get the private bookmarks for the specified user and tags
    getPrivateBookmarksForUserByTag: function(user, key, tags) {
        var url = delinka.url + user + '/' + delinka._getTagString(tags)
                + '?private=' + key;
        delinka._fetchBookmarks(url);
    },

    // Get the user's private network's members' bookmarks
    getPrivateMemberNetworkBookmarksForUser: function(user, key) {
        delinka._fetchBookmarks(delinka.url + 'network/' + user + '?private=' + key);
    },

    // Get the user's private network's members' bookmarks with the specified tags
    getPrivateMemberNetworkBookmarksForUserByTag: function(user, key, tags) {
        var url = delinka.url + 'network/' + user + '/' + delinka._getTagString(tags);
        url += '?private=' + key;
        delinka._fetchBookmarks(url);
    },
    
    //internal properties
    thisVersion: 0.1,
    deliciousVersion: 2.0,
    url: 'http://feeds.delicious.com/v2/json/',

    //internal methods
    _getTagString: function(tags) {
        var tagString = '';
        if(tags != null)
        {
          for(i=0; i<tags.length; i++)
          {
            tagString += "+" + tags[i];
          }
          tagString = tagString.substring(1);
        }
        return tagString;
    },
    
    _fetchBookmarks: function(url) {
        delinka._fetch(url, 'callback=delinka._bkCallback');
    },
    
    _fetchTags: function(url) {
        delinka._fetch(url, 'callback=delinka._tagCallback');
    },
    
    _fetch: function(url, callback) {
        var conjunction = '?';
        var lastSlash = url.lastIndexOf(url, '/');
        if(url.indexOf(conjunction, lastSlash) != -1)
        {
            conjunction = '&';
        }
        var newurl = url + conjunction + callback + '&count=' + delinka.count;
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = newurl;
        head.appendChild(script);
    },
    
    _bkCallback: function(datalist) {
        var richUrls = [];
        for(var i=0; i<datalist.length; i++)
        {
            var richUrl = { url: datalist[i].u,
                            description: datalist[i].d,
                            date: datalist[i].dt,
                            tags: datalist[i].t
                          };
            richUrls.push(richUrl);
        }
        //call the user callback
        if(delinka.callback !== null)
            delinka.callback(richUrls);
    },
    
    _tagCallback: function(datalist) {
        var richTags = [];
        for(var i in datalist)
        {
            var richTag = { tag: i, usedCount: datalist[i] };
            richTags.push(richTag);
        }
        //call the user callback
        if(delinka.callback != null)
            delinka.callback(richTags);
    }

};
