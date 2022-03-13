const MAINTASK = [];
const addTask = document.querySelector(".addMainTask");
const addSubTask = document.querySelector(".addSubTask");
const taskForm = document.querySelector(".taskForm");
const createTask = document.querySelector(".createTask");
const closeForm = document.querySelector(".exit");
const inputsTask = document.querySelectorAll(".inputTask");
const errorForm = document.querySelector(".errorForm");
const listMainTask = document.querySelector(".generalTask");
const listSubTask = document.querySelector(".taskSub");
const description = document.querySelector(".description");
let selectTask = null;
let isTypeTask = false;

function closeFormTask(params) {
  taskForm.classList.contains("visible")
    ? taskForm.classList.remove("visible")
    : null;
  errorForm.textContent = "";
  inputsTask.forEach((inp) => (inp.value = ""));
}

function checkListTask(params) {
  if (listMainTask.childElementCount) {
    listMainTask.previousElementSibling.textContent = "";
  } else {
    listMainTask.previousElementSibling.textContent = "Нету задач";
    selectTask = null;
  }
}

function visibleTaskForm(props) {
  taskForm.classList.add("visible");
  isTypeTask = props;
}

function main() {
  showDescription(null, "Пока нету выбранных тем.");
  checkListTask();
  createTask.addEventListener("click", () => {
    let isEmpty = true;
    inputsTask.forEach((inp) => {
      if (!inp.value) {
        isEmpty = false;
      }
    });

    if (!isEmpty) {
      errorForm.textContent = "Заполните поля";
      return;
    }
    Task();
  });

  addTask.onclick = () => {
    visibleTaskForm(true);
  };

  function showErrorSubTask(params) {
    document.querySelector(".error-subTask").classList.add("active");
    setTimeout(() => {
      document.querySelector(".error-subTask").classList.remove("active");
    }, 5000);
  }

  addSubTask.onclick = () => {
    console.log(selectTask);
    if (selectTask === null) {
      showErrorSubTask();
    } else {
      visibleTaskForm(false);
    }
  };

  closeForm.onclick = function () {
    closeFormTask();
  };
}

function addZeroToTime(time) {
  return time < 10 ? `0${time}` : time;
}

function SubTask(task) {
  listSubTask.insertAdjacentHTML(
    "beforeend",
    `<div 
  data-selected='${selectTask}' data-event='false' class='itemSubTask'>
  <div class='item'>
  <p>${task.title}</p>
  <p>${addZeroToTime(task.time.hour)}:${addZeroToTime(
      task.time.minit
    )}:${addZeroToTime(task.time.second)}</p>
  <a class='open '>Показать описание</a>
  <span class='removeTask'></span>
  <input class='state' type='checkbox'/>
  </div>
  <p class='bodySubTask'>${task.body}</p>
  </div>`
  );

  handlerEventSubTask();
  showSubTask();
}

function handlerEventSubTask(params) {
  document.querySelectorAll(".itemSubTask").forEach((elem, index) => {
    if (elem.dataset.event == "false") {
      elem.dataset.event = "true";
      let checkbox = elem.firstElementChild.lastElementChild;
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          elem.classList.add("solved");
          checkbox.previousElementSibling.classList.add("visible");
        } else {
          elem.classList.remove("solved");
          checkbox.previousElementSibling.classList.remove("visible");
        }
      });

      elem.addEventListener("click", () => {
        let target = event.target;
        if (target.classList.contains("removeTask")) {
          target.parentNode.parentNode.remove();
        }
        if (target.classList.contains("open")) {
          target.parentNode.nextElementSibling.classList.toggle("active");
        }
      });
    }
  });
}

function Task() {
  const obj = {
    title: "",
    body: "",
    time: {
      minit: new Date().getMinutes(),
      second: new Date().getSeconds(),
      hour: new Date().getHours(),
    },
  };
  inputsTask.forEach((inp) => {
    obj[inp.name] = inp.value;
  });
  MAINTASK.push(obj);
  if (isTypeTask) {
    showTask(obj);
  } else {
    SubTask(obj);
  }
  closeFormTask();
}

function showTask(task) {
  listMainTask.insertAdjacentHTML(
    "beforeend",
    `<div data-event='false' class='taskItem'>
    <span class='taskDesription'>${task.body}</span>
    <span class='removeTask'></span>
    <span class='task-title'>${task.title}</span>
     <span class='task-time'>${addZeroToTime(task.time.hour)}:${addZeroToTime(
      task.time.minit
    )}:${addZeroToTime(task.time.second)}</span>
     <input class='state' type='checkbox'></input>
     </div>`
  );
  checkListTask();
  handlerEventTask();
}

function showDescription(target, def) {
  description.textContent = def
    ? def
    : target.parentNode.firstElementChild.textContent;
}

function showSubTask(params) {
  document.querySelectorAll(".itemSubTask").forEach((elem) => {
    if (elem.dataset.selected == selectTask) {
      elem.style.display = "block";
    } else {
      elem.style.display = "none";
    }
  });
}

function handlerEventTask(params) {
  document.querySelectorAll(".taskItem").forEach((elem, index) => {
    let viewDefault = "";
    if (elem.dataset.event === "false") {
      elem.addEventListener("click", () => {
        const target = event.target;
        selectTask = index;
        if (target.tagName == "DIV") return;

        if (target.classList.contains("removeTask")) {
          if (target.parentNode.classList.contains("solved")) {
            target.parentNode.remove();

            document.querySelectorAll(".itemSubTask").forEach((elem) => {
              if (elem.dataset.selected == selectTask) elem.remove();
            });
          }

          viewDefault = "Пока нету выбранных тем.";
          checkListTask();
        }

        if (target.classList.contains("state")) {
          if (target.checked) {
            target.parentNode.children[1].classList.add("visible");
            target.parentNode.classList.add("solved");
          } else {
            target.parentNode.children[1].classList.remove("visible");
            target.parentNode.classList.remove("solved");
          }
        }

        elem.dataset.event = "true";

        showDescription(target, viewDefault);
        showSubTask();
      });
    }
  });
}

main();
