export default function Tetris(board, landing, tetrominoStream, totalLinesCleared = 0, score = 0, lost = false) {
    const level = Math.floor(totalLinesCleared / 10);
    const speed = Math.max(-1/30 * level + 1, 0.3);
    const lostTetris = () => Tetris(board, landing, tetrominoStream, totalLinesCleared, score, true);

    return {
        board,
        landing,
        level,
        speed,
        score,
        lost,
        tetrominoStream,
        totalLinesCleared,
        
        spawn(tetromino) {
            if (lost) {
                return this;
            }
            
            return board.collides(tetromino)
                ? this
                : Tetris(board, tetromino, tetrominoStream, totalLinesCleared, score);
        },

        step() {
            const futureLanding = landing.fall();
            const collision = board.collides(futureLanding);
            
            if (!collision) {
                return Tetris(board, futureLanding, tetrominoStream, totalLinesCleared, score);
            }

            if (landing.row <= 1) {
                return lostTetris();
            }

            const nextTetromino = tetrominoStream.next().moveBy(0, 3);
            const afterLanding = board.land(landing);
            const fullLines = afterLanding.fullLines;
            const nextScore = score + calcScore(level, fullLines);
            
            return Tetris(afterLanding.clearLines(), nextTetromino, tetrominoStream, totalLinesCleared + fullLines, nextScore);
        }
    };
}

export function calcScore(level, linesCleared) {
    const factor = n => n * (level + 1);

    switch (linesCleared) {
        case 1: return factor(40);
        case 2: return factor(100);
        case 3: return factor(300);
        case 4: return factor(1200);
    }

    return 0;
}