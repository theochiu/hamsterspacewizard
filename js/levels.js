levels = [
  {
    "title" : "Learn to change operation.",
    "instructions" : "Protect your seeds!\nBlow up the space squids up with your eye beams.",
    "mission" : "killemall",
    "fail" : [{"seed_count" : {"$lt" : 1}}],
    "baddies" : {
      "infinite" : false,
      "shuffle" : false,
      "vals" : [1, 1, -1, 1, -1, 1, 2, -1, 2, -2],
      "loc" : [0.9, 0.5],
      "spawn_rate" : 2000,
    },
    "hsw": {
      "loc": [0.1, 0.5],
      "operations" : ["+", "-"],
      "operands" : [1],
    },

    "seeds": {
      "vals": [2, -2],
      "locs" : [[0.1, 0.1], [0.1, 0.9]]
    }

  },

  {
    "title" : "Learn to change operands.",
    "instructions" : "Eat your seeds!\nCrack the shells with your eye beams.",
    "mission" : "eat",

    "baddies" : {
      "infinite" : true,
      "shuffle" : true,
      "vals" : [1, 1, -1, 1, -1, 1, 2, -1, 2, -2],
      "loc" : [0.9, 0.5],
      "spawn_rate" : 2000,
    },

    "hsw": {
      "loc": [0.1, 0.5],
      "operations" : ["+", "-"],
      "operands" : [1, 2],
    },

    "seeds": {
      "vals": [2, -2],
      "locs" : [[0.1, 0.1], [0.1, 0.9]]
    }

  },

]
