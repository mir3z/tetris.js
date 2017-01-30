import blessed from "blessed";

export default function createGameRenderer(game) {
    const renderer = ConsoleRenderer();

    game.onUpdate(state => renderer.render(state));

    renderer.render(game.state);
}

function ConsoleRenderer() {
    const screen = blessed.screen({
        smartCSR: true
    });

    screen.key(["escape", "q", "C-c"], () => process.exit(0));

    function update({ tetris, clearing }) {
        const board = Board({ ...{ ...tetris, clearing } });
        const stats = Stats({ ...tetris });

        screen.append(board);
        screen.append(stats);

        return screen;
    }

    return {
        render(state) {
            update(state).render();
        }
    };
}

function Block(value, row, col, clearing) {
    const colorMap = {
        1: "#008B8B",
        2: "#FFFF00",
        3: "#800080",
        4: "#1E90FF",
        5: "#FF8C00",
        6: "#008000",
        7: "#B22222"
    };

    return blessed.box({
        top: row,
        left: col * 2,
        width: 2,
        height: 1,
        content: clearing ? "▒▒" : "",
        style: {
            fg: "#fff",
            bg: colorMap[value]
        }
    });
}

function Board({ board, landing, lost, clearing }) {
    const width = board.width * 2 + 2;
    const height = board.height + 2;

    const box = blessed.box({
        top: "center",
        left: `50%-${width}`,
        width,
        height,
        border: {
            type: "bg"
        },
        style: {
            fg: "#fff",
            bg: "#000",
            border: {
                fg: "#fff",
                bg: "#fff"
            }
        }
    });

    if (lost) {
        box.append(Board.GameOver(width - 2, height - 2));
        return box;
    }

    const combined = landing ? board.land(landing) : board;

    const cells = combined.landed.reduce((acc, row, rowIdx) => {
        const fullRow = clearing && row.full;
        const rowCells = row.cells.map((value, colIdx) => value ? Block(value, rowIdx, colIdx, fullRow) : null);
        return acc.concat(rowCells.filter(cell => !!cell));
    }, []);

    cells.forEach(cell => box.append(cell));

    return box;
}

Board.GameOver = (width, height) => {
    const box = blessed.box({
        top: 0,
        left: 0,
        width,
        height,
        style: {
            bg: "#f00"
        }
    });

    box.append(blessed.text({
        top: "center",
        left: "center",
        tags: true,
        content: "{bold}GAME OVER{/bold}",
        style: {
            bg: "#f00"
        }
    }));

    return box;
};

function Stats({ level, score, totalLinesCleared, tetrominoStream }) {
    const box = blessed.box({
        top: "center",
        left: "50%+2",
        width: 20,
        height: 16
    });

    box.append(Stats.ScoreLabel(score));
    box.append(Stats.LinesLabel(totalLinesCleared));
    box.append(Stats.LevelLabel(level));
    box.append(Stats.NextTetromino(tetrominoStream.peek()));

    return box;
}

Stats.ScoreLabel = (score, left = 1, top = 0) => (
    blessed.text({
        top,
        left,
        tags: true,
        content: `{bold}Score:{/bold} ${ score }`
    })
);

Stats.LinesLabel = (linesCleared, left = 1, top = 2) => (
    blessed.text({
        top,
        left,
        tags: true,
        content: `{bold}Lines:{/bold} ${ linesCleared }`
    })
);

Stats.LevelLabel = (level, left = 1, top = 4) => (
    blessed.text({
        top,
        left,
        tags: true,
        content: `{bold}Level:{/bold} ${ level }`
    })
);

Stats.NextTetromino = (tetromino, left = 1, top = 6) => {
    const box = blessed.box({
        top,
        left,
        width: 10,
        height: 6,
        style: {
            fg: "#fff",
            border: {
                fg: "#f00"
            }
        }
    });

    box.append(blessed.text({
        tags: true,
        content: "{bold}Next:{/bold}"
    }));

    tetromino.forEach(({ value, row, col }) => {
        box.append(Block(value, row + 2, col));
    });

    return box;
};