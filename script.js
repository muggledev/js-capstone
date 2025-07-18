let users = [];

fetch("https://javascript-capstone-backend.onrender.com/users")
  .then((res) => res.json())
  .then((data) => {
    users = data.map((user) => ({ ...user, weight: 1 }));
    renderUserList();
  })
  .catch((err) => {
    console.error("Error fetching users:", err);
  });

let selectedUserId = null;

function renderUserList() {
  const nameList = document.getElementById("name-list");
  nameList.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("h3");
    li.dataset.userId = user.id;

    if (user.id === selectedUserId) {
      li.classList.add("highlight");
    }

    li.style.opacity = user.weight === 0 ? "0.4" : "1";

    const name = document.createElement("div");
    name.textContent = user.firstName;
    li.appendChild(name);

    const weightDisplay = document.createElement("span");
    weightDisplay.textContent = ` Weight: ${user.weight}`;
    li.appendChild(weightDisplay);

    const plusBtn = document.createElement("button");
    plusBtn.classList.add("plus");
    plusBtn.innerHTML = '<i class="fa-solid fa-square-plus"></i>';
    plusBtn.title = "Add weight";
    plusBtn.addEventListener("click", () => {
      user.weight++;
      renderUserList();
    });
    li.appendChild(plusBtn);

    const minusBtn = document.createElement("button");
    minusBtn.classList.add("minus");
    minusBtn.innerHTML = '<i class="fa-solid fa-square-minus"></i>';
    minusBtn.title = "Remove weight";
    minusBtn.disabled = user.weight === 0;
    minusBtn.addEventListener("click", () => {
      if (user.weight > 0) {
        user.weight--;
        renderUserList();
      }
    });
    li.appendChild(minusBtn);

    nameList.appendChild(li);
  });
}

document
  .getElementById("randomizer")
  .addEventListener("click", async function () {
    const eligibleUsers = users.filter((user) => user.weight > 0);
    console.log(eligibleUsers);
    const display = document.getElementById("user-display");

    if (eligibleUsers.length === 0) {
      display.textContent = "No users left to choose.";
      return;
    }

    const shuffleDuration = 1000;
    const shuffleInterval = 100;
    const shuffleCount = Math.floor(shuffleDuration / shuffleInterval);

    for (let i = 0; i < shuffleCount; i++) {
      const randomUser =
        eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
      display.textContent = randomUser.firstName;
      await new Promise((resolve) => setTimeout(resolve, shuffleInterval));
    }

    const selectedUser =
      eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
    display.textContent = selectedUser.firstName;

    selectedUserId = selectedUser.id;

    const userToUpdate = users.find((user) => user.id === selectedUser.id);
    if (userToUpdate && userToUpdate.weight > 0) {
      userToUpdate.weight--;
    }

    renderUserList();
  });

document.getElementById("reset").addEventListener("click", function () {
  users = users.map((user) => ({ ...user, weight: 1 }));
  selectedUserId = null;

  document.getElementById("user-display").textContent = "The Chosen One Is...";

  renderUserList();
});
