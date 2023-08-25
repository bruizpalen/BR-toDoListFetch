import React from "react";
import { useState, useEffect } from "react";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [listTasks, setListTasks] = useState([]);

  const handleAddNewEmptyTask = (e) => {
    const newTask = {
      id: "",
      label: "",
      done: "",
    };
    setListTasks([...listTasks, newTask]);
  };
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleEnterNewTask = (e, userName) => {
    if (e.key === "Enter") {
      const label = e.target.value;
      if (label.trim() !== "") {
        const emptyTaskIndex = listTasks.findIndex((task) => task.label === "");

        if (emptyTaskIndex !== -1) {
          const maxId = Math.max(...listTasks.map((task) => task.id));
          const updatedTasks = [...listTasks];
          updatedTasks[emptyTaskIndex] = {
            id: maxId + 1, // Generate a new unique id
            label: label,
            done: false,
          };

          setListTasks(updatedTasks);
          e.target.value = ""; // Clear the input field

          // Send the updated tasks to the server
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          const raw = JSON.stringify(updatedTasks);
          fetch(
            `https://playground.4geeks.com/apis/fake/todos/user/${userName}`,
            {
              method: "PUT",
              headers: myHeaders,
              body: raw,
            }
          )
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
          console.log(updatedTasks);
        }
      }
    }
  };

  const handleDeleteSingleTask = (e, userName, idTask) => {
    const filteredTasks = listTasks.filter((task) => task.id !== idTask);
    setListTasks(filteredTasks);

    // Send the updated tasks to the server
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(filteredTasks);
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${userName}`, {
      method: "PUT",
      headers: myHeaders,
      body: raw,
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const handleDeleteAllTasks = (userName) => {
    setListTasks([]);
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${userName}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    // console.log(listTasks); // Debugging: Check the updated state
  }, [listTasks]);

  const handleListUser = (userNameToShow) => {
    fetch(
      `https://playground.4geeks.com/apis/fake/todos/user/${userNameToShow}`
    )
      .then((res) => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then((response) => {
        console.log("Success:", response);
        console.log(typeof response);
        for (const key of Object.keys(response)) {
          console.log("Hello", key, Object.keys(response[key]));
        }
        setListTasks(response);
        // console.log(listTasks);
      })
      .catch((error) => console.error(error));
  };

  const handleInputUserName = (e) => {
    if (e.key === "Enter" && userName !== "") {
      fetch("https://playground.4geeks.com/apis/fake/todos/user/")
        .then((res) => {
          if (!res.ok) throw Error(res.statusText);
          return res.json();
        })
        .then((response) => {
          console.log(response);
          const userNameExists = response.includes(userName);
          console.log(userNameExists);
          if (!userNameExists) {
            // console.log("No existe");
            fetch(
              `https://playground.4geeks.com/apis/fake/todos/user/${userName}`,
              {
                method: "POST",
                body: JSON.stringify([]),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((postResponse) => {
                if (!postResponse.ok) throw Error(postResponse.statusText);
                return postResponse.json();
              })
              .then((resultText) => {
                console.log("Hello", resultText);
                alert(`Welcome ${userName}`);
                setUserName(userName);
                handleListUser(userName);
                // fetch(`https://playground.4geeks.com/apis/fake/todos/user/${userName}`)
                // .then
              });
          } else {
            alert("This userName already exists");
            handleListUser(userName);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <div className="containerCenter flex-column justify-content-center align-items-center rounded">
        <h1 className="text-center">{`ToDoList :)`} </h1>
        <ul className="list-group bg-secondary">
          <li className="list-group-item d-inline-flex bg-secondary">
            <input
              className="form-control me-2"
              placeholder="UserName"
              name="userName"
              value={userName}
              onChange={handleUserName}
              onKeyDown={handleInputUserName}
            />
          </li>
        </ul>
        <ul className="list-group">
          {console.log("The tasks are", listTasks.length)}
          {listTasks.length !== 0 &&
            listTasks.map((task) => (
              <li className="list-group-item d-inline-flex" key={task.id}>
                <input
                  className="form-control me-2"
                  placeholder={task.label || "New task (press Enter to add)"}
                  defaultValue={task.label}
                  readOnly={task.label !== ""}
                  onKeyDown={
                    task.label == ""
                      ? (e) => handleEnterNewTask(e, userName)
                      : undefined
                  }
                  // onChange={handleInputChange}
                  // onKeyDown={handleAddTask}
                />
                <button
                  className="trashButton btn btn-danger d-flex justify-content-center align-items-center"
                  onClick={(e) => handleDeleteSingleTask(e, userName, task.id)}
                >
                  <span className=" fa-regular fa-trash-can"></span>
                </button>
              </li>
            ))}

          <li className="list-group-item d-inline-flex justify-content-center align-items-center">
            <button
              className="btn btn-success me-2"
              onClick={(e) => handleAddNewEmptyTask()}
            >
              Add task
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteAllTasks(userName)}
            >
              Delete user and tasks
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
