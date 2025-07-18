function adicionarNotaNaTela(nota) {
    const li = document.createElement('li');

    // Permite marcar como concluída
    li.addEventListener('click', function () {
        li.classList.toggle('completed');
    });

    // Torna o conteúdo editável
    li.contentEditable = true;
    li.innerText = nota.conteudo;
    li.classList.add('nota-editavel');

    // Atualiza no backend ao sair do campo (blur)
    li.addEventListener('blur', async function () {
        const novoConteudo = li.innerText.replace('X', '').trim(); // Remove botão X visual do texto
        await fetch(`/api/notas/${nota.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conteudo: novoConteudo })
        });
    });

    // Botão de deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = async function (event) {
        event.stopPropagation(); // evita marcar como concluída
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

window.onload = async function () {
    const response = await fetch('/api/notas');
    const notas = await response.json();
    notas.forEach(adicionarNotaNaTela);
};
