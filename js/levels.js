levels = [
  {
    "title" : "Learn to change operation.",
    "instructions" : "Protect your seeds from the space squids.  Blow the squids up with your eye beams.",
    "goal" : "kill",
    "baddies" : {
      "infinite" : false,
      "shuffle" : false,
      "vals" : [1, 1, -1, 1, -1, 1, 2, -1, 2, -2],
      "loc" : [0.5, 0.9],
    },
    "hsw": {
      "loc": [0.1, 0.5],
      "operations" : ["+", "-"],
      "operands" : [1],
    },

    "seeds": {
      "vals": [2, -2],
      "locs" : [0.1, 0.1]
    }

  },

  {
    "title" : "Learn to change operands.",
    "instructions" : "Eat your seeds.  Crack the shells with your eye beams.",
    "goal" : "eat",

    "baddies" : {
      "infinite" : true,
      "shuffle" : true,
      "vals" : [1, 1, -1, 1, -1, 1, 2, -1, 2, -2],
      "loc" : [0.9, 0.5],
    },

    "hsw": {
      "loc": [0.1, 0.5],
      "operations" : ["+", "-"],
      "operands" : [1],
    },

    "seeds": {
      "vals": [2, -2],
      "locs" : [0.1, 0.1]
    }

  },

]
