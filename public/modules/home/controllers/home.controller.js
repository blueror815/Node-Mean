(function() {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController)
        .factory('FeedService', FeedService);
        
    FeedService.$inject = ['$log', '$timeout', '$http'];

    function FeedService(console, $timeout, $http) {

        var parseFeed = function(url) {
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        };

        return {
            parseFeed: parseFeed
        };
    }

    HomeController.$inject = ['$scope', 'ChartData', '$timeout', 'Colors', 'FileUploader', 'FeedService'];
    function HomeController($scope, ChartData, $timeout, Colors, FileUploader, FeedService) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          //// rss feed

          retrieveFromLocalStorage();

          $scope.phMessage = "Enter Feed URL";
          $scope.currentButtonText=$scope.allFeeds[0].titleText;

          $scope.loadFeed=function(e,url){
            $scope.currentButtonText = angular.element(e.target).text();
            // empty out filter text from last time they put one in, because
            // when they hit a new feed it is confusing.
            $scope.filterText = "";
            console.log("loadFeed / click event fired");

            if ($scope.currentButtonText == $scope.allFeeds[0].titleText)
            {
              //console.log($scope.feedSrc);
              url = $scope.feedSrc;
            }

            
            $scope.feedSrc = url;
            if (url === undefined || url === "")
            {
              $scope.phMessage = "Please enter a valid Feed URL & try again.";
              return;
            }
            
            console.log("button text: " + angular.element(e.target).text());
            console.log("value of url: " );
            console.log(url);

            FeedService.parseFeed(url).then(function(res){
                $scope.loadButonText=angular.element(e.target).text();
                $scope.feeds=res.data.responseData.feed.entries;
            });
          }

          $scope.clearText=function()
          {
            $scope.filterText = "";
          }
            
          function saveToLocalStorage(feeds)
          {
            // Put the object into storage

            localStorage.setItem('feeds', angular.toJson(feeds));
            console.log(angular.toJson(feeds));
            console.log("wrote feeds to localStorage");
          }
            
          function retrieveFromLocalStorage()
          {
            $scope.allFeeds = [];
            console.log("retrieving localStorage...");
            try
            {
              $scope.allFeeds = JSON.parse(localStorage["feeds"]);
              console.log($scope.allFeeds.length);

              // console.log(JSON.stringify($scope.allFeeds));
              if ($scope.allFeeds === null)
              {
              console.log("couldn't retrieve feeds" );
              loadDefaultFeeds();
              }
            }
            catch (ex)
            {
              console.log("ex: " + ex);
              loadDefaultFeeds();
              saveToLocalStorage($scope.allFeeds);
            }            
          }
            
          function loadDefaultFeeds()
          {
            $scope.allFeeds = [{titleText:"Load (from textbox)",url:""},
                    {titleText:"CodeProject C#",url:"http://www.codeproject.com/webservices/articlerss.aspx?cat=3"}, 
                    {titleText:"ComputerWorld - News",url:"http://www.computerworld.com/index.rss"},
                    {titleText:"Dr. Dobb's",url:"http://www.drdobbs.com/rss/all"},
                    {titleText:"InfoWorld Today's News",url:"http://www.infoworld.com/news/feed"},
                    {titleText:"Inc. Magazine",url:"http://www.inc.com/rss/homepage.xml"},
                    {titleText:"TechCrunch",url:"http://feeds.feedburner.com/TechCrunch"},
                    {titleText:"CNN",url:"http://rss.cnn.com/rss/cnn_topstories.rss"}
                    ];
          }

          $scope.removeAllFeedsFromLocalStorage = removeAllFeedsFromLocalStorage;
          $scope.saveFeed = saveFeed;
          
          function removeAllFeedsFromLocalStorage()
          {
            localStorage.removeItem('feeds'); 
          }
            
          function saveFeed()
          {
            console.log("feedSrc");
            console.log($scope.feedSrc);
            if ($scope.feedSrc === undefined || $scope.feedSrc == "")
            {
              alert("Please provide a Feed URL and try again.");
              return;
            }
            var titleText = prompt("Please enter the feed title text", "");
            if (titleText != null) {
              f = new feed(titleText, $scope.feedSrc);
              $scope.allFeeds.push(f);
              saveToLocalStorage($scope.allFeeds);
            }
          }
        //// End Rss Feed

          vm.chartdata = [
              { y: '2006', a: 100, b: 90 },
              { y: '2007', a: 75,  b: 65 },
              { y: '2008', a: 50,  b: 40 },
              { y: '2009', a: 75,  b: 65 },
              { y: '2010', a: 50,  b: 40 },
              { y: '2011', a: 75,  b: 65 },
              { y: '2012', a: 100, b: 90 }
          ];

          vm.areaOptions = {
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Serie A', 'Serie B'],
            lineColors: [ Colors.byName('purple'), Colors.byName('info') ],
            resize: true
          };

           vm.barOptions = {
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Series A', 'Series B'],
            xLabelMargin: 2,
            barColors: [ Colors.byName('info'), Colors.byName('danger') ],
            resize: true
          };

          vm.polarData = [
                {
                  value: 300,
                  color: Colors.byName('pink'),
                  highlight: Colors.byName('pink'),
                  label: 'Red'
                },
                {
                  value: 50,
                  color: Colors.byName('purple'),
                  highlight: Colors.byName('purple'),
                  label: 'Green'
                },
                {
                  value: 100,
                  color: Colors.byName('pink'),
                  highlight: Colors.byName('pink'),
                  label: 'Yellow'
                },
                {
                  value: 140,
                  color: Colors.byName('purple'),
                  highlight: Colors.byName('purple'),
                  label: 'Grey'
                },
              ];

          vm.polarOptions = {
            scaleShowLabelBackdrop : true,
            scaleBackdropColor : 'rgba(255,255,255,0.75)',
            scaleBeginAtZero : true,
            scaleBackdropPaddingY : 1,
            scaleBackdropPaddingX : 1,
            scaleShowLine : true,
            segmentShowStroke : true,
            segmentStrokeColor : '#fff',
            segmentStrokeWidth : 2,
            animationSteps : 100,
            animationEasing : 'easeOutBounce',
            animateRotate : true,
            animateScale : false
          };


          // Radar chart
          // ----------------------------------- 

          vm.radarData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
              {
                label: 'My First dataset',
                fillColor: 'rgba(114,102,186,0.2)',
                strokeColor: 'rgba(114,102,186,1)',
                pointColor: 'rgba(114,102,186,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(114,102,186,1)',
                data: [65,59,90,81,56,55,40]
              },
              {
                label: 'My Second dataset',
                fillColor: 'rgba(151,187,205,0.2)',
                strokeColor: 'rgba(151,187,205,1)',
                pointColor: 'rgba(151,187,205,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(151,187,205,1)',
                data: [28,48,40,19,96,27,100]
              }
            ]
          };

          vm.radarOptions = {
            scaleShowLine : true,
            angleShowLineOut : true,
            scaleShowLabels : false,
            scaleBeginAtZero : true,
            angleLineColor : 'rgba(0,0,0,.1)',
            angleLineWidth : 1,
            /*jshint -W109*/
            pointLabelFontFamily : "'Arial'",
            pointLabelFontStyle : 'bold',
            pointLabelFontSize : 10,
            pointLabelFontColor : '#565656',
            pointDot : true,
            pointDotRadius : 3,
            pointDotStrokeWidth : 1,
            pointHitDetectionRadius : 20,
            datasetStroke : true,
            datasetStrokeWidth : 2,
            datasetFill : true
          };


          var uploader = vm.uploader = new FileUploader({
              url: 'server/upload.php'
          });

          // FILTERS

          uploader.filters.push({
              name: 'customFilter',
              fn: function(/*item, options*/) {
                  return this.queue.length < 10;
              }
          });

          // CALLBACKS

          uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
              console.info('onWhenAddingFileFailed', item, filter, options);
          };
          uploader.onAfterAddingFile = function(fileItem) {
              console.info('onAfterAddingFile', fileItem);
          };
          uploader.onAfterAddingAll = function(addedFileItems) {
              console.info('onAfterAddingAll', addedFileItems);
          };
          uploader.onBeforeUploadItem = function(item) {
              console.info('onBeforeUploadItem', item);
          };
          uploader.onProgressItem = function(fileItem, progress) {
              console.info('onProgressItem', fileItem, progress);
          };
          uploader.onProgressAll = function(progress) {
              console.info('onProgressAll', progress);
          };
          uploader.onSuccessItem = function(fileItem, response, status, headers) {
              console.info('onSuccessItem', fileItem, response, status, headers);
          };
          uploader.onErrorItem = function(fileItem, response, status, headers) {
              console.info('onErrorItem', fileItem, response, status, headers);
          };
          uploader.onCancelItem = function(fileItem, response, status, headers) {
              console.info('onCancelItem', fileItem, response, status, headers);
          };
          uploader.onCompleteItem = function(fileItem, response, status, headers) {
              console.info('onCompleteItem', fileItem, response, status, headers);
          };
          uploader.onCompleteAll = function() {
              console.info('onCompleteAll');
          };

          console.info('uploader', uploader);


          // SPLINE
          // -----------------------------------
          vm.splineData = ChartData.load('server/chart/spline.json');
          vm.splineOptions = {
              series: {
                  lines: {
                      show: false
                  },
                  points: {
                      show: true,
                      radius: 4
                  },
                  splines: {
                      show: true,
                      tension: 0.4,
                      lineWidth: 1,
                      fill: 0.5
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  min: 0,
                  max: 150, // optional: use it for a clear represetation
                  tickColor: '#eee',
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickFormatter: function (v) {
                      return v/* + ' visitors'*/;
                  }
              },
              shadowSize: 0
          };

        }
    }
})();