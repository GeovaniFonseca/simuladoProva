const formulario = document.querySelector("form");
const formulario2 = document.querySelector(".form2");
const Ilogin = document.querySelector(".login");
const Ipassword = document.querySelector(".password");
const Irole = document.querySelector(".role");

function cadastrar() {
    fetch("http://localhost:8080/auth/register", {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            login: Iilogin.value,
            password: Iipassword.value,
            role: Irole.value,
        })
    }).then(function (res){console.log(res)})
    .catch(function (res){console.log(res)})
}

function exibirToken(token) {
    tokenDisplay.textContent = `Token: ${token}`;
}

function limpar() {
    Ilogin.value = "";
    Ipassword.value = "";
    Irole.value = "";
}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    cadastrar();
    limpar();
});

formulario2.addEventListener("submit", function (event) {
    event.preventDefault();

    login()
        .then((token) => {
            authToken = token; // Armazena o token retornado
            exibirToken(token);
            limpar();
        })
        .catch((error) => {
            console.log(error);
        });
});

const tokenDisplay = document.getElementById('tokenDisplay'); // Elemento onde será exibido o token

// Sua função login() foi modificada para retornar uma Promise com o token
function login() {
    const Iilogin = document.querySelector(".form2 .login");
    const Iipassword = document.querySelector(".form2 .password");

    return fetch("http://localhost:8080/auth/login", {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            login: Iilogin.value,
            password: Iipassword.value,
        })
    }).then(function (res) {
        if (!res.ok) {
            throw new Error('Erro ao fazer login');
        }
        return res.json();
    }).then(function (data) {
        // Armazena o token retornado
        const authToken = data.token;
        console.log("Token:", authToken);
        return authToken; // Retorna o token
    });
}

const formTarefas = document.querySelector(".form3");

// Adicionando um evento para lidar com a submissão do novo formulário
formTarefas.addEventListener("submit", function (event) {
    event.preventDefault();

    // Verifica se há um token válido antes de enviar a tarefa
    if (!authToken) {
        console.log("Token não disponível. Faça o login primeiro.");
        return;
    }

    postarTarefa(authToken); // Envia o token para a função de postagem de tarefa
    limparCamposTarefa();
});

// Função para postar uma nova tarefa
function postarTarefa(token) {
    const inputTitulo = document.querySelector(".title");
    const inputDescricao = document.querySelector(".description");
    const inputConcluido = document.querySelector(".completed");

    const titulo = inputTitulo.value;
    const descricao = inputDescricao.value;
    const concluido = inputConcluido.value;

    fetch("http://localhost:8080/tasks", {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho de autorização
        },
        method: "POST",
        body: JSON.stringify({
            title: titulo,
            description: descricao,
            completed: concluido
        })
    })
    .then(function (res) {
        console.log(res);
        // Lógica adicional após a postagem da tarefa
    })
    .catch(function (res) {
        console.log(res);
        // Lógica adicional em caso de erro
    });
}

// Função para limpar campos do formulário de tarefa após a submissão
function limparCamposTarefa() {
    const inputTitulo = document.querySelector(".title");
    const inputDescricao = document.querySelector(".description");
    const inputConcluido = document.querySelector(".completed");

    inputTitulo.value = "";
    inputDescricao.value = "";
    inputConcluido.value = "";
}