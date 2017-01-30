import Tetromino from "../src/Tetromino";
import Board from "../src/Board";
import Tetris from "../src/Tetris";
import Game from "../src/Game";

export default function main(keyListener, wait, renderGameView) {
    const board = Board.empty(10, 20);
    const stream = Tetromino.Stream.Random();
    const landing = stream.next().moveBy(0, 3);
    const tetris = Tetris(board, landing, stream);
    const game = Game(keyListener, wait, tetris);

    renderGameView(game);

    game.start();
}