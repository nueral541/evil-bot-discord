import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import { tokenizer } from "./preprocessor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const batches = [];

async function loadDataset() {
  try {
    const filePath = path.join(__dirname, "toxicity_en.csv");
    const fileContent = await fs.readFile(filePath, "utf-8");

    return new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          columns: true,
          skip_empty_lines: true,
        },
        (err, records) => {
          if (err) {
            console.error("Error parsing CSV:", err);
            reject(err);
            return;
          }

          const dataset = records.map((record) => ({
            text: record.text,
            label: record.is_toxic === "Toxic" ? 1 : 0,
          }));

          resolve(dataset);
        }
      );
    });
  } catch (error) {
    console.error("Error loading dataset:", error);
    throw error;
  }
}

class Dataset {
  constructor(data, splitratio = 0.8) {
    this.data = data;
    this.splitratio = splitratio;
    this.trainData = [];
    this.testData = [];
    this.batchsize = 32;
  }

  async loadDataset() {
    const dataset = await loadDataset();
    this.data = dataset;
  }

  shuffledata() {
    for (let i = this.data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }
    return this;
  }

  splitdata() {
    const splitIndex = Math.floor(this.data.length * this.splitratio);
    this.trainData = this.data.slice(0, splitIndex);
    this.testData = this.data.slice(splitIndex);
    return this;
  }

  batchdata() {
    this.batches = [];
    for (let i = 0; i < this.trainData.length; i += this.batchsize) {
      const batch = this.trainData.slice(i, i + this.batchsize);
      batches.push(batch);
    }
    return batches;
  }

  tokenise(batch) {
    for (const data of batch) {
      data.preprocessedtext = tokenizer(data.text);
    }
  }
}

const dataset = new Dataset();
dataset
  .loadDataset()
  .then(() => {
    console.log("Dataset loaded successfully");
  })
  .catch((error) => {
    console.error("Error loading dataset:", error);
  })
  .then(() => {
    dataset.shuffledata();
  })
  .catch((error) => {
    console.error("Error shuffling dataset:", error);
  })
  .then(() => {
    dataset.splitdata();
    console.log("Train Data:", dataset.trainData.length);
    console.log("Test Data:", dataset.testData.length);
  })
  .then(() => {
    const batches = dataset.batchdata();
    console.log("Batches created:", batches.length);
  })
  .then(() => {
    for (const batch of batches) {
      dataset.tokenise(batch);
    }
    console.log("Tokenization complete");

    // Print first batch's preprocessed texts
    console.log("\nFirst batch preprocessed texts:");
    batches[0].forEach((item, index) => {
      console.log(`\nItem ${index}:`);
      console.log("Original:", item);
      console.log("Preprocessed:", item.preprocessedtext[2]);
    });
  });
