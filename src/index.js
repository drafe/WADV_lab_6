import {SpaceX} from "./api/spacex";
import * as d3 from "d3"
import * as Geo from "./geo.json"

document.addEventListener("DOMContentLoaded", setup)

function setup(){
    const spacex = new SpaceX();
    let l;
    let pads;


    spacex.launches().then(launches => {
      const launchesContainer = document.getElementById("launchesContainer");
      renderLaunches(launches, launchesContainer);
      l = renderMap("#map");
      spacex.launchpads()
        .then(lps => {
            pads = lps;
          renderLaunchPads(pads, l[0], l[1])
      })

      launchesContainer.addEventListener('mouseover',
          (evt) =>
          { selectPadByLaunch(evt, pads, launches, l[0], l[1], 'cyan') } )
      launchesContainer.addEventListener('mouseout', (evt) =>
      { selectPadByLaunch(evt, pads, launches, l[0], l[1], 'orange') })
   });

}

function selectPadByLaunch(evt, pads, launches, svg, projection, color) {
    const lp = pads.find( pad => pad.id === launches[evt.target.id].launchpad );

    svg.append('svg:circle')
        .attr("transform",
            () => {
                return "translate(" + projection([lp.longitude, lp.latitude]) + ")";}
        )
        .attr('r', 5)
        .attr('fill', color);

}

function renderLaunches(launches, container) {
   const list = document.createElement('ul');
   const items = [];
   launches.forEach((launch, index)=>{
      const listItem = document.createElement('li');
      listItem.innerHTML = launch.name;
      listItem.id = index;
      items.push(listItem);
   })
   list.append(...items);
   container.replaceChildren(list);
}

// todo Add launchpads
function renderLaunchPads(launchpads, svg, projection) {
    const color = "orange"
    launchpads.forEach(lp=>{
        console.log(lp.name, lp.longitude, lp.latitude);

        svg.append('svg:circle')
            .attr("transform",
                () => {
                return "translate(" + projection([lp.longitude, lp.latitude]) + ")";}
            )
            .attr('r', 5)
            .attr('fill', color);

    })
}

function renderMap(containerSelector){
      const width = 800;
      const height = 600;
      const margin = {
         top: 20,
         right: 20,
         bottom: 20,
         left: 100
      };
      const svg = d3.select(containerSelector).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom )
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)
      const projection = d3.geoMercator()
          .scale(120)
          .center([0, 20])
          .translate([width/2 - margin.left, height/2 - margin.top]);
      svg.append("g")
          .selectAll("path")
          .data(Geo.features)
          .enter()
          .append("path")
          .attr("class", "topo")
          .attr("d", d3.geoPath().projection(projection))
          .style("opacity", .7)
      // svg.append('svg:circle')
      //     .attr("transform", () => { return "translate(" + projection([0,0]) + ")"; } )
      //     .attr('r', 3)
      //     .attr('fill', 'red');
      return [svg, projection];
}