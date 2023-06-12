import { request } from "./request.js"
const serverAddress = "http://192.168.1.10:3000"

var turn = ""
var name = ""
let playerTurn = ""
let globalFen = ""
let fliped = false

function eventListeners()
{
// document.addEventListener("DOMContentLoaded", loadPage)
 
  // Handle Input
  moveInput.addEventListener("keydown", (e) => 
    {
        if(e.key === "Enter")
        {
          if(playerTurn)
          {
            // name = nameInput.value
            const move = e.target.value
            request.post(serverAddress, move)
            .then(text => {
                console.log("Hata yaptın...")
            })
            .catch(err => console.log(err))
            
            // playerMove(move)
          }
          else
          {
            console.log("Sıra makinada !.")
          }
        }
    } 
  )

  // Handle Input
  nameInput.addEventListener("keydown", (e) => 
    {
      
        if(e.key === "Enter")
        {
          console.log("entered")
          name = e.target.value
          console.log(name)
        }
    } 
  )
}

 
// Variables used in setBoard
let game = null
let config = null
let board = null


function setBoard(fen)
{
  globalFen = fen
  // Configs of the chessboard.
  config = 
  {
    draggable: false,
    position: fen,
  }

  // Initiate the chessboard with above configurations. 
  board = Chessboard('myBoard', config)
 
  // Set board orientation according to puzzle.
  if(turn === 'w' && !fliped){ 
    console.log("bura calisti")
    board.flip()
    fliped = true
  }
}


function start()
{
  // Call `fetch()`, passing in the URL.
  fetch(serverAddress)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then((response) => {
    // Our handler throws an error if the request did not succeed.
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    // Otherwise (if the response succeeded), our handler fetches the response
    // as text by calling response.text(), and immediately returns the promise
    // returned by `response.text()`.
    return response.text();
  })
  // When response.text() has succeeded, the `then()` handler is called with
  // the text, and we copy it into the `poemDisplay` box.
  .then((resp) => {
    // console.log(resp)
    resp = JSON.parse(resp)
    // console.log(resp)
    playerTurn = resp.playerTurn
    turn = resp.color
    setBoard(resp.fen)

  })
  // Catch any errors that might happen, and display a message
  // in the `poemDisplay` box.
  .catch((error) => {
    console.log(error);
  });
 
}

 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
start()  

const eventSource = new EventSource(serverAddress + "/sse");

eventSource.addEventListener('game-update', (event) => {
  const data = event.data
  if(data !== globalFen)
    {
      if(board != null)
      {
        board.position(data)
        globalFen = data
      }
    }
});

eventSource.addEventListener('color-update', (event) => {
  const data = event.data
  if(board != null)
    {
      if(data === 'w' && !fliped) {
        console.log("event flip1")
        board.flip()
        fliped = true
      }
      if(data === "b" && fliped){
        console.log("event flip 2")
        board.flip()
        fliped = false
      }
    }
});
 
 
const moveInput = document.getElementById("move-input")
const nameInput = document.getElementById("name-input")

eventListeners()

 

















