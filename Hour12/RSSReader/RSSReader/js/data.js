(function () {
    "use strict";

    var list = {};
    var groupedItems = {};

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup,
        refreshFeeds: refreshFeeds
    });

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    var feeds = [
        {
            key: "http://blogs.msdn.com/b/windowsappdev/rss.aspx",
            //"http://feeds.feedburner.com/JenniferMarsman",
            title: "Windows 8 app dev"
        }
    ];

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

            // Store the post info we care about in the array
            feedPosts.push({
                group: feed,
                key: feed.key,
                link: postLink,
                title: postTitle,
                author: postAuthor,
                postDate: postDate,
                content: staticContent,
                shortContent: toStaticHTML(content.textContent.substring(0, 400))
            });
        }

        return posts.length;
    }

    function refreshFeeds() {

        return getFeed(feeds[0].key)
                .then(function (request) {

                    return getItemsFromXml(request.responseXML, feeds[0]);

                }).then(function (numberOfPosts) {
                    // Now feedPosts is fully populated ...

                    list = new WinJS.Binding.List(feedPosts);

                    groupedItems = list.createGrouped(
                        function groupKeySelector(item) { return item.group.key; },
                        function groupDataSelector(item) { return item.group; }
                    );

                    Data.items = groupedItems;
                    Data.groups = groupedItems.groups;
                });
    };


})();
