(function () {
    "use strict";

    var list = {};
    var groupedItems = {};

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup,
        getItemReference: getItemReference,
        resolveItemReference: resolveItemReference,
        resolveGroupReference: resolveGroupReference,
        refreshFeeds: refreshFeeds,
        addRSSFeed: addRSSFeed,
        deleteRSSFeed: deleteRSSFeed,
        saveFeeds: saveFeeds
    });

    function addRSSFeed(url) {

        var feed = {
            key: url,
            title: 'tbd',
            sort: feeds.length + 1
        };

        return processFeed(feed).then(function () {
            feeds.push(feed);
        });
    }

    function deleteRSSFeed(url) {

        for (var i = 0; i < feeds.length; i++) {
            if (feeds[i].key === url) {
                feeds.splice(i, 1);
                break;
            }
        }

        for (var p = 0; p < feedPosts.length; undefined) {
            if (feedPosts[p].key === url) {
                feedPosts.splice(p, 1);
            } else {
                p++;
            }
        }
        bindList();
    }


    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    function saveFeeds() {

        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;

        roamingSettings.values["feeds"] = JSON.stringify(feeds);
    }

    var feeds = loadFeeds();

    function loadFeeds() {
        var appData = Windows.Storage.ApplicationData.current;
        var roamingSettings = appData.roamingSettings;

        if (!roamingSettings.values["feeds"]) {
            return [{
                key: "http://blogs.msdn.com/b/b8/atom.aspx",
                title: "Building Windows 8",
                sort: 1
            },
            {
                key: "http://blogs.msdn.com/b/windowsappdev/rss.aspx",
                title: "Windows 8 app dev",
                sort: 2
            }];
        } else {
            return JSON.parse(roamingSettings.values["feeds"]);
        }
    }

    var feedPosts = [];

    function getFeed(url) {
        // Call xhr for the URL to get results asynchronously
        return WinJS.xhr({ url: url });
    }

    function getItemsFromXml(articleSyndication, feed) {
        // Get the info for each feed post
        var rssPosts = articleSyndication.querySelectorAll("item");
        var atomPosts = articleSyndication.querySelectorAll("entry");

        var posts;
        if (rssPosts.length > 0)
            posts = rssPosts;
        else
            posts = atomPosts;

        // Process each feed post
        for (var postIndex = 0; postIndex < posts.length; postIndex++) {
            var post = posts[postIndex];

            var link = post.querySelector(
                "feed > link[rel=alternate]") || post.querySelector("link");
            var postLink = link.textContent;
            for (var a = 0; a < link.attributes.length; a++)
                if (link.attributes[a].nodeName === "href")
                    postLink = link.attributes[a].value

            // Get the title, author and date published
            var postTitle = post.querySelector("title").textContent;
            var author = post.querySelector(
                "author > name") || post.querySelector("author")
                || post.querySelector("creator");
            if (!author) {
                author = {};
                author.textContext = "";
            }
            var postAuthor = author.textContent;
            var published = post.querySelector("published")
                || post.querySelector("pubDate");

            var postPublished = published.textContent;

            var p = postPublished;
            //fix up any dates that include hour offset (negative)
            p = p.substring(0, p.indexOf("+") > 0 ? p.indexOf("+") : p.length);
            p = p.substring(0, p.indexOf("-") > 0 ? p.indexOf("-") : p.length);
            if (p.length > 5)
                postPublished = p;

            var postDate = new Date(postPublished);

            var content = post.querySelector("content")
                || post.querySelector("description");

            // Process the content so it displays nicely
            var staticContent = toStaticHTML(content.textContent);
            var imageData = getImage(staticContent);

            // Store the post info we care about in the array
            feedPosts.push({
                group: feed,
                key: feed.key,
                link: postLink,
                title: postTitle,
                author: postAuthor,
                postDate: postDate,
                content: staticContent,
                shortContent: toStaticHTML(content.textContent.substring(0, 400)),
                backgroundImage: imageData.image,
                width: imageData.width,
                height: imageData.height,
                color: imageData.color,
                left: imageData.left,
                top: imageData.top
            });
        }

        return posts.length;
    }

    function getImage(content) {

        var image = "";
        var color = "orange";
        var templateWidth = 250;
        var templateHeight = 250;
        var width = templateWidth;
        var height = templateHeight;
        var imageWidth;
        var imageHeight;
        var left = 0;
        var top = 0;


        var imgStart = content.indexOf("<img");
        if (imgStart >= 0) {
            imgStart += 5;

            var imgEnd = content.indexOf(">", imgStart);
            var srcStart = content.indexOf("src=", imgStart) + 5;
            var srcEnd = content.indexOf('"', srcStart);

            var wStart = content.indexOf("width=", imgStart) + 6;
            var wEnd = content.indexOf(" ", wStart);
            imageWidth = parseInt(content.substring(wStart, wEnd));

            var hStart = content.indexOf("height=", imgStart) + 7;
            var hEnd = content.indexOf(" ", hStart);
            imageHeight = parseInt(content.substring(hStart, hEnd));

            width = imageWidth;
            height = imageHeight;

            //determine if we need to resize according to width or height
            var w = imageWidth / templateWidth;
            var h = imageHeight / templateHeight;
            if (w >= h) {
                width = templateWidth;
                var ratio = width / imageWidth;
                height *= ratio;
                //vertically center the image
                top = Math.abs(templateHeight - height) / 2 | 0;
            }
            else {
                height = templateHeight;
                var ratio = height / imageHeight;
                width *= ratio;
                //horizontally center the image
                left = Math.abs(templateWidth - width) / 2 | 0;
            }

            image = content.substring(srcStart, srcEnd);
        }

        width = width + "px";
        height = height + "px";
        left = left + "px";
        top = top + "px";

        return {
            image: image,
            width: width,
            height: height,
            color: color,
            left: left,
            top: top
        };
    }

    function refreshFeeds() {
        var promises = [];

        feeds.forEach(function (feed) {
            var promise = processFeed(feed);
            promises.push(promise);
        });

        return WinJS.Promise.join(promises);
    };

    function processFeed(feed) {
        var xml;
        return getFeed(feed.key)
            .then(function (request) {
                xml = request.responseXML;
                return getItemsFromXml(xml, feed);
            }).then(function (numberOfPosts) {
                //Let's set the feed name
                var title = xml.querySelector("feed > title") ||
                                    xml.querySelector("title");
                if (title) {
                    feed.title = title.textContent;
                }

                // Now feedPosts is fully populated ...
                bindList();
            });
    }

    function bindList() {
        list = new WinJS.Binding.List(feedPosts);

        groupedItems = list.createGrouped(
            function groupKeySelector(item) { return item.group.sort; },
            function groupDataSelector(item) { return item.group; },
            function compareForSort(item1, item2) { return item1 - item2; }
        );

        Data.items = groupedItems;
        Data.groups = groupedItems.groups;
    }
    
})();
