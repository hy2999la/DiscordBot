import { v4 as uuid } from 'uuid';

import constants from '../../utils/constants.js';
const { APEX } = constants;

class Lobby {
	constructor() {
		this.lobbyInteraction = null;
		this.lobbyUsers = {};
		this.lobbyId = 0;
	}

	async initLobby(member, empty) {
		if (this.lobbyInteraction != null) {
			console.log('Closing lobby');
			console.log('=============================');

			try {
				const message = await this.lobbyInteraction.fetchReply();
				if (message.partial) {
					const messageFetched = await message.fetch();
					await messageFetched.edit({ content: 'Lobby Outdated', components: [] });
				}
				else {
					await message.edit({ content: 'Lobby Outdated', components: [] });
				}
			}
			catch(err) {
				console.error(err);
			}
		}

		this.clearLobby();
		const lobbyId = uuid();
		this.lobbyId = lobbyId;

		console.log('Creating lobby');
		console.log('=============================');

		if (!empty) {
			this.addUser(member);
		}

		return lobbyId;
	}

	setLobbyInteraction(message) {
		this.lobbyInteraction = message;
	}

	containsUser(member) {
		return this.lobbyUsers[member.user.username] != null;
	}

	addUser(member) {
		// if (this.lobbyUsers[member.user.username] == null) {
		console.log(`Adding ${member.nickname} to current lobby`);
		this.lobbyUsers[member.user.username] = member.user.id;
		return Object.keys(this.lobbyUsers).length == APEX.LOBBY_SIZE;
		// }
		// else {
		// 	console.log(`${member.nickname} already exist in lobby`);
		// }
	}

	removeUser(member) {
		if (this.lobbyUsers[member.user.username] != null) {
			console.log(`Removing ${member.nickname} from current lobby`);
			delete this.lobbyUsers[member.user.username];
		}
		else {
			console.log(`${member.nickname} is not in the lobby`);
		}
	}

	clearLobby() {
		this.lobbyInteraction = null;
		this.lobbyUsers = {};
	}

	checkLobbyId(lobbyId) {
		return this.lobbyId == lobbyId;
	}

	onReact(r, user) {
		const msg = r.message.toString();
		const foundGuildMember = r.message.guild.member(user);
		if (this.addUser(foundGuildMember)) {
			if (Object.keys(this.lobbyUsers).length == APEX.LOBBY_SIZE) {
				console.log('Current Lobby is now full, deleting old message and pinging current lobby users');
				this.lobbyMessage.delete();
				let startMsg = 'Game is starting: ';
				for (const lobbyUser in this.lobbyUsers) {
					startMsg += `<@${this.lobbyUsers[lobbyUser]}> /`;
				}
				startMsg = startMsg.slice(0, -2);
				startMsg += '. GL';
				this.lobbyMessage.channel.send(startMsg);
				console.log('=============================');

				this.clearLobby();
			}
			else {
				const newMsg = msg.replace('Free', foundGuildMember.displayName);
				this.lobbyMessage.edit(newMsg);
			}
		}
	}
}

const instance = new Lobby();
export default instance;

