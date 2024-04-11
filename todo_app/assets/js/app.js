const userSelect = document.getElementById('select-users');
const userContainer = document.getElementById('user-container');
const taskContainer = document.getElementById('task-container');
const showTasksBtn = document.getElementById('show-tasks-btn');

taskContainer.style.display = 'none';
showTasksBtn.style.display = 'none';

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
          <li>Email: ${selectedUser.correo}</li>
        </ul>
      `;
      showTasksBtn.style.display = 'block';
      taskContainer.style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
});

showTasksBtn.addEventListener('click', () => {
  const selectedUserId = parseInt(userSelect.value);
  getAllTasks()
    .then(tasklist => {
      const userTasks = tasklist.filter(tasklist => tasklist.idUser === selectedUserId);
      taskContainer.innerHTML = `
        <h3>Lista de tareas del usuario</h3>
        <ul>
          ${userTasks.map(tasklist => `
            <li>
              <span>${tasklist.title}</span>
              <input type="checkbox" ${tasklist.compleTED ? 'checked' : ''}>
            </li>
          `).join('')}
        </ul>
      `;
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
  return fetch('http://localhost:5000/connection.php')
    .then(resp => resp.json());
}

/**
 * Obtener una lista de todas las tareas que hay de todos los usuarios
 * @returns {Promise<Task[]>}
 */
function getAllTasks() {
  return fetch('http://localhost:5500/tasks.php') // Cambiar la ruta al archivo de tareas
    .then(resp => resp.json());
}
