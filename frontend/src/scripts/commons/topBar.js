(function(){
  const btnBack = document.querySelector('#btnBack').addEventListener("click", (event) => {
    event.preventDefault();
    history.back();
  });
})

