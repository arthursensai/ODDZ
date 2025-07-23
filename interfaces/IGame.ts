interface IGame {
  _id: string;
  name: string;
  max_players: number;
  current_players: string[];
}

export default IGame;