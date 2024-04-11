import { deleteTask, createTask, getAllUsers, getTaskUsingUserID, getTask, updateTask } from "./petitions.js";

const listUsers = document.getElementById('users');
const taskTable = document.getElementById('tasks');
const taskForm = document.getElementById('form-task');
const formTitle = document.getElementById('form-title')
const completedCheckbox = document.getElementById('completed');
const submitButton = document.getElementById('insert');
let pressedButtonId;
let isInsert = true;

document.addEventListener('DOMContentLoaded', async () => {
    const allUsers = await getAllUsers();
    let optionsHTML = "";
    allUsers.forEach(user => {
        optionsHTML += `<option value="${user.id}">${user.fullname}</option>`;
    });
    listUsers.innerHTML = optionsHTML;
});

listUsers.addEventListener('change', async () => {
    const userTasks = await getTaskUsingUserID(listUsers.value);
    updateTaskTable(userTasks);
});

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm);
    const completedValue = completedCheckbox.checked ? 1 : 0;
    formData.append('completed', completedValue);

    if (isInsert) {
        try {
            const response = await createTask(formData);
            if (response.success) {
                const taskInfo = response.taskInfo;
                appendTaskToTable(taskInfo);
                taskForm.reset();
            } else {
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error in INSERTING:', error);
        }
    } else {
        try {
            const response = await updateTask(formData, pressedButtonId);
            if (response.success) {
                const taskInfo = await getTask(pressedButtonId);
                updateTaskInTable(taskInfo);
                taskForm.reset();
            } else {
                console.error("Response unsuccessful, failed to update task")
            }
        } catch (error) {
            console.error('Error in UPDATING:', error);
        }
    }
});

function updateTaskTable(tasks) {
    let template = "";
    tasks.forEach(task => {
        const taskCompleted = task.completed ? 'Completada' : 'Sin completar';
        template += `
            <tr id="tablerow${task.id}">
                <td>${task.id}</td>
                <td>${task.firstname}</td>
                <td>${task.title}</td>
                <td>${taskCompleted}</td>
                <td>
                    <button class="btn btn-info btn-sm updateBtn" id="updateBtn${task.id}">
                        <span>Update</span> <i class="nf nf-md-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm deleteBtn" id="deleteBtn${task.id}">
                        <span>Delete</span> <i class="nf nf-cod-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
    taskTable.children[1].innerHTML = template;
    addDeleteButtonEvents();
    addUpdateButtonEvents();
}

function appendTaskToTable(taskInfo) {
    const taskCompleted = taskInfo.completed ? 'Completada' : 'Sin completar';
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${taskInfo.id}</td>
        <td>${taskInfo.firstname}</td>
        <td>${taskInfo.title}</td>
        <td>${taskCompleted}</td>
        <td>
            <button class="btn btn-info btn-sm updateBtn" id="updateBtn${taskInfo.id}">
                <span>Update</span> <i class="nf nf-md-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm deleteBtn" id="deleteBtn${taskInfo.id}">
                <span>Delete</span> <i class="nf nf-cod-trash"></i>
            </button>
        </td>
    `;
    taskTable.children[1].appendChild(newRow);
    addDeleteButtonEvents();
    addUpdateButtonEvents();
}

function updateTaskInTable(taskInfo) {
    const taskCompleted = taskInfo.completed ? 'Completada' : 'Sin completar';
    const rowToUpdate = document.getElementById(`tablerow${pressedButtonId}`);
    rowToUpdate.innerHTML = `
        <td>${taskInfo.id}</td>
        <td>${taskInfo.firstname}</td>
        <td>${taskInfo.title}</td>
        <td>${taskCompleted}</td>
        <td>
            <button class="btn btn-info btn-sm updateBtn" id="updateBtn${taskInfo.id}">
                <span>Update</span> <i class="nf nf-md-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm deleteBtn" id="deleteBtn${taskInfo.id}">
                <span>Delete</span> <i class="nf nf-cod-trash"></i>
            </button>
        </td>
    `;
    addDeleteButtonEvents();
    addUpdateButtonEvents();
}

function addUpdateButtonEvents() {
    const updateButtons = document.querySelectorAll('.updateBtn');
    updateButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault()
            const taskId = button.id.replace('updateBtn', '');
            const taskInfo = await getTask(taskId);
            const taskCheck = taskInfo.completed ? 'true' : '';
            taskForm.children[0].children[0].value = taskInfo.title;
            formTitle.innerText = "Modificar tarea";
            completedCheckbox.checked = taskInfo.completed;
            submitButton.innerText = "Actualizar";
            isInsert = false;
            pressedButtonId = taskId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
    });
}

function addDeleteButtonEvents() {
    const deleteButtons = document.querySelectorAll('.deleteBtn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const taskId = button.id.replace('deleteBtn', '');
            const row = document.getElementById(`tablerow${taskId}`);
            row.remove();
            await deleteTask(taskId);
        });
    });
}
