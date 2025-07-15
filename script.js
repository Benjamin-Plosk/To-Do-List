function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();

  if (taskText === '') return;

  const li = document.createElement('li');

  // Added as concluded 
  li.addEventListener('click', function () {
    li.classList.toggle('completed');
  });

  li.textContent = taskText;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.onclick = function () {
    li.remove();
  };

  li.appendChild(deleteBtn);

  document.getElementById('taskList').appendChild(li);
  input.value = '';
}
