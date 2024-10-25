import { router, socket } from '../routes.js';

export let players = [];

export default function renderScreen1() {
	const app = document.getElementById('app');

	app.innerHTML = `
        <h1>PLAYERS</h1>
        <p> Jugadores Activos </p>
        <di id= "playerContainer">
        <table>
            <thead>
                <tr>
                    <th id= "nickname">Nickname</th>
                </tr>
            </thead>
            <tbody id="table-body">
                <!-- Filas se insertarán aquí -->
            </tbody>
        </table>
        </di>
        <section>
         <button id="goToScreen2">Ir a Resultados</button>
         </section>
    `;

	// Función para renderizar la tabla de jugadores
	function renderTable(players) {
		const tableBody = document.getElementById('table-body');
		tableBody.innerHTML = ''; // Limpia la tabla antes de agregar los nuevos datos

		players.forEach((player) => {
			const row = document.createElement('tr');
			row.innerHTML = `
								<td>${player.nickname}</td>
						`;
			tableBody.appendChild(row);
		});
	}

	// Escucha el evento del servidor que envía la lista de jugadores
	socket.on('userJoined', (data) => {
		console.log('Datos recibidos del servidor:', data);
		console.log(data);

		players = data;

		renderTable(data); // Pasa los datos recibidos a la función renderTable
	});

	// Navegar a la pantalla de resultados
	const goToScreen2Btn = document.getElementById('goToScreen2');
	goToScreen2Btn.addEventListener('click', () => {
		window.location.hash = '/screen2'; // Cambia la URL
		router.check(); // Fuerza al router a verificar la nueva ruta
	});
}
