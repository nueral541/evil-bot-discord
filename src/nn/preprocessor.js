const vocabulary = new Map();

const tokenizer = (text) => {
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

  for (const token of tokens) {
    if (!vocabulary.has(token)) {
      vocabulary.set(token, vocabulary.size);
    }
  }

  const tokenisedtext = tokens.map((token) => {
    return {
      token: token,
      length: token.length,
      vector: wordtovector(token, vocabulary.size),
    };
  });
  return tokenisedtext;
};

const wordtovector = async (word, numofvocab) => {
  const vector = new Array(numofvocab).fill(0);
  vector[vocabulary.get(word)] = 1;
  return vector;
};

// const dummytext =
//   "This is a dummy text for testing the tokenizer function. I am trying to see if this can remove the words that are repeated. The vocabulary should contain no repeated words for testing purposes.";

// const tokenizedResult = tokenizer(dummytext);

export { tokenizer, wordtovector };
