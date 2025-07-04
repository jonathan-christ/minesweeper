import type { Difficulty } from "./types";

export const DIFFICULTY_SETUP: Record<Difficulty, {width: number, height: number, mines: number}> = {
    easy: {width: 9, height: 9, mines: 10},
    medium: {width: 16, height: 16, mines: 40},
    hard: {width: 30, height: 16, mines: 99}
}

export const MINECOUNT_TO_COLOR: Record<number, string> = {
    0: 'text-white',
    1: 'text-blue-500',
    2: 'text-green-400',
    3: 'text-red-500',
    4: 'text-purple-500',
    5: 'text-orange-500',
    6: 'text-yellow-500',
    7: 'text-gray-500',
    8: 'text-black'
}