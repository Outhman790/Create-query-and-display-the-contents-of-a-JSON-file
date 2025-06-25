# 🎬 Movie Explorer

This project loads data from [`movies.json`](movies.json) and displays it in an **interactive movie table**. It’s a lightweight and responsive frontend utility with the following features:

### ✨ Features

* 🔍 **Search** movies by title
* 🔄 **Sort** columns like title, director, runtime, and year
* 📺 **Modal welcome message** on first load

The table structure is defined in `index.html` and styled using **Bootstrap**. Sort icons are powered by **Font Awesome**. Both are loaded via **CDNs**, so there’s no need to install them locally.

---

## 📚 Dependencies

This project uses the following libraries (via CDN):

* [🌟 Bootstrap](https://getbootstrap.com/) — for layout and styling
* [ Font Awesome](https://fontawesome.com/) — for sorting icons and visual elements

---

## 🎓 Learning Objectives

This project helps reinforce the following frontend concepts:

### 📊 DOM Manipulation & Data Display

* Creating and updating tables dynamically from JSON
* Inserting and updating table rows based on filters and sorts

### ⚖️ Client-Side Sorting & Filtering

* Implementing sort logic tied to click events
* Using `includes()` and `toLowerCase()` for real-time search

### 📖 Working with External Data

* Fetching data from `movies.json` using `fetch()` or XHR
* Managing async behavior and display timing (modals, initial state)

### 🎨 UI Libraries

* Integrating Bootstrap layouts and responsive table classes
* Using Font Awesome icons for visual clarity

---

🌟 A great project for practicing frontend logic and working with tabular data!
