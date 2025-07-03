export type TileProps = {
	isMine?: boolean;
	isRevealed?: boolean;
	mineCount?: number;
    isFlagged?: boolean;
	onclick?: () => void;
	oncontextmenu?: () => void;
};

export type GameState = "win" | "lose" | "playing" | "start";
export type Difficulty = "easy" | "medium" | "hard";