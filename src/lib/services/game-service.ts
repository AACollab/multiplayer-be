import { Game, Player } from "../types";
import { getUniqueId, getUniqueName } from "../utils/utils";

class GameService {
  games: Game[] = [];

  constructor() {
    this.games = [];
  }

  get allGames() {
    return this.games.slice();
  }

  createGame(player: Player) {
    var newGame: Game = {
      id: getUniqueId(),
      name: getUniqueName(),
      player1: player,
    };

    this.games.push(newGame);

    return newGame;
  }

  addPlayerToGame(gameId: string, player: Player) {
    var foundGameIndex = this.games.findIndex((game) => game.id === gameId);

    if (foundGameIndex > -1) {
      var foundGame = this.games[foundGameIndex];
      foundGame.player2 = player;
      this.games.splice(foundGameIndex, 1, foundGame);
    }
  }
}

export default new GameService();
