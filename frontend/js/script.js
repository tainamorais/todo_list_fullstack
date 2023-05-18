const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
const inputTask = document.querySelector('.input-task');

const URL_BASE = 'http://localhost:3333/tasks/';

const fetchTasks = async () => {
  const response = await fetch(URL_BASE);
  const tasks = await response.json();
  return tasks;
};

const addTask = async (event) => {
  event.preventDefault();

  const task = { title: inputTask.value }

  await fetch(URL_BASE, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  loadTasks();
  inputTask.value = '';
};

const deleteTask = async (id) => {

  await fetch(URL_BASE + id, {
    method: 'delete',
  });

  loadTasks();
};

const updateTask = async (task) => {
  const { id, title, status } = task;

  await fetch(URL_BASE + id, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, status }),
  });

  loadTasks();
};

const formatDate = (dateUTC) => {
  const options = { dateStyle: 'long', timeStyle: 'short' }
  const date = new Date(dateUTC).toLocaleString('pt-br', options);

  return date;
};

const createTr = () => {
  const tr = document.createElement('tr');
  return tr;
};

const createTitle = (task) => {
  const { title } = task;

  const tdTitle = document.createElement('td');
  tdTitle.innerText = title;

  return tdTitle;
};

const createCreatedAt = (task) => {
  const { created_at } = task;

  const tdCreatedAt = document.createElement('td');
  tdCreatedAt.innerText = formatDate(created_at);

  return tdCreatedAt;
};

const createStatus = (task) => {
  const { status } = task;

  const tdStatus = document.createElement('td');
  
  const select = document.createElement('select');
  select.addEventListener('change', ({ target }) => updateTask({ ...task, status:target.value }))

  const options = [
    '<option value="pendente">pendente</option>',
    '<option value="em progresso">em progresso</option>',
    '<option value="concluída">concluída</option>'
  ];

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.innerHTML = option;
    select.add(optionElement);
  });

  select.value = status;

  tdStatus.appendChild(select);
  return tdStatus;
};

const createActions = (task, tdTitle) => {
  const { id, title, status } = task;

  const tdActions = document.createElement('td');

  const editButton = document.createElement('button');
  editButton.classList.add('btn-action');

  editButton.addEventListener('click', () => {
    tdTitle.innerText = '';
    const editForm = document.createElement('form');
    const editInput = document.createElement('input');
    editInput.classList.add('edit-input');
    editForm.addEventListener('submit', (event) => {
      event.preventDefault();
      updateTask({ id, title: editInput.value, status });
    })
    editInput.value = title;
    editForm.appendChild(editInput);
    tdTitle.appendChild(editForm);
  });

  editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn-action');
  deleteButton.addEventListener('click', () => deleteTask(id))
  deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';

  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  return tdActions;
};

const createRow = (task) => {
  const tr = createTr();
  const tdTitle = createTitle(task);
  const tdCreatedAt = createCreatedAt(task);
  const tdStatus = createStatus(task);
  const tdActions = createActions(task, tdTitle);

  tr.appendChild(tdTitle);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdStatus);
  tr.appendChild(tdActions);

  return tr;
};

const loadTasks = async () => {
  const tasks = await fetchTasks();

  tbody.innerHTML = '';

  tasks.forEach((task) => {
    const tr = createRow(task);
    tbody.appendChild(tr);
  })
};

addForm.addEventListener('submit', addTask);

loadTasks();