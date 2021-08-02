// UI Vars
const addBtn = document.getElementById("addBtn");
const tbody = document.querySelector("tbody");
const input = document.getElementById("new-todo");
const filter = document.getElementById("filter");

// Event Listeners

// Load data from page load
window.addEventListener("load", showTodo);

// Add todo when btn is clicked or enter key is pressed
addBtn.addEventListener("click", addTodo);
input.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    addTodo();
  } else if (key == "Escape") {
    // input.unfocus();
    input.value = "";
  }
});

// Filter todos on keyboard change
filter.addEventListener("keyup", filterTodos);

// Functions
function showTodo() {
  // input.focus();
  // filter.value = "";
  const todos = loadData();
  if (todos !== null && todos.length) {
    tbody.innerHTML = "";
    todos.forEach((todo) => {
      const tr = document.createElement("tr");
      tr.innerHTML = useTemplate(todo.todo, todo.crossedOut);
      tbody.appendChild(tr);
    });
    activateDelBtns();
    activateCrossoutBtns();
  } else {
    notify("no-tasks", false);
  }
}

function addTodo() {
  const input = document.getElementById("new-todo");
  if (input.value.trim()) {
    const todos = loadData();
    let todoExists = false;
    todos.forEach((todo) => {
      if (todo.todo == input.value) {
        todoExists = true;
      }
    });
    if (todoExists) {
      notify("exists", true);
      return;
    } else {
      if (todos === null || !todos.length) {
        tbody.innerHTML = "";
      }
      const tr = document.createElement("tr");
      tr.innerHTML = useTemplate(input.value);
      tbody.appendChild(tr);
      saveData(input.value);
      input.value = "";
      activateDelBtns();
      activateCrossoutBtns();
    }
  } else {
    notify("empty", true);
  }
}

function activateDelBtns() {
  // Adding event listeners to delete buttons
  const delBtns = document.querySelectorAll(".del-btn");
  delBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.parentElement.remove();
      const todos = loadData();
      const newArr = todos.filter((todo) => {
        return !(todo.todo === btn.nextElementSibling.textContent.trim());
      });
      saveData(newArr);
      if (!tbody.innerHTML) {
        notify("to-tasks", false);
      }
    });
  });
}

function activateCrossoutBtns() {
  // Adding event listeners to each todo's texts field
  const tasks = document.querySelectorAll(".tasks");
  tasks.forEach((task) => {
    task.addEventListener("click", () => {
      task.classList.toggle("crossout");
      const todos = loadData();
      todos.forEach((todo) => {
        if (todo.todo == task.innerText) {
          todo.crossedOut = !todo.crossedOut;
        }
      });
      saveData(todos);
    });
  });
}

function filterTodos(e) {
  if (e.key == "Escape") {
    // input.unfocus();
    filter.value = "";
    showTodo();
  } else if (e.target.value.trim()) {
    tbody.innerHTML = "";
    const todos = loadData();
    todos.forEach((todo) => {
      if (todo.todo.includes(e.target.value)) {
        const tr = document.createElement("tr");
        tr.innerHTML = useTemplate(todo.todo, todo.crossedOut);
        tbody.appendChild(tr);
      }
    });
    activateDelBtns();
    activateCrossoutBtns();
    if (!tbody.innerHTML) {
      notify("not-found", false);
    }
  } else {
    showTodo();
  }
}

function saveData(input) {
  if (typeof input == "object") {
    localStorage.setItem("todos", JSON.stringify(input));
  } else if (typeof input == "string") {
    const todos = loadData() || [];
    todos.push({ todo: input, crossedOut: false });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function loadData() {
  return JSON.parse(localStorage.getItem("todos"));
}

function notify(msg, shouldBeRemoved) {
  if (msg == "no-tasks") {
    tbody.innerHTML =
      "<tr><td class='text-center'>There are currently no active tasks</td></tr>";
  } else if (msg == "empty") {
    tbody.innerHTML =
      "<tr><td class='warning text-center'>The todo cannot be empty or whitespace</td></tr>";
  } else if (msg == "exists") {
    tbody.innerHTML =
      "<tr><td class='warning text-center'>The todo already exists!</td></tr>";
  } else if (msg == "not-found") {
    tbody.innerHTML = "<tr><td class='text-center'>No todos found</td></tr>";
  } else {
    tbody.innerHTML =
      "<tr><td class='warning text-center'>Task failed successfully! :)</td></tr>";
  }

  if (shouldBeRemoved) {
    const timeout = setTimeout(() => {
      showTodo();
      clearTimeout(timeout);
    }, 3000);
  }
}

function useTemplate(todo, crossedOut = null) {
  return `
      <td>
          <span class="del-btn">
              <svg enable-background="new 0 0 512 512" height="24" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg"><g><path d="m424 64h-88v-16c0-26.51-21.49-48-48-48h-64c-26.51 0-48 21.49-48 48v16h-88c-22.091 0-40 17.909-40 40v32c0 8.837 7.163 16 16 16h384c8.837 0 16-7.163 16-16v-32c0-22.091-17.909-40-40-40zm-216-16c0-8.82 7.18-16 16-16h64c8.82 0 16 7.18 16 16v16h-96z"/><path d="m78.364 184c-2.855 0-5.13 2.386-4.994 5.238l13.2 277.042c1.22 25.64 22.28 45.72 47.94 45.72h242.98c25.66 0 46.72-20.08 47.94-45.72l13.2-277.042c.136-2.852-2.139-5.238-4.994-5.238zm241.636 40c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16zm-80 0c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16zm-80 0c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16z"/></g></svg>
          </span>
      
          <span class="tasks ${crossedOut ? "crossout" : ""}">
              ${todo}
          </span>
      </td>
      `;
}
