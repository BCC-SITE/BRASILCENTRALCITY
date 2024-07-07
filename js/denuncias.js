const authorizedIPs = ["SEU_IP1", "SEU_IP2", "SEU_IP3"]; // Substitua pelos IPs autorizados

document.getElementById('denunciaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const categoria = document.getElementById('categoria').value;
    const nome = document.getElementById('nome').value;
    const detalhes = document.getElementById('detalhes').value;

    const denuncia = {
        categoria,
        nome,
        detalhes,
        status: 'Pendente',
        data: new Date().toLocaleString()
    };

    let denuncias = localStorage.getItem('denuncias');
    if (denuncias) {
        denuncias = JSON.parse(denuncias);
    } else {
        denuncias = [];
    }

    denuncias.push(denuncia);
    localStorage.setItem('denuncias', JSON.stringify(denuncias));
    document.getElementById('denunciaForm').reset();
    exibirDenuncias();
});

document.getElementById('openAdminPanel').addEventListener('click', function() {
    document.getElementById('adminPanel').style.display = 'block';
});

document.getElementById('clearDatabase').addEventListener('click', function() {
    const ip = document.getElementById('adminIP').value;
    if (authorizedIPs.includes(ip)) {
        localStorage.removeItem('denuncias');
        alert('Banco de dados de denúncias limpo com sucesso!');
        document.getElementById('logs').innerHTML = '<p>Nenhuma denúncia registrada.</p>';
    } else {
        alert('IP não autorizado.');
    }
});

document.getElementById('adminLogin').addEventListener('click', function() {
    const ip = document.getElementById('adminIP').value;
    if (authorizedIPs.includes(ip)) {
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('denunciasPanel').style.display = 'block';
        exibirDenuncias();
    } else {
        alert('IP não autorizado.');
    }
});

document.getElementById('filtroCategoria').addEventListener('change', function() {
    exibirDenuncias();
});

function exibirDenuncias() {
    const logsDiv = document.getElementById('logs');
    let denuncias = localStorage.getItem('denuncias');
    if (denuncias) {
        denuncias = JSON.parse(denuncias);
        const filtroCategoria = document.getElementById('filtroCategoria').value;
        logsDiv.innerHTML = '';

        denuncias.forEach(denuncia => {
            if (filtroCategoria === 'todos' || denuncia.categoria === filtroCategoria) {
                const logEntry = document.createElement('div');
                logEntry.classList.add('log-entry');
                logEntry.innerHTML = `
                    <p><strong>Data:</strong> ${denuncia.data}</p>
                    <p><strong>Categoria:</strong> ${denuncia.categoria}</p>
                    <p><strong>Nome:</strong> ${denuncia.nome}</p>
                    <p><strong>Detalhes:</strong> ${denuncia.detalhes}</p>
                    <p><strong>Status:</strong> ${denuncia.status}</p>
                    <button onclick="marcarAtendido('${denuncia.data}')">Marcar como Atendido</button>
                    <hr>
                `;
                logsDiv.appendChild(logEntry);
            }
        });
    } else {
        logsDiv.innerHTML = '<p>Nenhuma denúncia registrada.</p>';
    }
}

function marcarAtendido(data) {
    let denuncias = localStorage.getItem('denuncias');
    if (denuncias) {
        denuncias = JSON.parse(denuncias);
        denuncias.forEach(denuncia => {
            if (denuncia.data === data) {
                denuncia.status = 'Atendido';
            }
        });
        localStorage.setItem('denuncias', JSON.stringify(denuncias));
        exibirDenuncias();
    }
}
