import type { GameState, TileProps, Difficulty } from "./types";
import { DIFFICULTY_SETUP } from "./constants";
import { writable, type Writable } from 'svelte/store';

export class GameController {
    private width: number = 0;
    private height: number = 0;
    private score: number = 0;

    private totalMines: number = 0;
    private totalNonMineTiles: number = 0;
    private revealedNonMineTiles: number = 0;

    private state: GameState = "start";
    private difficulty: Difficulty;

    public tiles: Writable<TileProps[][]>;
    private tilesCache: TileProps[][] = [];

    constructor(difficulty: Difficulty = "easy") {
        this.difficulty = difficulty;
        this.tiles = writable([]);

        this.tiles.subscribe(tiles => {
            this.tilesCache = tiles;
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
        return this.state;
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

    public getTiles() {
        let value: TileProps[][];
        this.tiles.subscribe(v => value = v)();
        return value!;
    }

    public getTile(x: number, y: number): TileProps | undefined {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return undefined;
        return this.tilesCache[y]?.[x];
    }

    public setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.setupGame();
    }

    public resetGame() {
        this.setupGame();
    }

    private setupGame() {
        const difficulty = DIFFICULTY_SETUP[this.difficulty];
        this.totalMines = difficulty.mines;
        this.totalNonMineTiles = difficulty.width * difficulty.height - difficulty.mines;
        this.width = difficulty.width;
        this.height = difficulty.height;
        this.state = "start";
        this.revealedNonMineTiles = 0;

        this.generateTiles();
    }

    private fillBoard(x_start: number, y_start: number) {
        this.generateMines(x_start, y_start);
        this.calculateMineCount();
        this.state = "playing";
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
        if (this.state === "start") this.fillBoard(x, y);
        if (this.state !== "playing") return;

        const toReveal = new Set<string>();
        const visited = new Set<string>();

        this.floodFillReveal(x, y, toReveal, visited);

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
            this.state = "lose";
            alert("You lose");
            return;
        }

        if (this.revealedNonMineTiles === this.totalNonMineTiles) {
            this.state = "win";
            alert("You win");
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

    public flagTile(x: number, y: number) {
        if (this.state !== "playing") return;
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

        const tile = this.tilesCache[y][x];
        if (tile.isRevealed) return;
        
        tile.isFlagged = !tile.isFlagged;
        
        this.tiles.set(this.tilesCache);
    }

}