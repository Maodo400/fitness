const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample exercises data loading
let exercises = [];
const dataPath = path.join(__dirname, 'data', 'exercises.json');

if (fs.existsSync(dataPath)) {
  try {
    exercises = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`✅ Loaded ${exercises.length} exercises from data/exercises.json`);
  } catch (err) {
    console.error("❌ Error loading exercises.json:", err.message);
  }
} else {
  // Fallback mock data if full file is not provided in directory
  exercises = [
    {
      "id": "0001",
      "name": "3/4 sit-up",
      "category": "waist",
      "body_part": "waist",
      "equipment": "body weight",
      "instructions": {
        "fr": "Allonge-toi sur le dos, les genoux fléchis et les pieds à plat au sol. Place tes mains derrière la tête. Contracte les abdos pour soulever le buste à 45 degrés.",
        "en": "Lie flat on your back with your knees bent and feet flat on the ground. Place your hands behind your head."
      },
      "instruction_steps": {
        "fr": ["Allonge-toi sur le dos, genoux fléchis.", "Mains derrière la tête, coudes vers l'extérieur.", "Soulever le buste jusqu'à 45 degrés.", "Redescendre lentement."],
        "en": ["Lie flat on your back.", "Hands behind head.", "Curl forward to 45 degrees.", "Lower back down."]
      },
      "muscle_group": "hip flexors",
      "secondary_muscles": ["hip flexors", "lower back"],
      "target": "abs",
      "media_id": "2gPfomN",
      "image": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0001-2gPfomN.jpg",
      "gif_url": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0001-2gPfomN.gif",
      "attribution": "© Gym visual — https://gymvisual.com/",
      "created_at": "2026-03-18T12:31:32.854798+00:00"
    },
    {
      "id": "0025",
      "name": "barbell bench press",
      "category": "chest",
      "body_part": "chest",
      "equipment": "barbell",
      "instructions": {
        "fr": "Allongé sur le banc, saisissez la barre mains écartées. Descendez la barre jusqu'au milieu de la poitrine puis poussez fermement vers le haut.",
        "en": "Lie flat on a bench, grip barbell slightly wider than shoulder-width. Lower bar to chest and press up."
      },
      "instruction_steps": {
        "fr": ["Allongez-vous sur le banc plat.", "Saisissez la barre avec une prise moyenne.", "Descendez la barre sous contrôle jusqu'à la poitrine.", "Poussez la barre vers le haut."],
        "en": ["Lie on bench.", "Grip barbell.", "Lower bar to chest.", "Press back up."]
      },
      "muscle_group": "triceps",
      "secondary_muscles": ["triceps", "shoulders"],
      "target": "pectorals",
      "media_id": "EIeI8Vf",
      "image": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0025-EIeI8Vf.jpg",
      "gif_url": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif",
      "attribution": "© Gym visual — https://gymvisual.com/",
      "created_at": "2026-03-18T12:31:32.854798+00:00"
    },
    {
      "id": "0032",
      "name": "barbell deadlift",
      "category": "back",
      "body_part": "back",
      "equipment": "barbell",
      "instructions": {
        "fr": "Debout devant la barre, fléchissez les hanches et genoux, saisissez la barre et redressez-vous en gardant le dos droit.",
        "en": "Stand in front of bar, hinge at hips, grip bar and drive through floor to stand upright."
      },
      "instruction_steps": {
        "fr": ["Pieds sous la barre, largeur des épaules.", "Saisissez la barre, le dos bien plat.", "Poussez dans le sol avec vos jambes.", "Tendez les hanches en haut."],
        "en": ["Feet under bar.", "Grip bar with flat back.", "Drive through heels.", "Lock out at top."]
      },
      "muscle_group": "hamstrings",
      "secondary_muscles": ["hamstrings", "lower back"],
      "target": "glutes",
      "media_id": "ila4NZS",
      "image": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0032-ila4NZS.jpg",
      "gif_url": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
      "attribution": "© Gym visual — https://gymvisual.com/",
      "created_at": "2026-03-18T12:31:32.854798+00:00"
    },
    {
      "id": "0043",
      "name": "barbell full squat",
      "category": "upper legs",
      "body_part": "upper legs",
      "equipment": "barbell",
      "instructions": {
        "fr": "Barre sur les trapèzes, fléchissez les genoux pour descendre en squat sous la parallèle puis remontez.",
        "en": "Bar on upper back, descend by bending knees and hips past parallel, then push back up."
      },
      "instruction_steps": {
        "fr": ["Placez la barre sur le haut du dos.", "Descendez en poussant les fesses vers l'arrière.", "Passez sous la parallèle.", "Remontez en poussant sur toute la plante des pieds."],
        "en": ["Bar on upper back.", "Squat down below parallel.", "Push back up to starting position."]
      },
      "muscle_group": "quadriceps",
      "secondary_muscles": ["quadriceps", "hamstrings", "calves"],
      "target": "glutes",
      "media_id": "qXTaZnJ",
      "image": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0043-qXTaZnJ.jpg",
      "gif_url": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
      "attribution": "© Gym visual — https://gymvisual.com/",
      "created_at": "2026-03-18T12:31:32.854798+00:00"
    },
    {
      "id": "0294",
      "name": "dumbbell biceps curl",
      "category": "upper arms",
      "body_part": "upper arms",
      "equipment": "dumbbell",
      "instructions": {
        "fr": "Debout un haltère dans chaque main, coudes collés au corps, fléchissez les bras pour monter les charges vers les épaules.",
        "en": "Hold dumbbells at sides, curl up toward shoulders keeping elbows tight."
      },
      "instruction_steps": {
        "fr": ["Debout, haltères le long du corps.", "Pivotez les poignets vers le haut en montant.", "Contractez les biceps en haut.", "Redescendez lentement."],
        "en": ["Stand holding dumbbells.", "Curl weights up.", "Squeeze biceps.", "Lower under control."]
      },
      "muscle_group": "forearms",
      "secondary_muscles": ["forearms"],
      "target": "biceps",
      "media_id": "NbVPDMW",
      "image": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0294-NbVPDMW.jpg",
      "gif_url": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0294-NbVPDMW.gif",
      "attribution": "© Gym visual — https://gymvisual.com/",
      "created_at": "2026-03-18T12:31:32.854798+00:00"
    },
    {
      "id": "0652",
      "name": "pull-up",
      "category": "back",
      "body_part": "back",
      "equipment": "body weight",
      "instructions": {
        "fr": "Suspendu à la barre en prise pronation, tirez avec le dos jusqu'à amener le menton au-dessus de la barre.",
        "en": "Hang from bar with overhand grip, pull chest up to bar."
      },
      "instruction_steps": {
        "fr": ["Attrapez la barre, mains écartées.", "Tirez vers le haut en engagent les dorsaux.", "Passez le menton au-dessus de la barre.", "Redescendez en contrôlant."],
        "en": ["Grip bar overhand.", "Pull chest up to bar.", "Lower back down."]
      },
      "muscle_group": "biceps",
      "secondary_muscles": ["biceps", "forearms"],
      "target": "lats",
      "media_id": "lBDjFxJ",
      "image": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0652-lBDjFxJ.jpg",
      "gif_url": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0652-lBDjFxJ.gif",
      "attribution": "© Gym visual — https://gymvisual.com/",
      "created_at": "2026-03-18T12:31:32.854798+00:00"
    }
  ];
}

// API Routes
app.get('/api/exercises', (req, res) => {
  let { search, category, body_part, equipment, target, limit, offset } = req.query;
  let filtered = [...exercises];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(ex => 
      ex.name.toLowerCase().includes(q) || 
      (ex.target && ex.target.toLowerCase().includes(q))
    );
  }

  if (category) {
    filtered = filtered.filter(ex => ex.category.toLowerCase() === category.toLowerCase());
  }

  if (body_part) {
    filtered = filtered.filter(ex => ex.body_part.toLowerCase() === body_part.toLowerCase());
  }

  if (equipment) {
    filtered = filtered.filter(ex => ex.equipment.toLowerCase() === equipment.toLowerCase());
  }

  if (target) {
    filtered = filtered.filter(ex => ex.target.toLowerCase() === target.toLowerCase());
  }

  const total = filtered.length;
  const l = parseInt(limit) || 24;
  const o = parseInt(offset) || 0;
  const paginated = filtered.slice(o, o + l);

  res.json({
    total,
    limit: l,
    offset: o,
    data: paginated
  });
});

app.get('/api/exercises/:id', (req, res) => {
  const ex = exercises.find(item => item.id === req.params.id);
  if (!ex) return res.status(404).json({ error: "Exercise not found" });
  res.json(ex);
});

app.get('/api/filters', (req, res) => {
  const categories = [...new Set(exercises.map(e => e.category))].filter(Boolean).sort();
  const bodyParts = [...new Set(exercises.map(e => e.body_part))].filter(Boolean).sort();
  const equipments = [...new Set(exercises.map(e => e.equipment))].filter(Boolean).sort();
  const targets = [...new Set(exercises.map(e => e.target))].filter(Boolean).sort();

  res.json({ categories, bodyParts, equipments, targets });
});

app.listen(PORT, () => {
  console.log(`🚀 FitApp Server running at http://localhost:${PORT}`);
});
