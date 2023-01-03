"use strict";
// data variable ( will be an array ) is declared to store fetched data from the JSON file
let data;
const showData = (arr) => {
  const tableBody = document.querySelector("tbody");
  let tableRow = "";
  for (let i = 0; i < arr.length; i++) {
    let festivales = "";
    let actors = "";
    for (let j = 0; j < arr[i].festivals.length; j++) {
      festivales += `<li>${arr[i].festivals[j]}</li>`;
    }
    for (let k = 0; k < arr[i].actors.length; k++) {
      actors += `<p> 
        ${arr[i].actors[k].name} ${arr[i].actors[k].lastName} from ${arr[i].actors[k].nationality}
        </p>
        `;
    }

    tableRow += `<tr>
        <td scope="row">${arr[i].title}</td>
        <td>${arr[i].director}</td>
        <td>${arr[i].runtime} mins</td>
        <td>${arr[i].year}</td>
        <td> <img src="${arr[i].poster}"></td>
        <td>${festivales}</td>
        <td>${actors}</td>
        </tr>`;
  }
  tableBody.innerHTML = tableRow;
};
// initializing a function for sending http request with a URL parameter
const sendHttpRequest = (url) => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      data = xhr.response;
      showData(data);
    }
  };
  xhr.send();
};
// fetch movies.json when loading the page
window.addEventListener("load", (e) => {
  sendHttpRequest("movies.json");
});
// search for a movie
const searchMovieInput = document.querySelector("#search-input");
searchMovieInput.addEventListener("keyup", (e) => {
  e.preventDefault();
  const searchRegex = new RegExp(`${searchMovieInput.value}`, `gi`);
  if (searchMovieInput.value.length < 1) showData(data);
  else showData(data.filter((movieObj) => movieObj.title.match(searchRegex)));
});
// Sorting depending on which th the user clicked
const tableHeadings = document.querySelectorAll("thead th");
const sortTable = () => {
  tableHeadings.forEach((th) => {
    th.addEventListener("click", () => {
      const thIcon = th.querySelector("i");
      if (
        thIcon.classList.contains("notSorted") ||
        thIcon.classList.contains("sortedDescendally")
      ) {
        sortAscendant(th.id);
        th.innerHTML = `${th.id} <i class="sortedAscendally fa-solid fa-sort-up"></i>`;
      } else if (thIcon.classList.contains("sortedAscendally")) {
        sortDescendant(th.id);
        th.innerHTML = `${th.id} <i class="sortedDescendally fa-solid fa-sort-down"></i>`;
      }
    });
  });
};
sortTable();
// sort Descendanlly
const sortDescendant = (idValue) => {
  data.sort(function (a, b) {
    if (a[idValue].toLowerCase() < b[idValue].toLowerCase()) return 1;
    else if (a[idValue].toLowerCase() > b[idValue].toLowerCase()) return -1;
    else return 0;
  });
  showData(data);
};
// sort Ascendanlly
const sortAscendant = (idValue) => {
  data.sort(function (a, b) {
    if (a[idValue].toLowerCase() > b[idValue].toLowerCase()) return 1;
    else if (a[idValue].toLowerCase() < b[idValue].toLowerCase()) return -1;
    else return 0;
  });
  showData(data);
};
