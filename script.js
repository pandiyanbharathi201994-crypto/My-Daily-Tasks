
let tasks = [];
try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (error) {
    console.warn("Tasks could not be read from local storage.", error);
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = task;
        li.appendChild(label);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.onclick = function () {
            tasks.splice(index, 1);
            saveTasks();
        };

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push(task);
    saveTasks();
    input.value = "";
    input.focus();
}

function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        console.warn("Tasks could not be saved.", error);
    }
    displayTasks();
}

document.getElementById("addTaskButton").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTask();
});

displayTasks();

let installPrompt;
const installButton = document.getElementById("installButton");
window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
});
installButton.addEventListener("click", async function () {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
});
window.addEventListener("appinstalled", function () {
    installButton.hidden = true;
    installPrompt = null;
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js").catch(function (error) {
            console.error("Service worker registration failed:", error);
        });
    });
}
