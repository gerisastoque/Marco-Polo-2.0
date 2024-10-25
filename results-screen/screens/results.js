import { socket } from '../routes.js';
import { players } from './playersList.js';

export default function renderScreen1() {
	const app = document.getElementById('app');
	app.innerHTML = `
        <h1>SCORE</h1>
        <h2>Ganador</h2>
        <h3 id='ganador'>Nadie</h3>
        <p> Puntuacion Jugadores </p>
        <di id= "playerContainer">
        <table>
            <thead>
                <tr>
                    <th id= "nickname">Nickname</th>
                    <th id= "score">Score</th>
                </tr>
            </thead>
            <tbody id="table-body">
                <!-- Filas se insertarán aquí -->
            </tbody>
        </table>
        </di>
        <section>
         <button id="goToScreen1">Ir a Players</button>
         <button id="sortButton">Ordenar alfabeticamente</button>
         </section>
    `;

	const renderPlayers = (sortPlayers) => {
		const tableBody = document.getElementById('table-body');
		tableBody.innerHTML = '';
		sortPlayers.forEach((player) => {
			const row = document.createElement('tr');
			row.innerHTML = `
										<td>${player.nickname}</td>
										<td>${player.score}</td>
								`;
			tableBody.appendChild(row);
		});
	};

	socket.on('userWinner', (data) => {
		const ganador = document.getElementById('ganador');
		ganador.innerHTML = '';
		ganador.innerHTML = data.nickname;
	});

	socket.on('updateScore', (data) => {
		const tableBody = document.getElementById('table-body');
		tableBody.innerHTML = '';
		data.forEach((player) => {
			const row = document.createElement('tr');
			row.innerHTML = `
                <td>${player.nickname}</td>
                <td>${player.score}</td>
            `;
			tableBody.appendChild(row);
		});
	});
	const goToScreen2Btn = document.getElementById('goToScreen1');
	goToScreen2Btn.addEventListener('click', () => {
		window.location.hash = '/'; // Cambia la URL
		router.check(); // Fuerza al router a verificar la nueva ruta
	});

	const sortButton = document.getElementById('sortButton');

	sortButton.addEventListener('click', () => {
		// Ordena los jugadores alfabéticamente
		console.log(data);
		data.sort((a, b) => a.nickname.localeCompare(b.nickname));

		// Vuelve a renderizar la tabla con la lista ordenada
		renderPlayers(data);
	});
}
