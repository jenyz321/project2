var questions = [
  {
    // eslint-disable-next-line prettier/prettier
    questionOne: "Do you have more experience in front end or back end web development?",
    answers: ["Front end", "Back end"]
  },
  {
    questionTwo: "How many years of experience do you have in SQL?",git 
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionThree: "How many years of experience do you have in Java?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionFour: "How many years of experience do you have in JavaScript?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionFive: "How many years of experience do you have in C#?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionSix: "How many years of experience do you have in C++?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionSeven: "How many years of experience do you have in Python?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionEight: "How many years of experience do you have in PHP?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionNine: "How many years of experience do you have in Ruby on Rails?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  },
  {
    questionTen: "How many years of experience do you have in IOS/Swift?",
    answers: ["less than 1", "1 to 5", "6 to 10", "11 to 15", "15 plus"]
  }
];

function getMatches(){  //Comparing user with their best friend match
  var totalDifference = 0;
  //Object to hold the best match
  var coderMatch = {
    name: "",
    photo: "",
    coderDifference: 50
  };
   // Here we take the result of the user's survey POST and parse it.
  var userData = req.body;
  var userName = userData.name;
  var userScores = userData.answers;
  // Converting the users score to a number (Instead of string)
  var userScoresNum = userScores.map(function (item) {
    return parseInt(item, 10);
  });
   userData = {
    "name": req.body.name,
    "photo": req.body.photo,
    "scores": userScoresNum
  };
  console.log(userData);

  console.log("Name: " + userName);
  console.log("User Score " + userScores);
   console.log('userScoreNum outside function ' + userScoresNum);
   // Converting the users score to a sum number (Adds up all the numbers in array)
  //
  var userScoresSum = userScoresNum.reduce((tot, amt) => tot + amt, 0);
   console.log("Sum of users score " + userScoresSum);
  console.log("Best match friend diff " + coderMatch.coderDifference);

  // console.log("+++++++=================++++++++++");
   // Loop through all the coder possibilities in the database.
  for (var i = 0; i < coderData.length; i++) {
     console.log(coderData[i].name);
    totalDifference = 0;
    console.log("Total Diff " + totalDifference);
    console.log("Best match friend diff " + coderMatch.coderDifference);
     var coderScoreSum = coderData[i].answers.reduce((tot, amt) => tot + amt, 0);
    console.log("Total friend score " + coderScoreSum);
    totalDifference += Math.abs(userScoresSum - coderScoreSum);
    console.log(" -------------------> " + totalDifference);
     // If the sum of differences is less then the differences of the current "best match"
    if (totalDifference <= coderMatch.coderDifference) {
       // Reset the coderMatch to be the new friend.
      coderMatch.name = coderData[i].name;
      coderMatch.photo = coderData[i].photo;
      coderMatch.coderDifference = totalDifference;
      // }
     }
    console.log(totalDifference + " Total Difference");
   }
  console.log(coderMatch);
  // Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
  // the database will always return that the user is the user's best friend).
  coderData.push(userData);
  console.log("New User added");
  console.log(userData);
  // Return a JSON with the user's coderMatch. This will be used by the HTML in the next page.
  res.json(coderMatch);

};
module.exports = questions;
