
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ' - ' + cityStr;

    $greeting.text('So, you wanna go to ' + address + '?');

    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // NyTimes AJAX request
    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytUrl += '?' + $.param({'api-key': "dfd175125c874b118e05bbd62eef00d2",'q': cityStr});

    $.getJSON(nytUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        var articles = data.response.docs;

        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">' + article.headline.main + '</a>' +'<p>' + article.snippet + '</p>' + '</li>');
        };
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles About Could Not Be Loaded');
    });

    //wikipedia AJAX request

    var wikiUrl = "https://en.wikipedia.org/w/api.php";
    wikiUrl += '?' + 'action=opensearch&search=' + cityStr + '&format=json' +'&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("failed to get wikipedia resources")
    }, 8000);

    $.ajax( {
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(data) {

           var wikiTitles = data[1];
           var wikiLinks = data[3];

           for (var i = 0; i < wikiTitles.length; i++) {
               $wikiElem.append('<li><a href="'+wikiLinks[i]+'">' + wikiTitles[i] + '</a></li>');
           };

           clearTimeout(wikiRequestTimeout);
        }
    } );
    return false;
};

$('#form-container').submit(loadData);
