function adicionarNotaNaTela(nota) {
    const li = document.createElement('li');
    li.classList.add('nota-item');

    // Cria o elemento de texto editável
    const span = document.createElement('span');
    span.textContent = nota.conteudo;
    span.contentEditable = true;
    span.classList.add('nota-conteudo');

    // Atualiza no backend quando o conteúdo é editado e perde o foco
    span.addEventListener('blur', async function () {
        const novoConteudo = span.innerText.trim();

        await fetch(`/api/notas/${nota.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conteudo: novoConteudo })
        });
    });

    // Botão de deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-button');

    deleteBtn.onclick = async function (event) {
        event.stopPropagation(); // evita qualquer ação no li
        await fetch(`/api/notas/${nota.id}`, { method: 'DELETE' });
        li.remove();
    };

    // Adiciona elementos à lista
    li.appendChild(span);
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
        body: JSON.stringify({ conteudo: taskText })
    });

    const novaNota = await response.json();
    adicionarNotaNaTela(novaNota);
    input.value = '';
}

// Carrega notas da API ao iniciar
async function loadTasksFromAPI() {
    const response = await fetch('/api/notas');
    const notas = await response.json();
    notas.forEach(adicionarNotaNaTela);
}

// Executa ao carregar a página
window.onload = loadTasksFromAPI;
