document.addEventListener("DOMContentLoaded", function () {
  const userForm = document.getElementById("userForm");
  const userIdField = document.getElementById("userId");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const userTable = document.getElementById("userTable");

  // Submit form (Create or Update)
  userForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const userData = {
      name: nameField.value,
      email: emailField.value,
    };

    const userId = userIdField.value;

    if (userId) {
      // Update existing user
      updateUser(userId, userData);
    } else {
      // Create new user
      createUser(userData);
    }
  });

  // Cancel edit
  cancelBtn.addEventListener("click", function () {
    resetForm();
  });

  // Edit and Delete buttons event delegation
  userTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-btn")) {
      const userId = e.target.getAttribute("data-id");
      loadUserForEdit(userId);
    } else if (e.target.classList.contains("delete-btn")) {
      const userId = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this user?")) {
        deleteUser(userId);
      }
    }
  });

  // Create new user
  function createUser(userData) {
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        resetForm();
        window.location.reload(); // Reload to show new user
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        alert("Error creating user");
      });
  }

  // Update existing user
  function updateUser(userId, userData) {
    fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        resetForm();
        window.location.reload(); // Reload to show updated user
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Error updating user");
      });
  }

  // Delete user
  function deleteUser(userId) {
    fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        window.location.reload(); // Reload to update user list
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      });
  }

  // Load user data for editing
  function loadUserForEdit(userId) {
    fetch(`/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((user) => {
        userIdField.value = user.id;
        nameField.value = user.name;
        emailField.value = user.email;
        submitBtn.textContent = "Update User";
        cancelBtn.style.display = "block";
      })
      .catch((error) => {
        console.error("Error loading user:", error);
        alert("Error loading user data");
      });
  }

  // Reset form to initial state
  function resetForm() {
    userForm.reset();
    userIdField.value = "";
    submitBtn.textContent = "Add User";
    cancelBtn.style.display = "none";
  }
});
