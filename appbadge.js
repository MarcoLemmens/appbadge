(function ($) {

        $.fn.appbadge = function (options) {

            // Set default options
            var settings = $.extend({
                // These are the defaults.
                width: 500,
                advanced: true,
                screenshots: true,
                country: "us"
            }, options);

            //Add class structure to given element
            $(this).addClass("appBadgeWrapper");

            if (settings.screenshots) {
                //add screenshot element
                $(this).append('<div class="appBadgeScreenshots"><div class="iPhoneScreenshots"> </div> </div> <div class="closeBut">Screenshots</div>');
            }
            //add app icon
            $(this).append('<img class="appBadgeIcon"src=""alt="">');

            //add appBadgeInfo
            $(this).append('<div class="appBadgeInfo"> <span class="appBadgeTitle"></span> <br> <span class="appBadgeAuthor"></span> <br><br> <a href="#" class="appBadgeLink"> <span class="appBadgePrice"></span><br><br> </a> <fieldset class="rating"> <input type="radio" disabled class="star5" name="rating" value="5"/><label class="full" title="Awesome - 5 stars"></label> <input type="radio" disabled class="star4half" name="rating" value="4 and a half"/><label class="half"title="Pretty good - 4.5 stars"></label> <input type="radio" disabled class="star4" name="rating" value="4"/><label class="full" title="Pretty good - 4 stars"></label> <input type="radio" disabled class="star3half" name="rating" value="3 and a half"/><label class="half"title="Meh - 3.5 stars"></label> <input type="radio" disabled class="star3" name="rating" value="3"/><label class="full" title="Meh - 3 stars"></label> <input type="radio" disabled class="star2half" name="rating" value="2 and a half"/><label class="half"title="Kinda bad - 2.5 stars"></label> <input type="radio" disabled class="star2" name="rating" value="2"/><label class="full" title="Kinda bad - 2 stars"></label> <input type="radio" disabled class="star1half" name="rating" value="1 and a half"/><label class="half"title="Meh - 1.5 stars"></label> <input type="radio" disabled class="star1" name="rating" value="1"/><label class="full" title="Sucks big time - 1 star"></label> <input type="radio" disabled class="starhalf" name="rating" value="half"/><label class="half"title="Sucks big time - 0.5 stars"></label> </fieldset> </div><div class="clearer">');

            if (settings.advanced) {
                //add spacing
                $(this).append('</div> <br> <hr> <br>');

                //add advanced information
                $(this).append('<div class="appBadgeInfoAdvanced"> <div class="appBadgeAdvancedColumn1"> <b>Geschikt voor:</b> <br> <span class="appBadgeDevices"></span> <br> <br> <b>Huidige versie:</b> <br> <span class="appBadgeCurrentVersion"></span> </div> <div class="appBadgeAdvancedColumn2"> <b>Vereist:</b> <br> <span class="appBadgeRequirements"></span> <br> <br> <b>Leeftijd:</b><br> <span class="appBadgeAge"></span> </div> <div class="appBadgeAdvancedColumn3"> <b>Grootte:</b> <br> <span class="appBadgeSize"></span> </div> </div> <div class="clearer"></div>');
            }

            //set width of appBadge
            $(this).css("width", settings.width + "px")

            var currentElement = $(this);
            var badgeInfo = currentElement.find(".appBadgeInfo");
            var badgeInfoAdvanced = currentElement.find(".appBadgeInfoAdvanced");

            // Generate iTunes API URL
            var apiUrl = "https://itunes.apple.com/"+settings.country+"/lookup?id=" + $(this).attr("data-appbadge") + "&callback=?";


            function getAppInfo() {
                return $.getJSON(apiUrl, function (data) {
                        //stub
                    }
                )
            }

            // where the magic happens
            getAppInfo().done(function (result) {

                // Get the proper array
                var appData = result["results"][0];

                // Assign all the necessary variables
                var appName = appData["trackName"];
                var appAuthor = appData["artistName"]
                var appArtwork = appData["artworkUrl512"];
                var appRating = appData["averageUserRating"];
                var appPrice = appData["formattedPrice"];
                var appLink = appData["trackViewUrl"];
                var devices = appData["supportedDevices"];
                var platforms = [];
                var iPhone = true;
                var iPad = true;
                var iPod = true;
                $.each(devices, function (key, value) {
                    if (value.indexOf("iPhone") != -1 && iPhone) {
                        platforms.push("iPhone");
                        iPhone = false;
                    }
                    if (value.indexOf("iPad") != -1 && iPad) {
                        platforms.push("iPad");
                        iPad = false;
                    }
                    if (value.indexOf("iPod") != -1 && iPod) {
                        platforms.push("iPod");
                        iPod = false;
                    }

                });
                var minimumOsVersion = appData["minimumOsVersion"];
                var appSize = appData["fileSizeBytes"] / 1000000;
                var currentVersion = appData["version"];
                var age = appData["trackContentRating"];
                var iPhoneScreenshots = appData["screenshotUrls"];


                // set app icon
                currentElement.find(".appBadgeIcon").attr("src", appArtwork);

                // set app title
                badgeInfo.find(".appBadgeTitle").html(appName);

                //set author
                badgeInfo.find(".appBadgeAuthor").html(appAuthor);

                //set price
                badgeInfo.find(".appBadgePrice").html(appPrice);

                //set url
                badgeInfo.find(".appBadgeLink").attr("href", appLink);

                //set devices
                var lastPlatform = platforms.length;
                $.each(platforms, function (key, value) {
                    if (key != lastPlatform - 1) {
                        badgeInfoAdvanced.find(".appBadgeDevices").append(platforms[key] + ", ");
                    }
                    else {
                        badgeInfoAdvanced.find(".appBadgeDevices").append(platforms[key]);
                    }

                });

                //set minimumOsVersion
                badgeInfoAdvanced.find(".appBadgeRequirements").html("iOS " + minimumOsVersion);

                //set filesize
                badgeInfoAdvanced.find(".appBadgeSize").html(Math.round(appSize * 10) / 10 + " MB");

                //set current version
                badgeInfoAdvanced.find(".appBadgeCurrentVersion").html(currentVersion);

                //set age
                badgeInfoAdvanced.find(".appBadgeAge").html(age);


                // change the stars
                switch (appRating) {

                    case 0.5:
                        badgeInfo.find(".starhalf").attr("checked", true);
                        break;

                    case 1:
                        badgeInfo.find(".star1").attr("checked", true);
                        break;

                    case 1.5:
                        badgeInfo.find(".star1half").attr("checked", true);
                        break;

                    case 2:
                        badgeInfo.find(".star2").attr("checked", true);
                        break;

                    case 2.5:
                        badgeInfo.find(".star2half").attr("checked", true);
                        break;

                    case 3:
                        badgeInfo.find(".star3").attr("checked", true);
                        break;

                    case 3.5:
                        badgeInfo.find(".star3half").attr("checked", true);
                        break;

                    case 4:
                        badgeInfo.find(".star4").attr("checked", true);
                        break;

                    case 4.5:
                        badgeInfo.find(".star4half").attr("checked", true);
                        break;

                    case 5:
                        badgeInfo.find(".star5").attr("checked", true);
                        break;
                }

                // set screenshot view
                var screenshotHeight = currentElement.height();
                var screenshotWidth = currentElement.width();
                currentElement.find(".appBadgeScreenshots").css("height", screenshotHeight + 30);
                currentElement.find(".appBadgeScreenshots").css("width", screenshotWidth);

                //add iPhone screenshots
                $.each(iPhoneScreenshots, function (key, value) {
                    var innerHtml = '<img src="' + value + '" alt="">';
                    currentElement.find(".appBadgeScreenshots .iPhoneScreenshots").append(innerHtml);
                })


                var iPhoneScreenshotClosed = false;
                currentElement.find(".closeBut").click(function () {
                    if (iPhoneScreenshotClosed) {
                        currentElement.find(".appBadgeScreenshots").css('opacity', 1).animate({opacity: 0}, 500);
                        currentElement.find(".appBadgeScreenshots").css('z-index', -1);
                        currentElement.find(".closeBut").html("Screenshots");
                        iPhoneScreenshotClosed = false;
                    }
                    else {
                        currentElement.find(".appBadgeScreenshots").css('opacity', 0).animate({opacity: 1}, 500);
                        currentElement.find(".appBadgeScreenshots").css('z-index', 10);
                        currentElement.find(".closeBut").html("Close");
                        iPhoneScreenshotClosed = true;
                    }
                });


                console.log(appData);

            });

        }

    }(jQuery)
);