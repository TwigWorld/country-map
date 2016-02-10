/*==================================

How to use:

var map = new CountryMap({
    countryCode: 'GBR',
    mapPaths: mapPaths,
    handleClick: function(state){
        alert("Clicked on "+state);
    }
});
map.draw();

==================================*/


function CountryMap(options) {

    var that = this;

    // Any of the following settings can be overwritten by passing in an options object
    this.settings = {
        width: options.width || 880,
        height: options.height || 500,
        mapPaths: options.mapPaths || {},
        containerId: options.containerId || "map",
        countryCode: options.countryCode || "",
        handleClick: options.handleClick || that.handleClick,
        fillColour: options.fillColour || "#D3CAF0",
        hoverColour: options.hoverColour || "#9900FF"
    };

    // These objects will hold Raphael paths, text, lines, groups etc
    this.statePath = {};
    this.stateBox = {};
    this.stateText = {};
    this.stateLine = {};
    this.stateGroup = {};

    // Indended to be overwritten with options.handleClick
    // so that you can handle the event in whatever way you wish
    this.handleClick = function(state) {
        //console.log(state);
    };

    // This function creates all the paths for the map and adds the events
    // for hover, click etc
    this.draw = function() {

        // If the data provided doesn't give any paths to draw then return false
        if (this.settings.mapPaths[this.settings.countryCode] === undefined){
            return false;
        }

        var mapCountry = this.settings.mapPaths[this.settings.countryCode],
        R = Raphael(this.settings.containerId, this.settings.width, this.settings.height),
            attr = {
                "fill": this.settings.fillColour,
                "stroke": "#fff",
                "stroke-opacity": "1",
                "stroke-linejoin": "round",
                "stroke-miterlimit": "4",
                "stroke-width": "0.75",
                "stroke-dasharray": "none"
            },
            boxAttr = {
                "stroke": "#ccc",
                "fill": "#fff"
            };

        //Draw Map and store Raphael paths
        for (var state in mapCountry) {

            this.stateGroup[state] = R.set();

            this.statePath[state] = R.path(mapCountry[state]['path']).attr(attr);

            this.stateGroup[state] = R.set();
            this.stateGroup[state].push(this.statePath[state]);

            // find the midpoint of the path
            var boundingBox = this.statePath[state].getBBox(),
                midPointX = boundingBox.x + (boundingBox.width / 2),
                midPointY = boundingBox.y + (boundingBox.height / 2),
                centreBoxX = midPointX,
                centreBoxY = midPointY;

            // if the box is too small move it and draw a line to it
            if (boundingBox.width < 40 || boundingBox.height < 40) {

                this.stateLine[state] = R.path(
                    "M" +
                    (midPointX) +
                    "," +
                    (midPointY) +
                    "L" +
                    (midPointX + 80) +
                    "," +
                    (midPointY)
                ).hide();

                centreBoxX += 80;
                centreBoxY -= 10;

            }

            // draw the box and the text for each state
            this.stateText[state] = R.text(centreBoxX, centreBoxY + 10, mapCountry[state]['title']);

            // get the width of the text element
            var textBBox = this.stateText[state].getBBox(),
                boxWidth = Math.floor(textBBox.width) + 10;

            this.stateBox[state] = R.rect(centreBoxX - (boxWidth/2), centreBoxY, boxWidth, 20, 5).attr(boxAttr);

            // add the box and text to the group
            this.stateGroup[state].push(this.stateBox[state]);
            this.stateGroup[state].push(this.stateText[state]);

            // hide box and text by default
            this.stateBox[state].hide();
            this.stateText[state].hide();

        }

        // Attach events for mouseover, mouseout and mousedown for each state
        for (var state in this.statePath) {

            var self = this;

            (function(st, state) {

                st[0].style.cursor = "pointer";
                self.stateBox[state][0].style.cursor = "pointer";
                self.stateText[state][0].style.cursor = "pointer";

                self.stateGroup[state].mouseover(function(event){

                    st.animate({
                        fill: self.settings.hoverColour
                    }, 300);
                    if (self.stateLine[state]) {
                        self.stateLine[state].show().toFront();
                    }

                    // Bring the text and text box to the front
                    self.stateBox[state].show().toFront();
                    self.stateText[state].show().toFront();

                    R.safari();
                });

                self.stateBox[state].mouseout(function(event){
                    st.animate({
                        fill: self.settings.fillColour
                    }, 300);
                    if (self.stateLine[state]) {
                        self.stateLine[state].hide();
                    }
                    self.stateBox[state].hide();
                    self.stateText[state].hide();

                    R.safari();
                });

                self.stateGroup[state].mouseout(function(event){
                    st.animate({
                        fill: self.settings.fillColour
                    }, 300);
                    if (self.stateLine[state]) {
                        self.stateLine[state].hide();
                    }
                    self.stateBox[state].hide();
                    self.stateText[state].hide();

                    R.safari();
                });

                self.stateGroup[state].forEach(function(e){
                    e.mousedown(function(){
                        self.settings.handleClick(mapCountry[state]['code']);
                    });
                });

            })(this.statePath[state], state);
        }

        return this;

    };
}
