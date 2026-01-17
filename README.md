# Speed Reader

A fast-paced, Minimalist Speed Reader (RSVP) built with Svelte 5. This tool helps you read faster and improve focus by displaying words one at a time in a fixed position, eliminating the need for eye movement across the page.

## ✨ Features

- **RSVP (Rapid Serial Visual Presentation)**: Display text word-by-word at a controlled speed.
- **Persistent State**: Automatically saves your text and reading progress using IndexedDB and LocalStorage.
- **Smart Text Parsing**: Handles punctuation, hyphenated words, and pauses naturally to improve reading flow.
- **Customizable Speed**: Adjust the reading speed to match your comfort level.
- **File Upload**: Support for uploading text files to read.
- **Wikipedia Integration**: Read Wikipedia's featured article of the day or load a random Wikipedia article to practice speed reading.
- **Modern UI**: Built with Tailwind CSS 4 and Skeleton UI for a sleek, responsive experience.

## 🚀 Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) (using Runes)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Skeleton UI](https://www.skeleton.dev/)
- **State Management**: Global `ReaderState` class for consolidated state.
- **Storage**: IndexedDB (for large text) and LocalStorage (for settings/progress).

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (recommended)

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install
```

### Developing

Start the development server:

```sh
pnpm dev
```

### Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

## 📜 License

MIT
