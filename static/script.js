async function chamarAPI() {
    const response = await fetch('/api/mensagem');
    const data = await response.json();
    alert(data.msg);
}

// Carrega as notas salvas do banco de dados ao iniciar
window.onload = async function () {
    await carregarNotas();
};

async function carregarNotas() {
    const response = await fetch('/api/notas');
    const notas = await response.json();

    notas.forEach(nota => adicionarNotaNaTela(nota));
}

function adicionarNotaNaTela(nota) {
    const li = document.createElement('li');

    // Permite marcar como concluída
    li.addEventListener('click', function () {
        li.classList.toggle('completed');
    });

    li.textContent = nota.texto;

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
        body: JSON.stringify({ texto: taskText })
    });

    const novaNota = await response.json();
    adicionarNotaNaTela(novaNota);
    input.value = '';
}
