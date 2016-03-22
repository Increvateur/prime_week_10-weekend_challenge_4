// Set the global variables used throughout
var todoArray = [];
var taskData = {};

$(document).ready(function() {

  // Gets the initial database information if any is there
  getDbData();

  // Click listeners for the To-Do list
  $(".todo-list-display").on("click", '.complete', completeData);
  $(".todo-list-display").on('click', '.delete', deleteData);

  // Click listeners for the Completed list
  $(".completed-list-display").on("click", '.complete', completeData);
  $(".completed-list-display").on('click', '.delete', deleteData);

  // Click listener for the To-Do item input
  $("#input-form").on('submit', function(){
    event.preventDefault();

    // Takes the input and places it into an array
    var formArray = $('form').serializeArray();
    formArray.forEach(function(element){
      taskData[element.name] = element.value;
    });

    // Clears out the text that was entered into the To-Do item input
    $('#input-form').find('input[type=text]').val('');

    // Posts the To-Do item input into the database
    postToDo(taskData);

  });
});

// Appends all information to the DOM
function initDisplay(data) {

  // Empties out both the To-Do and Completed lists
  $(".todo-list-display").empty();
  $(".completed-list-display").empty();

  // Loops through the array of database information to display
  for (var i = 0; i < data.length; i++) {
    var id = data[i].id;

    // Displays data based on whether it is complete or incomplete
    if (data[i].completed === false) {
      $(".todo-list-display").append('<div class="todo-list-' + id + '"></div>');
      $(".todo-list-" + id).append('<li>' + data[i].task + '</li>');
      $(".todo-list-" + id).append('<button class="complete id-' + id + '">Complete</button>');
      $(".todo-list-" + id).append('<button class="delete id-' + id + '">Delete</button>');
      $(".id-" + id).data("id", { id: id, state: true });
    } else {
      $(".completed-list-display").append('<div class="completed-item-' + id + '"></div>');
      $(".completed-item-" + id).append('<s><li>' + data[i].task + '</li></s>');
      $(".completed-item-" + id).append('<button class="complete id-' + id + '">Incomplete</button>');
      $(".completed-item-" + id).append('<button class="delete id-' + id + '">Delete</button>');
      $(".id-" + id).data("id", { id: id, state: false });
    }
  }
}

// Gets the information from the database
function getDbData() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(data) {
      todoArray = data;
      initDisplay(todoArray);
    }
  });
}

// Posts information entered into the database
function postToDo(input) {
  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: input,
    success: function(data) {
      todoArray.push(data[0]);
      initDisplay(todoArray);
    }
  });
}

// Deletes data from the database
function deleteData() {
  var data = $(this).data('id');
  var deleteConfirm = confirm("Are you sure you want to delete this item?");

  if (deleteConfirm === true) {
    $.ajax({
      type: 'DELETE',
      url: '/tasks',
      data: data,
      success: getDbData
    });
  }
}

// Updates data in the database
function completeData() {
  var data = $(this).data('id');
  $.ajax({
    type: 'PUT',
    url: '/tasks',
    data: data,
    success: getDbData
  });
}
