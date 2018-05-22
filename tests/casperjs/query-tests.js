var DASHBOARD_URL = "http://127.0.0.1:8080/org.geppetto.frontend/";
var PROJECT_URL = "http://127.0.0.1:8080/org.geppetto.frontend/geppetto?load_project_from_url=http://v2.virtualflybrain.org/conf/vfb.json";

casper.test.begin('VFB query component tests', function suite(test) {
    casper.options.viewportSize = {
        width: 1340,
        height: 768
    };

    // add for debug info
    // casper.options.verbose = true;
    // casper.options.logLevel = "debug";

    // show unhandled js errors
    casper.on("page.error", function(msg, trace) {
        this.echo("Error: " + msg, "ERROR");
    });

    // show page level errors
    casper.on('resource.received', function (resource) {
        var status = resource.status;
        if (status >= 400) {
            this.echo('URL: ' + resource.url + ' Status: ' + resource.status);
        }
    });

    // open dashboard
    casper.start(DASHBOARD_URL, function () {
        this.waitForSelector('div#logo', function () {
            this.echo("I waited for the logo to load.");
            test.assertTitle("geppetto's home", "geppetto's homepage title is the one expected");
            test.assertExists('div#logo', "logo is found");
        }, null, 10000);
    });

    // open project, check for items in control panel + instances
    casper.thenOpen(PROJECT_URL, function () {
        this.echo("Loading project at URL: " + PROJECT_URL);

        this.waitForSelector('button[id=queryBtn]', function () {
            test.assertExists('button[id=queryBtn]', "Query builder button appeared");
        }, null, 20000);

        // wait for control panel items to be populated - this will ensure scene has loaded
        this.waitForText('VFB_00017894', function () {
            this.echo("Scene has loaded");

            // run query tests now that the scene has loaded
            queryTests();
        }, null, 20000);
    });

    var queryTests = function() {
        // open query builder, check it's visible
        casper.then(function () {
            // check if query builder is invisible
            test.assertNotVisible('#querybuilder', "Query builder is invisible");

            this.echo("Clicking on query builder button to open query builder");
            this.mouseEvent('click', 'button[id=queryBtn]', 'Opening query builder');

            test.assertVisible('#querybuilder', "Query builder is visible");
        });

        // click on selection control, check term info is populated
        casper.then(function () {
            this.echo("Typing 'medu' in the query builder search bar");
            this.sendKeys('#query-typeahead', 'medu');

            this.waitForSelector('div.tt-suggestion', function () {
                this.echo("Selecting medulla, first suggestion from suggestion box");
                this.evaluate(function() {
                    $('div.tt-suggestion').first().click();
                });
                //this.mouseEvent('click', 'button[id=queryBuilderBtn]', 'Opening query builder again');
                this.waitForSelector('select.query-item-option', function () {
                    this.echo("Selecting first query for medulla");
                    this.evaluate(function() {
                        var selectElement = $('select.query-item-option');
                        selectElement.val('0').change();
                        var event = new Event('change', { bubbles: true });
                        selectElement[0].dispatchEvent(event);
                    });

                    // not ideal - react injects strange markup in strings
                    this.waitForText('<!-- react-text: 9 -->2<!-- /react-text --><!-- react-text: 10 --> results<!-- /react-text -->', function () {
                        this.echo("Verified we have 2 results");
                        runQueryTests();
                    }, null, 10000);
                }, null, 10000);
            }, null, 120000);
        });
    };

    var runQueryTests = function () {
        casper.echo("Clicking on run query button");
        casper.mouseEvent('click', 'button[id=run-query-btn]', 'Running query');

        casper.waitForSelector('div[id=VFB_00030810-image-container]', function () {
            this.echo("Results rows appeared - click on results info for accessory medulla");

            casper.evaluate(function() {
            	$("#VFB_00030810-image-container").find("img").click();
            });
            
            // wait for text to appear in the term info widget
            this.waitForSelector('div[id=Popup1_VFB_00030810_metadata_el_0]', function () {
                test.assertExists('div[id=Popup1_VFB_00030810_metadata_el_0]', 'Term info correctly populated for FBbt_00045003(accessory medulla) after query results info button click');
            }, null, 20000);

        }, null, 20000);
    };

    casper.run(function () {
        test.done();
    });
});
