class Todo {
  constructor() {
    // 🔹 Próba wczytania zadań z localStorage
    const saved = localStorage.getItem("tasks");

    if (saved) {
      // jeśli coś już jest zapisane — wczytaj
      this.tasks = JSON.parse(saved);
    } else {
      // jeśli pusto — utwórz 3 przykładowe zadania i zapisz
      this.tasks = [
        { id: crypto.randomUUID(), text: "Zrobić zakupy", date: "2025-10-20" },
        { id: crypto.randomUUID(), text: "Napisać raport", date: "2025-10-25" },
        { id: crypto.randomUUID(), text: "Umówić wizytę u dentysty", date: "2025-11-02" },
      ];
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    // 🔹 Pobranie elementów DOM
    this.tbody = document.getElementById("taskList");
    this.addBtn = document.getElementById("addTaskBtn");
    this.newTaskInput = document.getElementById("newTaskInput");
    this.newTaskDate = document.getElementById("newTaskDate");
    this.searchInput = document.getElementById("searchInput");

    // 🔹 Obsługa zdarzeń
    this.addBtn.addEventListener("click", () => this.addTask());
    this.newTaskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.addTask();
    });
    this.searchInput.addEventListener("input", () => this.draw());

    // 🔹 Pierwsze narysowanie tabeli
    this.draw();
  }

  // 🔹 Zapis do localStorage
  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  // 🔹 Rysowanie tabeli z zadaniami
  draw() {
    this.tbody.innerHTML = "";

    const q = this.searchInput.value.trim().toLowerCase();
    const filtered = this.tasks.filter(task =>
      !q || task.text.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.style.textAlign = "center";
      td.style.padding = "16px";
      td.textContent = this.tasks.length
        ? "Brak pasujących zadań."
        : "Brak zadań — dodaj nowe.";
      tr.appendChild(td);
      this.tbody.appendChild(tr);
      return;
    }

    // 🔹 Tworzenie wierszy tabeli
    filtered.forEach(task => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = task.text;
      tdName.classList.add("task-name");

      const tdDate = document.createElement("td");
      tdDate.textContent = task.date || "";
      tdDate.classList.add("task-date");

      // przycisk EDYTUJ
      const tdEdit = document.createElement("td");
      tdEdit.style.textAlign = "center";
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edytuj";
      editBtn.type = "button";
      editBtn.addEventListener("click", () => this.editTask(task.id));
      tdEdit.appendChild(editBtn);

      // przycisk USUŃ
      const tdDelete = document.createElement("td");
      tdDelete.style.textAlign = "center";
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "Usuń";
      removeBtn.type = "button";
      removeBtn.addEventListener("click", () => this.deleteTask(task.id));
      tdDelete.appendChild(removeBtn);

      tr.appendChild(tdName);
      tr.appendChild(tdDate);
      tr.appendChild(tdEdit);
      tr.appendChild(tdDelete);
      this.tbody.appendChild(tr);
    });
  }

  // 🔹 Dodawanie zadania
  addTask() {
    const text = this.newTaskInput.value.trim();
    const date = this.newTaskDate.value;

    if (text.length < 1) {
      alert("Podaj nazwę zadania.");
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      text,
      date
    };

    this.tasks.push(newTask);
    this.save();
    this.newTaskInput.value = "";
    this.newTaskDate.value = "";
    this.draw();
  }

  // 🔹 Usuwanie zadania
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.save();
    this.draw();
  }

  // 🔹 Edycja zadania (nazwa + data)
  editTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt("Edytuj nazwę zadania:", task.text);
    if (newText === null) return; // anulowano edycję

    const newDate = prompt("Edytuj datę (rrrr-mm-dd):", task.date || "");
    if (newDate === null) return; // anulowano edycję

    if (newText.trim().length === 0) {
      alert("Nazwa zadania nie może być pusta.");
      return;
    }

    task.text = newText.trim();
    task.date = newDate;
    this.save();
    this.draw();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.todo = new Todo();
});