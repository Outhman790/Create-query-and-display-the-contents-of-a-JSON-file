"use strict";
// data variable ( will be an array ) is declared to store fetched data from the JSON file
let data;
const showData = (arr) => {
  const tableBody = document.querySelector("tbody");
  // data = arr;
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
const bringData = function () {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    let arr = JSON.parse(this.responseText);
    data = arr;
    showData(arr);
  };
  xhr.open("GET", "movies.json", true);
  xhr.send();
};
window.addEventListener("load", (e) => {
  bringData();
});
// I was trying to do a function to sort all the table header elements but it didn't work
// const sortArr = (data, ele) => {
//   data.sort((a, b) => a.ele.localeCompare(b.ele));
// };
// const tableHeader = document.querySelector("#tableHead");
// tableHeader.addEventListener("click", (e) => {
//   if (e.target.id === e.target.dataset.name) {
//     console.log("done");
//     sortArr(data, e.target.id);
//     showData(data);
//   }
// });
// sort movies titles
const movieTitleTh = document.querySelector("#title");
let moviesSortedByTitle = false;
movieTitleTh.addEventListener("click", (e) => {
  if (!moviesSortedByTitle) {
    data.sort((a, b) => a.title.localeCompare(b.title));
    moviesSortedByTitle = true;
  } else {
    data.reverse();
  }
  showData(data);
});
// sort movie directors
const movieDirectorTh = document.querySelector("#director");
let moviesSortedByDirector = false;
movieDirectorTh.addEventListener("click", (e) => {
  if (!moviesSortedByDirector) {
    data.sort((a, b) => a.director.localeCompare(b.director));
    moviesSortedByDirector = true;
  } else {
    data.reverse();
  }
  showData(data);
});
// sort movies duration
const movieDurationTh = document.querySelector("#runtime");
let moviesSortedByDuration = false;
movieDurationTh.addEventListener("click", (e) => {
  if (!moviesSortedByDuration) {
    data.sort((a, b) => a.runtime - b.runtime);
    moviesSortedByDuration = true;
  } else {
    data.reverse();
  }
  showData(data);
});
// sort movies production date
const movieProductionDateTh = document.querySelector("#year");
let moviesSortedByDate = false;
movieProductionDateTh.addEventListener("click", (e) => {
  if (!moviesSortedByDate) {
    data.sort((a, b) => a.year - b.year);
    moviesSortedByDate = true;
  } else {
    data.reverse();
  }
  showData(data);
});
// search for a movie
const searchMovieInput = document.querySelector("#search-input");
searchMovieInput.addEventListener("keyup", (e) => {
  e.preventDefault();
  const searchRegex = new RegExp(`${searchMovieInput.value}`, `gi`);
  if (searchMovieInput.value.length < 1) showData(data);
  else showData(data.filter((movieObj) => movieObj.title.match(searchRegex)));
});
