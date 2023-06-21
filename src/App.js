import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight, BsBookmarkCheck } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { LuEdit } from "react-icons/lu";
import {
  MdDownloadDone,
  MdOutlineDeleteForever,
  MdOutlineDownloadDone,
} from "react-icons/md";
import { RiCalendarTodoLine } from "react-icons/ri";

import "./jira.css";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [todosList, setTodosList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [doneList, setDoneList] = useState([]);

  return (
    <div className="app">
      <StartJira
        todosList={todosList}
        setShowModal={setShowModal}
        setTodosList={setTodosList}
        showModal={showModal}
      />
      {(progressList.length > 0 ||
        doneList.length > 0 ||
        todosList.length > 0) && (
        <List
          todosList={todosList}
          setTodosList={setTodosList}
          setShowModal={setShowModal}
          progressList={progressList}
          setProgressList={setProgressList}
          doneList={doneList}
          setDoneList={setDoneList}
        />
      )}
    </div>
  );
};

const StartJira = ({ setTodosList, todosList, showModal, setShowModal }) => {
  const handleIconClick = () => {
    setShowModal(true);
  };

  return (
    <div>
      {!showModal && (
        
        <div className="addBtn" onClick={handleIconClick}>
          <p>+</p>  
        </div>
        

        
      )}
      {showModal && (
        <Modal
          setTodosList={setTodosList}
          todosList={todosList}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

const Modal = ({ setTodosList, todosList, setShowModal }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const addTitle = () => {
    if (inputValue === "") return alert("Enter title to continue");
    else setTodosList([...todosList, inputValue]);
    setInputValue("");
    console.log(todosList);
    // setShowModal(true);
    setShowModal(false); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="modal">
      <div className="upperContainer">
        <div className="title">
          <RiCalendarTodoLine />
          <h1>TITLE</h1>
        </div>
        <IoCloseSharp className="closeIcon" onClick={handleCloseModal} />
      </div>
      <div className="lowerContainer">
        <input
          placeholder="Title"
          className="input"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="btn" onClick={addTitle}>
          Add Title
        </button>
      </div>
    </div>
  );
};

const List = ({              
  progressList,
  setProgressList,
  todosList,
  setTodosList,
  doneList,
  setDoneList,
  index
}) => {
  function moveTask(index, toList, fromList, appendFunction, decreaseFunc) {
    const newToList = [...toList, fromList[index]];
    const newFromList = [...fromList];
    newFromList.splice(index, 1);
    appendFunction(newToList);
    decreaseFunc(newFromList);
  }

  const doneTodo = (index) => {
    const updatedDoneList = [...doneList];
    updatedDoneList.splice(index, 1);
    setDoneList(updatedDoneList);
    console.log(updatedDoneList);
  };

  const deleteTodoList = (index) => {
    const updateTodoList = todosList.filter((_, item) => item !== index);
    setTodosList(updateTodoList);
  };

  return (
    <main>
      <div className="list">
        <div className="listTitle">
          <RiCalendarTodoLine size={"35"} color="rgb(108, 107, 107)" />
          <h1>Backlog</h1>
        </div>
        {todosList.map((todo, index) => (
          <Todo
            todosList={todosList}
            setTodosList={setTodosList}
            todo={todo}
            deleteTodoList={deleteTodoList}
            index={index}
            moveTask={moveTask}
            progressList={progressList}
            setProgressList={setProgressList}
          />
        ))}
      </div>
      <div className="list">
        <div className="listTitle">
          <GrInProgress size={"35"}  color="rgb(108, 107, 107)"  />
          <h1>In Progress</h1>
        </div>
        {progressList.map((todo, index) => {
          return (
            <div className="card" key={index}>
              <h2>{todo}</h2>
              <div className="arrowContainer">
                <BsArrowLeft
                  size={"25px"}
                  className="arrow"
                  onClick={() =>
                    moveTask(
                      index,
                      todosList,
                      progressList,
                      setTodosList,
                      setProgressList
                    )
                  }
                />
                <BsArrowRight
                  size={"25px"}
                  className="arrow"
                  onClick={() =>
                    moveTask(
                      index,
                      doneList,
                      progressList,
                      setDoneList,
                      setProgressList
                    )
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="list">
        <div className="listTitle">
          <BsBookmarkCheck size={"35px"} color="rgb(108, 107, 107)" />
          <h1>Done</h1>
        </div>
        {doneList.map((todo, index) => {
          return (
            <div className="card" key={index}>
              <h2>{todo}</h2>
              <div className="arrowContainer">
                <BsArrowLeft
                  size={"25px"}
                  className="arrow"
                  onClick={() =>
                    moveTask(
                      index,
                      progressList,
                      doneList,
                      setProgressList,
                      setDoneList
                    )
                  }
                />
                <MdDownloadDone
                  size={"25px"}
                  className="arrow"
                  onClick={() => doneTodo(index)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

const Todo = ({
  todo,
  todosList,
  setTodosList,
  index,
  deleteTodoList,
  moveTask,
  progressList,
  setProgressList,
}) => {
  const [editTodosList, setEditTodosList] = useState(false);
  const [input, setInput] = useState(todo);
  const onInputChange = (e) => {
    const newValue = e.target.value;
    setInput(newValue);
    console.log("newvalue", input);
  };
  const saveEditTodoList = () => {
    if (input === "")
      return alert(
        "task can not be null if you want to remove click on delete icon.."
      );
    else console.log(todo);
    const updateTodosList = [...todosList];
    updateTodosList[index] = input;
    setTodosList(updateTodosList);
    setEditTodosList(false);
  };

  return (
    <div className="card" key={index}>
      {editTodosList ? (
        <input className="editInput" value={input} onChange={onInputChange} />
      ) : (
        <h2>{todo}</h2>
      )}

      <div className="iconContainer">
        {!editTodosList ? (
          <LuEdit
            className="arrow"
            size={"20px"}
            onClick={() => setEditTodosList(true)}
          />
        ) : (
          <MdOutlineDownloadDone size={"20px"} onClick={saveEditTodoList} />
        )}

        <MdOutlineDeleteForever
          className="arrow"
          size={"20px"}
          onClick={() => deleteTodoList(index)
          }
        />
        <BsArrowRight
          size={"20px"}
          className="arrow"
          onClick={() =>
            moveTask(
              index,
              progressList,
              todosList,
              setProgressList,
              setTodosList
            )
          }
        />
      </div>
    </div>
  );
};

export default App;
