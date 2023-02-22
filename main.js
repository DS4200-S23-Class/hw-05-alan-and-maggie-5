// First, we need a frame  
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

// Let's do another example, with a scale 
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const FRAME3 = d3.select("#vis3")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// This time, let's define a function that builds our plot
function scatter_plot() {

    d3.csv("data/scatter-data.csv").then((data) => {

        // Build plot inside of .then 
        // find max X
        const MAX_X = d3.max(data, (d) => { return (parseInt(d.x) + 1); });

        // Define scale functions that maps our data values 
        // (domain) to pixel values (range)
        const X_SCALE = d3.scaleLinear()
            .domain([0, (MAX_X)]) // add some padding  
            .range([0, VIS_WIDTH]);

        const MAX_Y = d3.max(data, (d) => { return (parseInt(d.y) + 1); });

        // scale function
        const Y_SCALE = d3.scaleLinear()
            .domain([MAX_Y, 0])
            .range([0, VIS_HEIGHT]);

        // Use X_SCALE to plot our points
        FRAME3.selectAll("points")
            .data(data) // passed from .then  
            .enter()
            .append("circle")
            .attr("cx", (d) => { return X_SCALE(d.x); })
            .attr("cy", (d) => { return 10 + Y_SCALE(d.y); })
            .attr("r", 10)
            .attr("fill", "royalblue")
            .attr("class", "point");

        // Tooltip

        // To add a tooltip, we will need a blank div that we 
        //  fill in with the appropriate text. Be use to note the
        //  styling we set here and in the .css
        const TOOLTIP = d3.select("#vis4")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Define event handler functions for tooltips
        function handleMouseover(event, d) {
            // on mouseover, make pink 
            d3.select(this).style("fill", "pink");
        }

        function handleMouseclick(event, d) {
            if (d3.select(this).style("stroke-width") == "5") {
                d3.select(this).style("stroke-width", "0");
            }
            else {
                d3.select(this).style("stroke-width", "5").style("stroke", "seagreen");
            }

            /* Find coordinates of the circle that was clicked */
            let circle_x = d.x;
            let circle_y = d.y;

            console.log(circle_x);
            console.log(circle_y);

            /* Most recently clicked coordinates */
            let newText = "Current Point: (" + circle_x + ", " + circle_y + ")"

            /* Represent most recently clicked coordinates on page */
            document.getElementById("vis4").innerHTML = newText;
        }

        function handleMouseleave(event, d) {
            d3.select(this).style("fill", "royalblue");

        }

        // Add event listeners
        FRAME3.selectAll(".point")
            .on("mouseover", handleMouseover) //add event listeners
            .on("click", handleMouseclick)
            .on("mouseleave", handleMouseleave);


        FRAME3.append("g")
            .attr("transform",
                "translate(" + (VIS_HEIGHT / 50) + "," + (MARGINS.top) + ")")
            .call(d3.axisRight(Y_SCALE).ticks(10))
            .attr("font-size", "10px");


        FRAME3.append("g")
            .attr("transform",
                "translate(" + 0 + "," + (VIS_HEIGHT + MARGINS.top + ")"))
            .call(d3.axisTop(X_SCALE).ticks(10))
            .attr("font-size", "10px");

    });
}

/* Create a function that adds a point to the scatter plot */
function addCoords() {
    console.log('a');

    /* Get user selected x and y coordinates */
    let x_coord = document.getElementById('x_coord');
    let y_coord = document.getElementById('y_coord');

    /* Find the computer coordinates for the user inputted coordinates */
    let x = x_coord.value;
    let y = y_coord.value;

    /* Add the coordinates as a point on the scatter plot */
    FRAME3.append("circle")
        .attr("cx", x*50)
        .attr("cy", y*50)
        .attr("r", 10)
        .attr("fill", "royalblue")
        .attr("class", "point");

}

/* Helper function for adding a point to the scatter plot */
function addCoordsHelper() {
    /* Submit button was clicked */
    let newCoords = document.getElementById("add_coords_helper");

    /* Add new coords to scatter plot */
    newCoords.addEventListener("click", addCoords);
}

// Call function 
scatter_plot();


// creating a frame to put the bar chart in
const FRAME5 = d3.select("#vis5")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// creating a function to build a bar chart 
function bar_chart() {

    //this read the bar chart file
    d3.csv("data/bar-data.csv").then((data) => {

        const AMOUNT_MAX = d3.max(data, (d) => { return parseInt(d.amount); });

        //Scale by linear for quantitative continuous data
        const SCALE_AMOUNT = d3.scaleLinear()
            .domain([0, AMOUNT_MAX])
            .range([VIS_HEIGHT, 0])

        //Scale by band because this is categorical data
        const SCALE_CATEGORY = d3.scaleBand()
                                 .domain(data.map((d) => { return d.category }))
            .range([0, VIS_WIDTH])
            .padding(0.1);

        //Creating the y axis
        FRAME5.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
            .call(d3.axisLeft(SCALE_AMOUNT).ticks(11));

        //Creating the x axis
        FRAME5.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
            .call(d3.axisBottom(SCALE_CATEGORY).ticks(11));


        //a tooltip for mouse interactions
        const TOOLTIP2 = d3.select("#vis5")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // a function for mouseover highlight and making values appear
        function handleMouseOver(event, d) {
            TOOLTIP2.style("opacity", 1);
            d3.select(this).style("fill", "pink")
            TOOLTIP2.html("Amount: " + d.amount)
                //Place the text on top of the correct bar
                 .style("top", event.pageY + "px")
                 .style("left", event.pageX + "px");
        }

        // a function for mouseleave to remove highlight and no values appear
        function handleMouseLeave(event, d) {
            TOOLTIP2.style("opacity", 0);
            d3.select(this).style("fill", "lightblue");
        }

        // plot, adding in mouse functionality, giving it color, scaling rectangles.
        FRAME5.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "lightblue")
            .attr("width", 50)
            .attr("height", d => { return (VIS_HEIGHT - SCALE_AMOUNT(d.amount)) })
            .attr("x", d => { return SCALE_CATEGORY(d.category) + MARGINS.left })
            .attr("y", d => { return (SCALE_AMOUNT(d.amount) + MARGINS.bottom) })
            .on("mouseover", handleMouseOver)
            .on("mouseleave", handleMouseLeave);

    });

}

//call the bar chart function
bar_chart();
