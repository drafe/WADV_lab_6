import {SpaceX} from "./api/spacex";
import * as d3 from "d3"
import * as Geo from "./geo.json"

document.addEventListener("DOMContentLoaded", setup)

function setup(){
   const spacex = new SpaceX();

   spacex.launches().then(launches => {
      const launchesContainer = document.getElementById("launchesContainer");
      renderLaunches(launches, launchesContainer);
      renderMap("#map");
   });

}

function renderLaunches(launches, container) {
   const list = document.createElement('ul');
   const items = [];
   launches.forEach(launch=>{
      const listItem = document.createElement('li');
      listItem.innerHTML = launch.name;
      items.push(listItem);
   })
   list.append(...items);
   container.replaceChildren(list);
}
// todo Add launchpads
function renderMap(containerSelector){
      const width = 1000;
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
          .scale(70)
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

}