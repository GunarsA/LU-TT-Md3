/*
 * Enter your name, surname and student id number here
 */

function capitalize(str) {
  // implement a function to capitalize the first letter of every word in str
  // TODO your code goes here
  return str
    .split(" ")
    .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
    .join(" ");
}

function updatePollingStations(lookup, region) {
  let stations = [];
  if (region) {
    stations = Object.keys(lookup[region]).sort();
  } else {
    for (let i in lookup) {
      stations = stations.concat(Object.keys(lookup[i]));
    }
    stations.sort();
  }

  const station_s = document.getElementById("polling-list");
  const opt = document.createElement("option");
  opt.textContent = "All";
  opt.value = "";
  station_s.replaceChildren(opt);
  for (let i in stations) {
    const opt = document.createElement("option");
    opt.textContent = stations[i];
    opt.value = stations[i];
    station_s.appendChild(opt);
  }

  return;
}

function getCell(value, type) {
  const cell = document.createElement(type);
  cell.textContent = value;
  return cell;
}

function getRow(station) {
  const row = document.createElement("tr");

  row.appendChild(
    getCell(
      station.Location.ParentId
        ? capitalize(station.Location.ParentId)
        : capitalize(station.Location.Id),
      "td"
    )
  );
  row.appendChild(getCell(station.Location.Name, "td"));
  row.appendChild(getCell(station.Location.Address, "td"));
  row.appendChild(getCell(station.Location.VoterCount, "td"));
  row.appendChild(getCell(station.TotalStatistic.Count, "td"));
  row.appendChild(getCell(station.TotalStatistic.Percentage, "td"));

  return row;
}

function rangeCheckHelper(station, vote_from_s, vote_until_s) {
  if (
    (!vote_from_s.value || station.Location.VoterCount >= vote_from_s.value) &&
    (!vote_until_s.value || station.Location.VoterCount <= vote_until_s.value)
  ) {
    return true;
  }
  return false;
}

function generateTable() {
  const region_s = document.querySelector("#region-list");
  const station_s = document.querySelector("#polling-list");
  const vote_from_s = document.querySelector("#vote-from");
  const vote_until_s = document.querySelector("#vote-until");
  const total_s = document.querySelector("#total");
  const election_day_s = document.querySelector("#election_day");
  const table_s = document.querySelector("table");

  if (isNaN(vote_from_s.value) || isNaN(vote_until_s.value)) {
    alert("You must enter numbers!");
    return;
  }

  table_s.replaceChildren();

  const thead = document.createElement("thead");
  const row = document.createElement("tr");
  row.appendChild(getCell("Region", "th"))
  row.appendChild(getCell("Name", "th"));
  row.appendChild(getCell("Address", "th"));
  row.appendChild(getCell("Total Voters", "th"));
  if(total_s.checked){
    row.appendChild(getCell("Vote Count", "th"));
    row.appendChild(getCell("Percentage Voted", "th"));
  }
  else {
    row.appendChild(getCell("Vote Count on Election Day", "th"));
    row.appendChild(getCell("Percentage Voted on Election Day", "th"));
  }
  thead.appendChild(row);
  table_s.appendChild(thead);

  const tbody = document.createElement('tbody');

  activities.sort((a, b) => {
    if (a.Location.ParentId && b.Location.ParentId) {
      return a.Location.ParentId > b.Location.ParentId ? 1 : -1;
    } else {
      return a.Location.Name > b.Location.Name ? 1 : -1;
    }
  });

  if (station_s.value) {
    const station = activities.find(
      (element) => element.Location.Name === station_s.value
    );
    if (rangeCheckHelper(station, vote_from_s, vote_until_s)) {
      tbody.appendChild(getRow(station));
    }
  } else if (region_s.value) {
    for (const i of activities) {
      if (capitalize(i.Location.ParentId ?? "") === region_s.value) {
        if (rangeCheckHelper(i, vote_from_s, vote_until_s)) {
          tbody.appendChild(getRow(i));
        }
      }
    }
  } else {
    for (const i of activities) {
      if (rangeCheckHelper(i, vote_from_s, vote_until_s)) {
        tbody.appendChild(getRow(i));
      }
    }
  }

  table_s.appendChild(tbody);

  return;
}

window.addEventListener("DOMContentLoaded", (event) => {
  // execute the code when the initial HTML document has been completely loaded, we need the regions select to be loaded

  var lookup = {};

  for (let i in activities) {
    // for every item in the activities - every piece of statistic info
    let region;
    if (activities[i].Location.ParentId)
      region = capitalize(activities[i].Location.ParentId);
    // read region from an activity
    else region = capitalize(activities[i].Location.Id); // read polling station Id from an activity
    let station = activities[i].Location.Name; // read polling station from an activity
    if (region && !(region in lookup)) {
      // if the region hasn't been previously processed
      lookup[region] = {}; // add a new region to the lookup
    }
    lookup[region][station] = 1; // add a station to the lookup. lookup is a two-dimensional associative array/object
  }

  // console.log(lookup); // uncomment this line if you want to see the result in the console

  // now let's get regions for the first select element
  var regions = Object.keys(lookup).sort(); // get the list of keys in the lookup and sort it

  // console.log(regions); // uncomment this line if you want to see the result in the console

  var region_s = document.getElementById("region-list"); // get region select element
  for (let i in regions) {
    // for every region
    let opt = document.createElement("option"); // create a new option
    opt.innerHTML = regions[i]; // fill the text with the region name
    opt.value = regions[i]; // fill the value with the region name
    region_s.appendChild(opt); // add newly created option to the region select
  }

  // to get polling stations for the first region and sort it
  var stations = Object.keys(lookup[regions[0]]).sort(); // if you need to process polling stations in the loop, use loop counter instead of index 0

  // console.log(stations); // uncomment this line if you want to see the result in the console

  // TODO write your code to fill the polling stations select element
  updatePollingStations(lookup);

  region_s.addEventListener("change", function () {
    updatePollingStations(lookup, this.value);
  });

  const button_s = document.querySelector("#show-stats");
  button_s.addEventListener("click", generateTable);
});
