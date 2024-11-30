"use strict";
// Show modal when the page loads
document.addEventListener("DOMContentLoaded", (event) => {
  var myModal = new bootstrap.Modal(document.getElementById("infoModal"), {
    keyboard: false,
  });
  myModal.show();
});

// ... rest of your existing JavaScript code
// data variable ( will be an array ) is declared to store fetched data from the JSON file
let data;
/**
 * This function takes an array of movie objects and displays them in the table.
 * @param {Array} arr - An array of movie objects
 */
// const showData = (arr) => {
//   const tableBody = document.querySelector("tbody");
//   let tableRow = "";
//   for (let i = 0; i < arr.length; i++) {
//     let festivales = "";
//     let actors = "";
//     for (let j = 0; j < arr[i].festivals.length; j++) {
//       festivales += `<li>${arr[i].festivals[j]}</li>`;
//     }
//     for (let k = 0; k < arr[i].actors.length; k++) {
//       actors += `<p>
//         ${arr[i].actors[k].name} ${arr[i].actors[k].lastName} from ${arr[i].actors[k].nationality}
//         </p>
//         `;
//     }

//     tableRow += `<tr>
//         <td scope="row">${arr[i].title}</td>
//         <td>${arr[i].director}</td>
//         <td>${arr[i].runtime} mins</td>
//         <td>${arr[i].year}</td>
//         <td> <img src="${arr[i].poster}"></td>
//         <td>${festivales}</td>
//         <td>${actors}</td>
//         </tr>`;
//   }

//   tableBody.innerHTML = tableRow;
// };

const showData = (arr) => {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = ""; // Clear the table body
  if (arr.length === 0) {
    // Display message when no movies are found
    const messageRow = document.createElement("tr");
    messageRow.innerHTML = `
      <td colspan="7" class="text-center py-5">
        <h3>No movies found</h3>
        <p>Try adjusting your search criteria</p>
      </td>
    `;
    tableBody.appendChild(messageRow);
    return;
  }

  arr.forEach((movie, index) => {
    const row = document.createElement("tr");
    row.className = "table-row-animation table-row-hidden";

    row.innerHTML = `
      <td scope="row">${movie.title}</td>
      <td>${movie.director}</td>
      <td>${movie.runtime} mins</td>
      <td>${movie.year}</td>
      <td><img src="${movie.poster}" alt="${movie.title} poster"></td>
      <td>${movie.festivals
        .map((festival) => `<li>${festival}</li>`)
        .join("")}</td>
      <td>${movie.actors
        .map(
          (actor) =>
            `<p>${actor.name} ${actor.lastName} from ${actor.nationality}</p>`
        )
        .join("")}</td>
    `;

    tableBody.appendChild(row);

    // Trigger reflow
    row.offsetHeight;

    // Add visible class after a short delay
    setTimeout(() => {
      row.classList.remove("table-row-hidden");
      row.classList.add("table-row-move");
    }, index * 75);
  });
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
    console.log(data);
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
/**
 * This function sets up event listeners for each th element in the table
 * so that when clicked, the table gets sorted by that column in ascending
 * order the first time, then in descending order the second time, and so forth.
 * @function
 */
const sortTable = () => {
  tableHeadings.forEach((th, i) => {
    let isAscending = false;
    th.addEventListener("click", () => {
      /// remove the sorted class from th elements that can sort movies
      tableHeadings.forEach((header, i) => {
        if (i < 4) {
          header.querySelector("i").className = "notSorted fa-solid fa-sort";
        }
      });
      /// add the sorted class to the clicked th element
      const thIcon = th.querySelector("i");
      if (isAscending) {
        sortDescendant(th.id);
        th.innerHTML = `${th.id} <i class="sortedDescendally fa-solid fa-sort-down"></i>`;
        isAscending = false;
        showData(data);
      } else {
        sortAscendant(th.id);
        th.innerHTML = `${th.id} <i class="sortedAscendally fa-solid fa-sort-up"></i>`;
        isAscending = true;
        showData(data);
      }
    });
  });
};
sortTable();
/**
 * Sorts the table in descending order based on the column specified by
 * `idValue`.
 * @param {string} idValue - The id of the column in the table to sort.
 * @returns {undefined}
 */
const sortDescendant = (idValue) => {
  data.sort((a, b) => {
    // Handle numeric values (like runtime or year)
    if (!isNaN(a[idValue]) && !isNaN(b[idValue])) {
      return b[idValue] - a[idValue];
    }
    // Handle string values
    const valueA = String(a[idValue]).toLowerCase();
    const valueB = String(b[idValue]).toLowerCase();
    // Use localeCompare for better string comparison
    return valueB.localeCompare(valueA);
  });

  showData(data);
};
/**
 * Sorts the table in ascending order based on the column specified by
 * `idValue`.
 * @param {string} idValue - The id of the column in the table to sort.
 * @returns {undefined}
 */
const sortAscendant = (idValue) => {
  data.sort(function (a, b) {
    if (!isNaN(a[idValue]) && !isNaN(b[idValue])) {
      return a[idValue] - b[idValue];
    } else {
      // Handle string values
      const valueA = String(a[idValue]).toLowerCase();
      const valueB = String(b[idValue]).toLowerCase();
      // Use localeCompare for better string comparison
      return valueA.localeCompare(valueB);
    }
  });
  showData(data);
};
