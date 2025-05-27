// ========== Task 1: JavaScript Basics & Setup ==========

// Log welcome message to console
console.log("Welcome to the Community Portal");

// Alert on page load
window.onload = () => alert("Welcome to the Community Portal!");

// ========== Task 5: Objects and Prototypes - Event Constructor and Methods ==========

function Event(name, date, seats, category, location) {
  this.name = name;
  this.date = new Date(date);
  this.seats = seats;
  this.category = category;
  this.location = location;
  this.registrations = 0;
}

Event.prototype.checkAvailability = function () {
  const now = new Date();
  return this.date > now && this.seats > this.registrations;
};

// ========== Task 6: Arrays and Methods ==========

// Initial events array
let events = [
  new Event("Jazz Night", "2025-06-15", 30, "Music", "Downtown"),
  new Event("Baking Workshop", "2025-06-20", 15, "Workshop", "Community Center"),
  new Event("City Marathon", "2025-07-01", 100, "Sports", "City Park"),
  new Event("Rock Concert", "2025-06-25", 50, "Music", "Open Arena"),
];

// ========== Task 4: Functions, Scope, Closures, Higher-Order Functions ==========

// Closure to track total registrations for a category
function createCategoryRegistrationTracker() {
  const totals = {};
  return function (category) {
    if (!totals[category]) totals[category] = 0;
    totals[category]++;
    return totals[category];
  };
}
const trackCategoryRegistration = createCategoryRegistrationTracker();

// Add event function
function addEvent(name, date, seats, category, location) {
  const event = new Event(name, date, seats, category, location);
  events.push(event);
  renderEvents(events);
  updateEventSelectOptions();
}

// Register user function
function registerUser(eventName) {
  try {
    const event = events.find((e) => e.name === eventName);
    if (!event) throw new Error("Event not found");
    if (!event.checkAvailability()) throw new Error("No seats available or event passed");

    event.registrations++;
    trackCategoryRegistration(event.category);
    updateEventCard(event);
    return `Successfully registered for ${event.name}`;
  } catch (error) {
    return `Registration failed: ${error.message}`;
  }
}

// Filter events by category with callback
function filterEventsByCategory(category, callback) {
  if (!category) return callback(events);
  const filtered = events.filter((event) => event.category === category);
  callback(filtered);
}

// ========== Task 7: DOM Manipulation ==========

const eventsContainer = document.querySelector("#eventsContainer");
const categoryFilter = document.querySelector("#categoryFilter");
const searchInput = document.querySelector("#searchInput");
const registrationForm = document.querySelector("#registrationForm");
const formMessage = document.querySelector("#formMessage");
const eventSelect = registrationForm.elements["event"];
const loadingSpinner = document.querySelector("#loading");

// Update event cards on UI
function renderEvents(eventList) {
  eventsContainer.innerHTML = "";

  // Filter only upcoming and seats available
  const now = new Date();
  const validEvents = eventList.filter(
    (e) => e.date > now && e.seats > e.registrations
  );

  validEvents.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.id = `event-${event.name.replace(/\s+/g, "")}`;

    // Use template literal for event info (Task 2)
    card.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date.toDateString()}</p>
      <p><strong>Category:</strong> ${event.category}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Seats Left:</strong> ${event.seats - event.registrations}</p>
      <button onclick="handleRegister('${event.name}')" ${!event.checkAvailability() ? "disabled" : ""}>Register</button>
    `;

    eventsContainer.appendChild(card);
  });
}

// Update event card after registration
function updateEventCard(event) {
  const card = document.querySelector(`#event-${event.name.replace(/\s+/g, "")}`);
  if (!card) return;

  const seatsLeft = event.seats - event.registrations;
  card.querySelector("p:nth-child(6)").textContent = `Seats Left: ${seatsLeft}`;

  // Disable button if no seats left
  const btn = card.querySelector("button");
  btn.disabled = !event.checkAvailability();

  // If event is full or passed, remove from DOM (Task 3)
  if (!event.checkAvailability()) {
    card.style.display = "none";
  }
}

// ========== Task 8: Event Handling ==========

// Register button handler
window.handleRegister = function (eventName) {
  const msg = registerUser(eventName);
  formMessage.textContent = msg;
  formMessage.className = msg.startsWith("Successfully") ? "success" : "error";
  updateEventSelectOptions();
};

// Filter onchange
categoryFilter.onchange = function () {
  const category = this.value;
  filterEventsByCategory(category, (filteredEvents) => {
    // Also apply search filter
    const searchText = searchInput.value.trim().toLowerCase();
    const finalFiltered = filteredEvents.filter((event) =>
      event.name.toLowerCase().includes(searchText)
    );
    renderEvents(finalFiltered);
  });
};

// Search on keydown (Task 8)
searchInput.onkeydown = function () {
  // Use timeout to capture input value after key pressed
  setTimeout(() => {
    const searchText = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    filterEventsByCategory(category, (filteredEvents) => {
      const finalFiltered = filteredEvents.filter((event) =>
        event.name.toLowerCase().includes(searchText)
      );
      renderEvents(finalFiltered);
    });
  }, 100);
};

// ========== Task 10: Modern JS Features ==========

// Update event select options dynamically
function updateEventSelectOptions() {
  // Clear old options except the first
  while (eventSelect.options.length > 1) {
    eventSelect.remove(1);
  }
  // Use spread operator to clone array (Task 10)
  const eventListCopy = [...events];
  // Filter only upcoming events with seats
  const validEvents = eventListCopy.filter((event) => event.checkAvailability());

  validEvents.forEach(({ name }) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    eventSelect.appendChild(option);
  });
}

// ========== Task 11: Working with Forms ==========

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.elements["name"].value.trim();
  const email = this.elements["email"].value.trim();
  const selectedEvent = this.elements["event"].value;

  // Validate inputs
  if (!name || !email || !selectedEvent) {
    formMessage.textContent = "Please fill in all fields.";
    formMessage.className = "error";
    return;
  }

  // Simple email validation
  if (!email.includes("@")) {
    formMessage.textContent = "Please enter a valid email.";
    formMessage.className = "error";
    return;
  }

  // Registration logic
  const msg = registerUser(selectedEvent);
  formMessage.textContent = msg;
  formMessage.className = msg.startsWith("Successfully") ? "success" : "error";

  if (msg.startsWith("Successfully")) {
    this.reset();
    updateEventSelectOptions();
  }
});

// ========== Task 9 & 12: Async JS, Promises, Async/Await, AJAX & Fetch API ==========

// Simulate fetching event data from mock API
async function fetchEvents() {
  loadingSpinner.style.display = "block";
  try {
    // Simulate delay with setTimeout wrapped in Promise
    await new Promise((res) => setTimeout(res, 1000));

    // For demo, we use local `events` array as fetched data (normally fetched from server)
    // Could add fetch("mockAPI/events.json") here

    // Show events
    renderEvents(events);
    updateEventSelectOptions();
  } catch (error) {
    alert("Failed to load events");
  } finally {
    loadingSpinner.style.display = "none";
  }
}

// POST registration data to mock API
async function postRegistrationData(data) {
  // Simulate delay & success/failure randomly
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 80% chance success
      if (Math.random() < 0.8) resolve({ status: "success" });
      else reject({ status: "failure" });
    }, 1000);
  });
}

// Override registerUser to POST data on successful registration
async function registerUserWithPost(eventName, userData) {
  try {
    const event = events.find((e) => e.name === eventName);
    if (!event) throw new Error("Event not found");
    if (!event.checkAvailability()) throw new Error("No seats available or event passed");

    event.registrations++;
    trackCategoryRegistration(event.category);
    updateEventCard(event);

    // POST data simulation
    formMessage.textContent = "Submitting registration...";
    formMessage.className = "";
    const response = await postRegistrationData(userData);

    if (response.status === "success") {
      formMessage.textContent = `Successfully registered for ${event.name}`;
      formMessage.className = "success";
    } else {
      throw new Error("Server error");
    }
    updateEventSelectOptions();
  } catch (error) {
    formMessage.textContent = `Registration failed: ${error.message}`;
    formMessage.className = "error";
  }
}

// Use new function in form submit (to include POST)
registrationForm.removeEventListener("submit", () => {}); // Clear old listener

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.elements["name"].value.trim();
  const email = this.elements["email"].value.trim();
  const selectedEvent = this.elements["event"].value;

  if (!name || !email || !selectedEvent) {
    formMessage.textContent = "Please fill in all fields.";
    formMessage.className = "error";
    return;
  }

  if (!email.includes("@")) {
    formMessage.textContent = "Please enter a valid email.";
    formMessage.className = "error";
    return;
  }

  const userData = { name, email, event: selectedEvent };

  registerUserWithPost(selectedEvent, userData).then(() => {
    registrationForm.reset();
  });
});

// ========== Task 13: Debugging & Testing ==========

// Use console.log throughout code to help debug.
// E.g. in registerUserWithPost you can add:
// console.log("Registering user:", userData);
// console.log("Event before registration:", event);
// etc.

// ========== Task 14: jQuery & Frameworks ==========

// Use jQuery to handle register button fade effects
$(document).ready(function () {
  $("#registerBtn").click(function () {
    $(this).fadeOut(100).fadeIn(100);
  });
});

// Benefit of frameworks (React/Vue) - mentioned in comment
// They help organize complex UI into reusable components and manage state efficiently.

// ========== Initialization ==========

fetchEvents();
