import type { Difficulty } from "./types";

export const DIFFICULTY_SETUP: Record<Difficulty, {width: number, height: number, mines: number}> = {
    easy: {width: 9, height: 9, mines: 10},
    medium: {width: 16, height: 16, mines: 40},
    hard: {width: 30, height: 16, mines: 99}
}