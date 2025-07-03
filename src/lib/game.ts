import type { GameState, TileProps, Difficulty } from "./types";
import { DIFFICULTY_SETUP } from "./constants";
import { writable, type Writable } from 'svelte/store';

export class GameController {
    private width: number = 0;
    private height: number = 0;

    private score: number = 0;
    private totalMines: number = 0;

    private state: GameState = "playing";
    public tiles: Writable<TileProps[][]>;
    private difficulty: Difficulty;

    constructor(difficulty: Difficulty = "easy") {
        this.difficulty = difficulty;
        this.tiles = writable([]);
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
        let value: TileProps[][];
        this.tiles.subscribe(v => value = v)();
        return value![y][x];
    }

    public setDifficulty(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.setupGame();
    }

    private setupGame() {
        const difficulty = DIFFICULTY_SETUP[this.difficulty];
        this.totalMines = difficulty.mines;
        this.width = difficulty.width;
        this.height = difficulty.height;

        this.generateTiles();
        this.generateMines();
        this.CalculateMineCount();
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

    private generateMines() {
        let value: TileProps[][];
        this.tiles.subscribe(v => value = v)();
        for (let i = 0; i < this.totalMines; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            value![y][x].isMine = true;
        }
        this.tiles.set(value!);
    }

    private CalculateMineCount() {
        let value: TileProps[][];
        this.tiles.subscribe(v => value = v)();
        const searchAround = (x: number, y: number) => {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    if (x + i < 0 || x + i >= this.width || y + j < 0 || y + j >= this.height) continue;
                    if (value![y + j][x + i].isMine) count++;
                }
            }
            return count;
        }
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (value![i][j].isMine) continue;
                value![i][j].mineCount = searchAround(j, i);
            }
        }
        this.tiles.set(value!);
    }

    public revealTile(x: number, y: number) {
        if (this.state !== "playing") return;
        let value: TileProps[][];
        this.tiles.subscribe(v => value = v)();

        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        if (value![y][x].isRevealed || value![y][x].isFlagged) return;

        value![y][x].isRevealed = true;
        this.tiles.set(value!);

        if (value![y][x].isMine) {
            this.state = "lose";
        }
    }

    public flagTile(x: number, y: number) {
        if (this.state !== "playing") return;
        let value: TileProps[][];
        this.tiles.subscribe(v => value = v)();
        
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        if (value![y][x].isRevealed) return;
        
        value![y][x].isFlagged = !value![y][x].isFlagged;
        this.tiles.set(value!);
    }

    public resetGame() {
        this.setupGame();
    }

}