// gameHandlers.js

const { assignRoles } = require('../utils/helpers');

// Assuming db and io are required or passed in some way to be accessible
const joinGameHandler = (socket, db, io) => {
	return (user) => {
		db.players.push({ id: socket.id, score: 0, ...user });
		console.log(db.players);
		io.emit(
			'userJoined',
			db.players.sort((a, b) => b.score - a.score)
		);

		// Broadcasts the message to all connected clients including the sender
	};
};

const startGameHandler = (socket, db, io) => {
	return () => {
		db.players = assignRoles(db.players);

		db.players.forEach((element) => {
			io.to(element.id).emit('startGame', element.role);
		});
	};
};

const notifyMarcoHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'polo' || user.role === 'polo-especial');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Marco!!!',
				userId: socket.id,
			});
		});
	};
};

const notifyPoloHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'marco');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Polo!!',
				userId: socket.id,
			});
		});
	};
};

const onSelectPoloHandler = (socket, db, io) => {
	return (userID) => {
		const myUser = db.players.find((user) => user.id === socket.id);
		const poloSelected = db.players.find((user) => user.id === userID);

		if (!poloSelected || !myUser) return;
		if (poloSelected.role === 'polo-especial') {
			db.players.forEach((player) => {
				io.to(player.id).emit('notifyGameOver', {
					message: `El marco ${myUser.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`,
				});
			});
			myUser.score += 50;
			poloSelected.score -= 10;
		} else {
			db.players.forEach((player) => {
				io.to(player.id).emit('notifyGameOver', {
					message: `El marco ${myUser.nickname} ha perdido`,
				});
				if (player.role === 'polo-especial') {
					player.score += 10;
				}
			});
			myUser.score -= 10;
		}

		io.emit(
			'updateScore',
			db.players.sort((a, b) => b.score - a.score)
		);

		const isGreaterThanOneHundred = db.players.find((player) => player.score >= 100);
		io.emit('userWinner', { nickname: 'Nadie' });

		if (isGreaterThanOneHundred) {
			io.emit('userWinner', isGreaterThanOneHundred);

			db.players.forEach((player) => {
				player.score = 0;
			});
		}
	};
};

const disconnectUserHandler = (socket, db, io) => {
	return () => {
		db.players = db.players.filter((player) => player.id !== socket.id);
		io.emit(
			'userJoined',
			db.players.sort((a, b) => b.score - a.score)
		);
	};
};

module.exports = {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
	disconnectUserHandler,
};
