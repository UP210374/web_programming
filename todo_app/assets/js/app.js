const userSelect = document.getElementById('select-users');
const userContainer = document.getElementById('user-container');
const taskContainer = document.getElementById('task-container');
const showTasksBtn = document.getElementById('show-tasks-btn');

// Ocultar el contenedor de tareas y el botón de mostrar tareas al cargar la página
taskContainer.style.display = 'none';
showTasksBtn.style.display = 'none';

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  getAllUsers()
    .then(users => {
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.firstname} ${user.lastname}`;
        userSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
});

// Agregar evento 'change' al elemento 'userSelect'
userSelect.addEventListener('change', () => {
  const selectedUserId = parseInt(userSelect.value);
  getAllUsers()
    .then(users => {
      const selectedUser = users.find(user => user.id === selectedUserId);
      userContainer.innerHTML = `
        <h3>Información del usuario seleccionado</h3>
        <ul>
          <li>Nombre completo: ${selectedUser.firstname} ${selectedUser.lastname}</li>
          <li>Email: ${selectedUser.email}</li>
        </ul>
      `;
      showTasksBtn.style.display = 'block';
      // Ocultar el contenedor de tareas al seleccionar un nuevo usuario
      taskContainer.style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
});

// Agregar evento 'click' al botón para mostrar las tareas
showTasksBtn.addEventListener('click', () => {
  const selectedUserId = parseInt(userSelect.value);
  getAllTasks()
    .then(tasks => {
      const userTasks = tasks.filter(task => task.userId === selectedUserId);
      taskContainer.innerHTML = `
        <h3>Lista de tareas del usuario</h3>
        <ul>
          ${userTasks.map(task => `
            <li>
              <span>${task.title}</span>
              <input type="checkbox" ${task.completed ? 'checked' : ''}>
            </li>
          `).join('')}
        </ul>
      `;
      // Mostrar el contenedor de tareas al hacer clic en el botón
      taskContainer.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
});

/**
 * Obtener una lista de todos los usuarios que pueden existir
 * @returns {Promise<User[]>}
 */
function getAllUsers() {
  return fetch('/data/usuarios.json')
    .then(resp => resp.json());
}

/**
 * Obtener una lista de todas las tareas que hay de todos los usuarios
 * @returns {Promise<Task[]>}
 */
function getAllTasks() {
  return fetch('/data/tareas.json') // Cambiar la ruta al archivo de tareas
    .then(resp => resp.json());
}
