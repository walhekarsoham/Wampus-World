# 🏹 Wumpus World

An interactive, browser-based implementation of the classic **Wumpus World** AI problem — built as a free online tool for anyone learning logic-based reasoning, decision-making under uncertainty, or just looking for a fun puzzle game.

> Built for the [Digital Heroes](https://digitalheroesco.com) trial task.

---

## 🌐 Live Demo

🔗 **[Play it live on Vercel →](https://wampus-world.vercel.app/)**

---

## 📖 What is Wumpus World?

Wumpus World is a classic AI problem introduced in the textbook *Artificial Intelligence: A Modern Approach* by Russell & Norvig. It's a grid-based cave exploration game where a player (or AI agent) must:

- Navigate a 4×4 grid cave
- Avoid **pits** (fall in = instant death)
- Hunt or avoid the **Wumpus** (touch it = eaten)
- Find the **Gold** and escape safely

The environment uses **percepts** — clues like *Breeze* (near a pit), *Stench* (near the Wumpus), and *Glitter* (gold nearby) — to make decisions with incomplete information. It's a foundational example of **knowledge-based agents** and **propositional logic** in AI.

I personally encountered this problem during my AI coursework and spent way too long trying to visualize it mentally from a textbook grid. I wished there was a simple, free, interactive version — so I built one.

---

## ✨ Features

- 🗺️ **Interactive 4×4 grid** — click to move, explore the cave
- 👃 **Percept system** — Breeze, Stench, Glitter, Bump, and Scream displayed in real time
- 🤖 **AI agent mode** — watch a logic-based agent solve the world automatically
- 🏆 **Score tracking** — points for grabbing gold, penalties for death or using arrows
- 🔄 **Random world generation** — every game is different
- 📱 **Fully responsive** — works on desktop and mobile
- 💡 **Educational mode** — shows agent's knowledge base and reasoning at each step

---

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | HTML, CSS, JavaScript   |
| AI Logic   | Vanilla JS (propositional logic engine) |
| Deployment | Vercel (free Hobby plan) |
| Code Host  | GitHub (public repo)    |

No frameworks, no build step, no paid services. Zero dependencies.

---

## 🚀 Getting Started Locally

```bash
# Clone the repo
git clone https://github.com/your-username/wumpus-world.git

# Navigate into it
cd wumpus-world

# Open in browser (no server needed)
open public/index.html
# or just double-click index.html
```

That's it. No `npm install`, no `.env`, no setup.

---

## 📁 Project Structure

```
wumpus-world/
├── public/
│   ├── index.html        # Main app entry
│   ├── style.css         # Styles and grid layout
│   └── app.js            # Game logic + AI agent
├── README.md
└── vercel.json           # Vercel deployment config (if needed)
```

---

## 🎮 How to Play

1. You start at position **(1,1)** — bottom-left of the grid
2. Use **arrow keys** or on-screen buttons to move
3. Read your **percepts** — they tell you what's nearby
4. Grab the **Gold** (G) when you sense Glitter
5. Use your **arrow** to shoot the Wumpus if you know where it is
6. **Climb out** at (1,1) with the gold to win

**Scoring:**
- +1000 for grabbing the gold and exiting
- -1 per action taken
- -10 for using the arrow
- -1000 for dying (pit or Wumpus)

---

## 🤖 AI Agent Logic

The built-in agent uses **propositional logic** to:
- Mark cells as **safe**, **possibly dangerous**, or **definitely dangerous**
- Infer Wumpus location from Stench percepts
- Infer pit locations from Breeze percepts
- Choose the next move using a simple **knowledge base** updated after each step

This mirrors the logic-based agent described in *AIMA Chapter 7*.

---

## 👤 Author

**Soham Walhekar**
🔗 [Portfolio](https://your-portfolio.com)
