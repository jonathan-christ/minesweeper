import type { GameState, TileProps, Difficulty } from "./types";
import { writable, type Writable } from 'svelte/store';
import { DIFFICULTY_SETUP } from "./constants";
import { Sound } from "./audio";

const tntSound = new Sound('/audio/tnt.ogg', { volume: 0.5 });
const loseSound = () => {
    tntSound.play();
    setTimeout(() => {
        tntSound.play();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                tntSound.play();
            }, 125*i);
        }
    }, 1000);
}

export class GameController {
    private width: number = 0;
    private height: number = 0;
    private score: number = 0;

    private totalMines: number = 0;
    private totalNonMineTiles: number = 0;
    private revealedNonMineTiles: number = 0;
    private flags: number = 0;

    private startTime: Date | null = null;
    private totalTime: number = 0; //seconds
    private timerInterval: number | null = null;
    public timer: Writable<number> = writable(0);

    private state: Writable<GameState> = writable("start");
    private stateCache: GameState = "start";
    private difficulty: Difficulty;
    private difficultySetup: typeof DIFFICULTY_SETUP;

    public tiles: Writable<TileProps[][]>;
    private tilesCache: TileProps[][] = [];

    constructor(difficulty: Difficulty = "easy", difficultySetup: typeof DIFFICULTY_SETUP = DIFFICULTY_SETUP) {
        this.difficulty = difficulty;
        this.difficultySetup = difficultySetup;
        this.tiles = writable([]);

        this.tiles.subscribe(tiles => {
            this.tilesCache = tiles;
        });

        this.state.subscribe(state => {
            this.stateCache = state;
            if (state === "playing") {
                this.startTimer();
            } else {
                this.stopTimer();
            }
        });

        this.setupGame();
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getState() {
        return this.stateCache;
    }

    public getScore() {
        return this.score;
    }

    public getDifficulty() {
        return this.difficulty;
    }

    public getTotalMines() {
        return this.totalMines;
    }

    public getFlags() {
        return this.flags;
    }

    public getTime() {
        if (this.startTime && this.stateCache === "playing") {
            // Calculate current elapsed time while playing
            const now = new Date();
            return Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
        }
        return this.totalTime;
    }

    public getStartTime() {
        return this.startTime;
    }

    public getTiles() {
        return this.tilesCache;
    }

    public getTile(x: number, y: number): TileProps | undefined {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return undefined;
        return this.tilesCache[y]?.[x];
    }

    public getTimer() {
        return this.timer;
    }

    public setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.setupGame();
    }

    public setDifficultySetup(setup: typeof DIFFICULTY_SETUP) {
        this.difficultySetup = setup;
        this.setupGame();
    }

    public resetGame() {
        this.setupGame();
    }

    private setupGame() {
        const difficulty = this.difficultySetup[this.difficulty];
        this.totalMines = difficulty.mines;
        this.totalNonMineTiles = difficulty.width * difficulty.height - difficulty.mines;
        this.width = difficulty.width;
        this.height = difficulty.height;
        this.revealedNonMineTiles = 0;
        this.flags = this.totalMines;
        this.startTime = null;
        this.totalTime = 0;

        this.timer.set(0);
        this.state.set("start");
        this.generateTiles();
    }

    private startTimer() {
        if (this.timerInterval) return; // Already running

        this.timerInterval = setInterval(() => {
            if (this.startTime && this.stateCache === "playing") {
                const currentTime = this.getTime();
                this.timer.set(currentTime);
            }
        }, 1000) as unknown as number;
    }

    private stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private fillBoard(x_start: number, y_start: number) {
        this.generateMines(x_start, y_start);
        this.calculateMineCount();
        this.state.set("playing");
        this.startTime = new Date();
    }

    private generateTiles() {
        const newTiles: TileProps[][] = [];
        for (let i = 0; i < this.height; i++) {
            newTiles.push(new Array(this.width).fill(null).map(() => ({
                isMine: false,
                isRevealed: false,
                mineCount: 0,
                isFlagged: false,
                onclick: () => { }
            })));
        }
        this.tiles.set(newTiles);
    }

    private generateMines(x_start: number, y_start: number) {
        const mineCoords = new Set<string>();
        const avoidTiles = new Set<string>();

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const x = x_start + j;
                const y = y_start + i;
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    avoidTiles.add(`${x},${y}`);
                }
            }
        }

        // Generate mines
        while (mineCoords.size < this.totalMines) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const coordKey = `${x},${y}`;

            if (!avoidTiles.has(coordKey) && !mineCoords.has(coordKey)) {
                mineCoords.add(coordKey);
                this.tilesCache[y][x].isMine = true;
            }
        }

        this.tiles.set(this.tilesCache);
    }

    private calculateMineCount() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tilesCache[y][x].isMine) continue;
                let count = 0;

                // Check surrounding tiles
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;

                        const nx = x + dx;
                        const ny = y + dy;

                        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                            if (this.tilesCache[ny][nx].isMine) count++;
                        }
                    }
                }
                this.tilesCache[y][x].mineCount = count;
            }
        }

        this.tiles.set(this.tilesCache);
    }

    public revealTile(x: number, y: number) {
        if (this.stateCache === "start") this.fillBoard(x, y);
        if (this.stateCache !== "playing") return;

        const toReveal = new Set<string>();
        const visited = new Set<string>();

        if (this.tilesCache[y][x].isRevealed) {
            this.fillAround(x, y, toReveal, visited);
        }
        else {
            this.floodFillReveal(x, y, toReveal, visited);
        }

        if (toReveal.size === 0) return;

        let hitMine = false;
        let newlyRevealed = 0;

        for (const coordKey of toReveal) {
            const [tileX, tileY] = coordKey.split(',').map(Number);
            const tile = this.tilesCache[tileY][tileX];

            if (!tile.isRevealed && !tile.isFlagged) {
                tile.isRevealed = true;

                if (tile.isMine) {
                    hitMine = true;
                } else {
                    newlyRevealed++;
                }
            }
        }

        this.revealedNonMineTiles += newlyRevealed;

        // Update store once with all changes
        this.tiles.set(this.tilesCache);

        // Check game end conditions
        if (hitMine) {
            this.loseGame();
            return;
        }

        if (this.revealedNonMineTiles === this.totalNonMineTiles) {
            this.winGame();
            return;
        }
    }

    private floodFillReveal(x: number, y: number, toReveal: Set<string>, visited: Set<string>) {
        // Check bounds
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

        const coordKey = `${x},${y}`;
        if (visited.has(coordKey)) return;
        visited.add(coordKey);

        const tile = this.tilesCache[y][x];
        if (tile.isRevealed || tile.isFlagged) return;

        toReveal.add(coordKey);

        // If this tile has no adjacent mines, continue flood fill
        if (!tile.isMine && tile.mineCount === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    this.floodFillReveal(x + dx, y + dy, toReveal, visited);
                }
            }
        }
    }

    private fillAround(x: number, y: number, toReveal: Set<string>, visited: Set<string>) {
        let flagCount = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0 || x + dx < 0 || x + dx >= this.width || y + dy < 0 || y + dy >= this.height) continue;
                const tile = this.tilesCache[y + dy][x + dx];
                if (tile.isRevealed) continue;
                if (tile.isFlagged) flagCount++;
                else toReveal.add(`${x + dx},${y + dy}`);
            }
        }

        if (flagCount !== this.tilesCache[y][x].mineCount) {
            toReveal.clear();
            return;
        }

        for (const coordKey of toReveal) {
            const [tileX, tileY] = coordKey.split(',').map(Number);
            const tile = this.tilesCache[tileY][tileX];

            if (!tile.isMine && tile.mineCount === 0) {
                // This tile should flood fill - call floodFillReveal from this position
                this.floodFillReveal(tileX, tileY, toReveal, visited);
            }
        }
    }

    public flagTile(x: number, y: number) {
        if (this.stateCache !== "playing") return;
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

        const tile = this.tilesCache[y][x];
        if (tile.isRevealed) return;

        tile.isFlagged = !tile.isFlagged;

        if (tile.isFlagged) this.flags--;
        else this.flags++;

        this.tiles.set(this.tilesCache);
    }

    private calculateTotalTime() {
        if (this.startTime) {
            const now = new Date();
            this.totalTime = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
            this.startTime = null;
        }
    }

    private loseGame() {
        loseSound();
        this.calculateTotalTime();
        this.state.set("lose");
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tilesCache[y][x];
                if (tile.isMine) {
                    tile.isRevealed = true;
                }
            }
        }

        this.tiles.set(this.tilesCache);
    }

    private winGame() {
        this.calculateTotalTime();
        this.state.set("win");

        this.tiles.set(this.tilesCache);
    }

    public destroy() {
        this.stopTimer();
    }

}