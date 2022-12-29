"use strict";
let data;
const showData = (arr) => {
  const tableBody = document.querySelector("tbody");
  data = arr;
  let tableRow = "";
  for (let i = 0; i < arr.length; i++) {
    let festivales = "";
    let actors = "";
    for (let j = 0; j < arr[i].festivals.length; j++) {
      festivales += `<li>${arr[i].festivals[j]}</li>`;
    }
    for (let k = 0; k < arr[i].actors.length; k++) {
      actors += `<p> 
        ${arr[i].actors[k].name} ${arr[i].actors[k].lastName}, ${arr[i].actors[k].nationality}
        </p>
        `;
    }

    tableRow += `<tr>
        <td scope="row">${arr[i].title}</td>
        <td>${arr[i].runtime}</td>
        <td>${arr[i].director}</td>
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
    showData(arr);
  };
  xhr.open("GET", "movies.json", true);
  xhr.send();
};
window.addEventListener("load", (e) => {
  bringData();
});
const sortArr = (data, ele) => {
  data.sort((a, b) => a.ele.localeCompare(b.ele));
};
const tableHeader = document.querySelector("#tableHead");
tableHeader.addEventListener("click", (e) => {
  if (e.target.id === e.target.dataset.name) {
    console.log("done");
    sortArr(data, e.target.id);
    showData(data);
  }
});
