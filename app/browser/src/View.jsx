import { h, render, Component } from "preact";

import "./View.scss";

export const createGameRenderer = root => game => {
    const GameView = createGameView(game);
    render(<GameView />, root);
};

export default function createGameView(game) {

    class Wrapper extends Component {
        constructor(props) {
            super(props);
            this.state = game.state;
        }

        componentDidMount() {
            game.onUpdate(state => this.setState(state));
        }

        render() {
            return <Game { ...this.state } />;
        }
    }

    return Wrapper;
}

export const Game = ({ tetris, clearing }) => (
    <div className="game">
        <Stored { ...tetris } />
        <Board { ...{ ...tetris, clearing } } />
        <Stats { ...tetris } />
    </div>
);

export const Board = ({ board, landing, lost, clearing }) => {
    const renderRow = row => (
        <Row isFull={ clearing && row.full }>
            { row.cells.map(value => <Block value={ value } />) }
        </Row>
    );
    const combined = landing ? board.land(landing) : board;

    return (
        <div className="board">
            { lost && <LostGame /> }
            { combined.landed.map(renderRow) }
        </div>
    );
};

export const Stats = ({ level, score, totalLinesCleared, tetrominoStream }) => (
    <div className="stats">
        <StatsSection title="Score">{ score }</StatsSection>
        <StatsSection title="Lines">{ totalLinesCleared }</StatsSection>
        <StatsSection title="Level">{ level }</StatsSection>
        <StatsSection title="Next">
            <NextTetromino { ...{ tetrominoStream } } />
        </StatsSection>
        <Tetris />
    </div>
);

export const Stored = ({ stored }) => (
    <div className="stats">
        <StatsSection title="Stored">
            <StoredTetromino { ...{ stored } }></StoredTetromino>
        </StatsSection>
    </div>
);

export const StatsSection = ({ className, title, children }) => (
    <div className={ cls(className, "section") }>
        <div className="title">{ title }</div>
        <div className="value">{ children }</div>
    </div>
);

export const NextTetromino = ({ tetrominoStream }) => {
    const grid = [];

    tetrominoStream.peek().forEach(({ value, row, col }) => {
        grid[row] = grid[row] || [];
        grid[row][col] = value;
    });

    const renderRow = row => (
        <Row>
            { mapOverSparse(row, value => <Block value={ value } />) }
        </Row>
    );

    return (
        <div className="next">
            <div className="next-wrapper">
                { grid.map(renderRow) }
            </div>
        </div>
    );
};

export const StoredTetromino = ({ stored }) => {
    const grid = [];

    if (!stored) {
        return (
            <div className="stored">
                <div className="stored-wrapper">
                    
                </div>
            </div>
        );
    }

    stored.forEach(({ value, row, col }) => {
        grid[row] = grid[row] || [];
        grid[row][col] = value;
    });

    const renderRow = row => (
        <Row>
            { mapOverSparse(row, value => <Block value={ value } />) }
        </Row>
    );

    return (
        <div className="stored">
            <div className="stored-wrapper">
                { grid.map(renderRow) }
            </div>
        </div>
    );
};

export const LostGame = () => <div className="lost">Game<br />Over</div>;
export const Row = ({ isFull, children }) => <div className={ cls("row", isFull && "full") }>{ children }</div>;
export const Block = ({ value }) => <div className={ cls("block", value && "b", value && ("b-" + value)) } >&nbsp;</div>;
export const Tetris = () => <div className="tetris-intro">Tetris</div>;

export const cls = (...args) => args.filter(arg => !!arg).join(" ").trim();

export const mapOverSparse = (iterable, fn) => {
    const clone = [];

    for (let value of iterable) {
        clone.push(fn(value));
    }

    return clone;
};