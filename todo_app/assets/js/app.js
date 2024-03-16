// Elementos HTML
const userSelect = document.getElementById('select-users');
const userContainer = document.getElementById('user-container');
const taskContainer = document.getElementById('task-container');
const showTasksBtn = document.getElementById('show-tasks-btn');

// Ocultar el contenedor de tareas y el botón para mostrar las tareas inicialmente
taskContainer.style.display = 'none';
showTasksBtn.style.display = 'none';

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Llama a la función para obtener todos los usuarios
  getAllUsers()
    .then(users => {
      // Itera sobre los usuarios y agrega opciones al select
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

// Codígo necesario para mostrar información

// Agregar el evento 'change' al elemento 'userSelect'
userSelect.addEventListener('change', () => {
  // Obtener el ID del usuario seleccionado
  const selectedUserId = parseInt(userSelect.value);

  // Llama a la función para obtener todos los usuarios
  getAllUsers()
    .then(users => {
      // Encuentra el usuario seleccionado
      const selectedUser = users.find(user => user.id === selectedUserId);

      // Mostrar la información del usuario seleccionado en el contenedor
      userContainer.innerHTML = `
        <h3>Información del usuario seleccionado</h3>
        <ul>
          <li>Nombre completo: ${selectedUser.firstname} ${selectedUser.lastname}</li>
          <li>Email: ${selectedUser.email}</li>
        </ul>
      `;

      // Mostrar el botón para mostrar las tareas
      showTasksBtn.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
});

// Agregar el evento 'click' al botón para mostrar las tareas
showTasksBtn.addEventListener('click', () => {
  // Obtener el ID del usuario seleccionado
  const selectedUserId = parseInt(userSelect.value);

  // Llama a la función para obtener todas las tareas
  getAllTasks()
    .then(tasks => {
      // Filtrar las tareas del usuario seleccionado
      const userTasks = tasks.filter(task => task.userId === selectedUserId);

      // Mostrar las tareas del usuario seleccionado en el contenedor
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

      // Mostrar el contenedor de tareas
      taskContainer.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
});

// Funciones
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
