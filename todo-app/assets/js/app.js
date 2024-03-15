alert("seleccione un usuario, por favor");

const userSelect = document.getElementById('select-users');
const userContainer = document.getElementById('user-container');
const taskContainer = document.getElementById('task-container');

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
      return getAllTasks();
    })
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
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// Funciones
/**
 * Obtiene una lista de todos los usuarios que pueden existir
 * @returns {Promise<User[]>}
 */
function getAllUsers() {
  return fetch('/data/usuarios.json')
    .then(resp => resp.json());
}

/**
 * Obtiene una lista de todas las tareas que hay de todos los usuarios
 * @returns {Promise<Task[]>}
 */
function getAllTasks() {
  return fetch('/data/tareas.json') 
    .then(resp => resp.json());
}

/**
 * @typedef User Definición de un usuario
 * @property {number} id Identificador único del usuario
 * @property {string} firstname Primer nombre del usuario
 * @property {string} lastname Apellido del usuario
 * @property {string} email Correo electrónico del usuario
 */

/**
 * @typedef Task Definición de una tarea de usuario
 * @property {number} id Identificador único de la tarea
 * @property {number} userId Identificador del usuario a quien corresponde la tarea
 * @property {string} title Título de la tarea
 * @property {boolean} completed Estado de la tarea si está completada o no
 */
