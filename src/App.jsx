import React from "react";
import { useState } from "react";
const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [listTasks, setListTasks] = useState([]);
  const [isOver, setIsOver] = useState(null);

  const handleAddTask = (e) => {
    if (e.key === "Enter" && inputValue !== "") {
      setListTasks([...listTasks, inputValue]);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDeleteTask = (indexToDelete) => {
    setListTasks(listTasks.filter((task, index) => index !== indexToDelete));
  };

  const handleMouseEnter = (index) => {
    setIsOver(index);
  };
  const handleMouseLeaves = (index) => {
    setIsOver(null);
  };

  const handleEditTask = (event, indexToEdit) => {
    const updatedTasks = [...listTasks];
    updatedTasks[indexToEdit] = event.target.value;
    setListTasks(updatedTasks);
  };
  {
    console.log(listTasks);
  }
  return (
    <>
      <div className="containerCenter flex-column justify-content-center align-items-center rounded">
        <h1 className="text-center">{`ToDoList :)`} </h1>
        <ul className="list-group">
          <li className="list-group-item d-inline-flex">
            <input
              className="form-control me-2"
              placeholder="New task (press Enter to add)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleAddTask}
            />
          </li>
          {listTasks.map((task, index) => (
            <div
              className=""
              key={index}
              onMouseOver={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeaves(index)}
            >
              <li className="list-group-item d-flex">
                <input
                  className="form-control me-2"
                  // placeholder="New task (press Enter to add)"
                  value={listTasks[index]}
                  onChange={(e) => handleEditTask(e, index)}
                ></input>
                {console.log(isOver)}
                {isOver === index && (
                  <button
                    className="trashButton btn btn-danger d-flex justify-content-center align-items-center"
                    onClick={() => handleDeleteTask(index)}
                  >
                    <span className=" fa-regular fa-trash-can"></span>
                  </button>
                )}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
