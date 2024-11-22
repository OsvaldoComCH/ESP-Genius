 function enviarSinal(sinal) {

  /*
    const nome = document.getElementById('nome').value; 
    fetch('http://localhost:3000/sinal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sinal: sinal, nome: nome }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sucesso:', data);
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
  */

    fetch(`http://172.16.65.99:80/${sinal}`)
    .then(response => {
        console.log('Status da resposta:', response.status);
        if (!response.ok) {
            throw new Error('Rede não ok');
        }
        return response.json();
    })
    .then((data) => {

      data = {streak: 10, result: 0}

        console.log(data);
        if(data.result == 0)
        {
          //const nome = document.getElementById('nome').value; 
          const nome = "Gustavo"
          fetch('http://localhost:3000/salvar', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ pontuacao: data.streak, nome: nome }) 
          })
          .then(response => response.json())
          .then(data => {
              console.log('Sucesso:', data);
              atualizarLeaderboard();
          })
          .catch((error) => {
              console.error('Erro:', error);
          });
        }
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
  }

document.getElementById('verde').addEventListener('click', () => enviarSinal('verde'));
document.getElementById('amarelo').addEventListener('click', () => enviarSinal('amarelo'));
document.getElementById('vermelho').addEventListener('click', () => enviarSinal('vermelho'));

function atualizarLeaderboard() {
    fetch('http://localhost:3000/leaderboard')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const leaderboardData = document.querySelector('.leaderboard-data');
  
        const leaderboardEntries = data.leaderboard
          .sort((a, b) => b.Score - a.Score)
          .slice(0, 18) 
          .map((entry, index) => {
            return `#${index + 1} - ${entry.Nome}: ${entry.Score}`;
          })
          .join('<br>');
  
        leaderboardData.innerHTML = leaderboardEntries;
      })
      .catch(error => {
        console.error('Houve um problema com a requisição:', error);
      });
}
  
atualizarLeaderboard();
  
setInterval(atualizarLeaderboard, 10000);


