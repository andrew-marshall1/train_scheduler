var config = {
          apiKey: "AIzaSyCX83BRvk8O1gYB7fbLSzlu3x7X5gKjzVo",
        authDomain: "train-scheduler-487a0.firebaseapp.com",
        databaseURL: "https://train-scheduler-487a0.firebaseio.com",
        projectId: "train-scheduler-487a0",
        storageBucket: "train-scheduler-487a0.appspot.com",
        messagingSenderId: "440785677962"
      };
      firebase.initializeApp(config);

var database = firebase.database();

// when you click submit
$("#submit").on("click", function () {
    event.preventDefault();

    // save variables from form
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    // push variables to database
    database.ref("/trains").push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
    });

    // reset form
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val(""); 
});

// when a new train gets added
database.ref("/trains").on("child_added", function (snapshot) {
    var data= snapshot.val();

    // calculate next train and time until next train
    var firstTrainTimeConverted = moment(data.firstTrainTime, "HH:mm").subtract(1, "years");
    
    var differenceOfTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    
    var timeRemainder = differenceOfTime % data.frequency;

    var minutesTillTrain = data.frequency - timeRemainder;
 
    var nextTrain = moment().add(minutesTillTrain, "minutes");

    var nextTrainTime = moment(nextTrain).format("hh:mm A");

    // if first train is in future
    if(moment().diff(moment(data.firstTrainTime, "HH:mm"), "minutes") < 0) {
        var nextArrival = moment(data.firstTrainTime, "HH:mm").format("hh:mm A");
        var minutesAway = moment(data.firstTrainTime, "HH:mm").diff(moment(), "minutes");
    } 

    // if  first train is in the past
    else {
        var nextArrival = nextTrainTime;
        var minutesAway = minutesTillTrain;
    };
   
    // display train schedule
    $("tbody").append("<tr><td>" + data.trainName + "</td><td>" + data.destination + "</td><td>" + data.frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});