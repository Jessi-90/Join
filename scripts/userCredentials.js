function getCurrentUserInitials() {
let currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    currentUser = localStorage.getItem("currentUser");
}

currentUser = currentUser ? JSON.parse(currentUser) : { initials: "G"};

let initials = currentUser.initials;

console.log("Initials:", initials);
console.log("Color:", color);
}