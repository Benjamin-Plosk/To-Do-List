function adicionarNotaNaTela(nota) {
    const li = document.createElement('li');

    // Permite marcar como concluída
    li.addEventListener('click', function () {
        li.classList.toggle('completed');
    });

    li.textContent = nota.conteudo;  // aqui mudou de texto para conteudo

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = async function () {
        await fetch(`/api/notas/${nota.id}`, { method: 'DELETE' });
        li.remove();
    };

    li.appendChild(deleteBtn);
    document.getElementById('taskList').appendChild(li);
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') return;

    const response = await fetch('/api/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudo: taskText })  // aqui também conteudo
    });

    const novaNota = await response.json();
    adicionarNotaNaTela(novaNota);
    input.value = '';
}
