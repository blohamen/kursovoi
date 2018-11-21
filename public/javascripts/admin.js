const userList = document.getElementById("userList");

let usersArr;
function getUsers(users){
    usersArr = users;
}

userList.addEventListener("click", (event)  =>  {
    const target = event.target;
    if (target.classList.contains("delete")) {
        const login = target.nextElementSibling.textContent;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "admin");
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify({login}));
      //  target.parentNode.style.display = "none";
      console.log('delete');
        $(target.parentNode).hide();
    }
})
