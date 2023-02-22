// First, we need a frame  
const FRAME_HEIGHT = 200;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

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
    const MAX_X = d3.max(data, (d) => { return (parseInt(d.x) + 1) * 50; });
    
    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE = d3.scaleLinear() 
                        .domain([0, (MAX_X)]) // add some padding  
                        .range([0, VIS_WIDTH]); 

    const MAX_Y = d3.max(data, (d) => {return (parseInt(d.y) + 1) * 50;});

    // scale function
    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([0, VIS_HEIGHT]);

    // Use X_SCALE to plot our points
    FRAME3.selectAll("points")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return X_SCALE(d.x) * 50 + MARGINS.left; }) 
          .attr("cy", (d) => { return Y_SCALE(d.y) * 50 + MARGINS.top; }) 
          .attr("r", 10)
          .attr("fill", "royalblue")
          .attr("class", "point");

    // Tooltip

     // To add a tooltip, we will need a blank div that we 
    //  fill in with the appropriate text. Be use to note the
    //  styling we set here and in the .css
    const TOOLTIP = d3.select("#vis3")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
      
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Value: " + d.x)
              .style("left", (event.pageX + 10) + "px") //add offset
                                                          // from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }

    function handleMouseclick(event, d) {

    }

    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME3.selectAll(".point")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseclick", handleMouseclick)
          .on("mouseleave", handleMouseleave);    


    FRAME3.append("g")
        .attr("transform", 
            "translate(" + (VIS_HEIGHT / 50) + "," + (MARGINS.top / 50) + ")")
        .call(d3.axisRight(Y_SCALE).ticks(10))
            .attr("font-size", "20px");


    FRAME3.append("g")
        .attr("transform", 
            "translate(" + (VIS_WIDTH / 50) + "," + (MARGINS.left / 50) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(10))
            .attr("font-size", "20px");

  });
}

// Call function 
scatter_plot();