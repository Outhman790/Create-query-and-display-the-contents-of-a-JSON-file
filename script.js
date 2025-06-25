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
// filteredData will hold search results and is used for pagination
let filteredData = [];
// currentPage keeps track of the page being displayed
let currentPage = 1;
// items to show per page
const itemsPerPage = 10;
// keep track of the latest search query
let searchQuery = "";
/**
 * This function takes an array of movie objects and displays them in the table.
 * @param {Array} arr - An array of movie objects
 */

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
    // Clear pagination when there is no data
    document.querySelector("#pagination-wrapper").innerHTML = "";
    return;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = arr.slice(startIndex, endIndex);

  paginatedItems.forEach((movie, index) => {
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

  // render pagination controls
  renderPagination(arr);
};

/**
 * Render pagination buttons based on the provided array length.
 * @param {Array} arr - array used to calculate total pages
 */
const renderPagination = (arr) => {
  const wrapper = document.querySelector("#pagination-wrapper");
  wrapper.innerHTML = "";

  const totalPages = Math.ceil(arr.length / itemsPerPage);
  if (totalPages <= 1) return; // no need to render buttons

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary m-1";
    btn.textContent = i;
    if (i === currentPage) {
      btn.disabled = true;
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      showData(filteredData);
    });
    wrapper.appendChild(btn);
  }
};
// initializing a function for sending http request with a URL parameter
const sendHttpRequest = (url) => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      data = xhr.response;
      filteredData = [...data];
      currentPage = 1;
      searchQuery = "";
      showData(filteredData);
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
  searchQuery = searchMovieInput.value.trim();
  const searchRegex = new RegExp(`${searchQuery}`, `gi`);
  if (searchQuery.length < 1) {
    filteredData = [...data];
  } else {
    filteredData = data.filter((movieObj) => movieObj.title.match(searchRegex));
  }
  currentPage = 1;
  showData(filteredData);
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
      } else {
        sortAscendant(th.id);
        th.innerHTML = `${th.id} <i class="sortedAscendally fa-solid fa-sort-up"></i>`;
        isAscending = true;
      }
      // refresh filtered data and show first page
      if (searchQuery.length < 1) {
        filteredData = [...data];
      } else {
        const regex = new RegExp(`${searchQuery}`, "gi");
        filteredData = data.filter((movieObj) => movieObj.title.match(regex));
      }
      currentPage = 1;
      showData(filteredData);
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
};
