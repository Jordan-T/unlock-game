export const difficulties = {
  "very-easy": {
    duration: 300,
    codeValues: [..."1234"],
    text: "Very easy"
  },
  easy: {
    duration: 180,
    codeValues: [..."123456"],
    text: "Easy"
  },
  medium: {
    duration: 120,
    codeValues: [..."12345678"],
    text: "Medium",
    default: true
  },
  hard: {
    duration: 60,
    codeValues: [..."ABCDEFGHIJ"],
    text: "Hard"
  },
  "very-hard": {
    duration: 40,
    codeValues: [..."ABCDEFGHIJKL"],
    text: "Very hard"
  }
};

export type Difficulty = keyof typeof difficulties;

export const defaultDifficulty: Difficulty = "medium";
