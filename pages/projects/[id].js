import { useRouter, useContext } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout/Layout'
import styles from '../../styles/Project.module.scss'
import { isLoggedIn, fetchWithToken } from '../../components/Auth/Auth'
import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Input from '../../components/Input/Input'
import { resetServerContext } from "react-beautiful-dnd"
import moment from 'moment';


function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },

    [ref, handler]
  );
}

export default function Project() {
  const router = useRouter()
  const { id } = router.query

  const [ content, setContent ] = useState('')

  const [ hovered, setHovered ] = useState(false);
  const [ modal, setModal ] = useState(false)
  const ref = useRef();

  useOnClickOutside(ref, () => {
    setModal(false)
    setContent('')
  });
  const toggleHover = () => setHovered(!hovered);
  const handleModal = () => setModal(true)

  const handleCreate = () => {
    var raw = JSON.stringify({
      "content": content,
      "status": "todo",
      "project_id": id
    });

    fetchWithToken(process.env.api + "/tasks/",
    { method: 'POST', body: raw, headers: {"Content-Type": "application/json"} })
    .then(res => res.json())
    .then(data => {
      setRefresh(!refresh)
      setModal(false)
      setContent('')
    })
  }

  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      handleCreate();
    }
  };

  const handleDelete = (id) => {
    fetchWithToken(process.env.api + "/tasks/" + id + "/", { method: 'DELETE' })
    .then(setRefresh(!refresh))
  }

  const [ project, setProject ] = useState([])
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)

  const [columns, setColumns] = useState([])

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetchWithToken(process.env.api + "/projects/" + id + "/")
      const data = await res.json()
      setProject(data)

      var columnsInit = {
        "todo": {
          name: "To do",
          items: []
        },
        "progress": {
          name: "In progress",
          items: []
        },
        "done": {
          name: "Done",
          items: []
        }
      }

      data.tasks.forEach((task, i) => {
        if (task.status == "todo") {
          columnsInit['todo'].items.push(task)
        }
        else if (task.status == "progress") {
          columnsInit['progress'].items.push(task)
        }
        else if (task.status == "done") {
          columnsInit['done'].items.push(task)
        }
      });

      setColumns(columnsInit)

      setIsLoading(false)
    };

    fetchProject()
  }, [refresh])

  useEffect(async () => {
    if (await isLoggedIn() == false) {
      router.push('/login')
    }
  }, [])

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }

    var raw = JSON.stringify({
      "status": result.destination.droppableId
    })

    var requestOptions = {
      method: 'PATCH',
      body: raw,
      headers: {"Content-Type": "application/json"},
      redirect: 'follow'
    };

    fetchWithToken(process.env.api + "/tasks/" + result.draggableId + "/", requestOptions)
  };

  return (
    <Layout>
      <div className="Shell">
        <div className={`${styles.Project_wrapper} ${modal === true ? styles.Dim : ""}`}>
          <h1>Project {project.title}</h1>

          <div className={modal === false ? styles.Add : ""}>
            <button onClick={modal === false ? handleModal : () => event.preventDefault() } ref={ref} className={`${styles.AddTask} ${modal === true ? styles.Open : "" }`} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>

              <div className={ modal === true ? styles.AddProject_form : styles.Hide }>
                  <div onClick={() => setModal(false)} className={styles.Close}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                  </div>
                  <h2>Add new task</h2>
                  <div onKeyPress={(event) => handleKeypress(event)} tabIndex="1">
                    <Input onChange={(event) => setContent(event.target.value)} value={content} name="content" type="text" label="Task" />

                    <div className={styles.Form_actions}>
                      <div onClick={handleCreate} className="Btn_login">
                        <span>Create</span>
                      </div>
                    </div>
                  </div>
                </div>
            </button>
          </div>

          {
          <div style={{ display: "flex", justifyContent: "center", height: "100%", width: "100%"}}>
            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
              >
                {Object.entries(columns).map(([columnId, column], index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}
                      key={columnId}
                    >
                      <h2>{column.name}</h2>
                      <div style={{ margin: 10 }}>
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={styles.Scr}
                                style={{
                                  background: snapshot.isDraggingOver
                                    ? "#d1c4e9"
                                    : "#e0def8",
                                  padding: "15px 10px",
                                  width: 300,
                                  height: 700,
                                  overflowY: "scroll",
                                  borderRadius: 5,
                                }}
                              >
                                {column.items.map((item, index) => {
                                  return (
                                    <Draggable
                                      key={item.id}
                                      draggableId={"" + item.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              userSelect: "none",
                                              padding: 16,
                                              margin: "0 0 8px 0",
                                              minHeight: "50px",
                                              borderRadius: 5,
                                              backgroundColor: snapshot.isDragging
                                                ? "#1d1337"
                                                : "#673ab7",
                                              color: "white",
                                              ...provided.draggableProps.style
                                            }}
                                          >
                                            <div className={styles.Task}>
                                              <button onClick={() => handleDelete(item.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                              </button>
                                              <p>id: {item.id}</p>
                                              <p>content: {item.content}</p>
                                              <div>
                                                <p>Created:</p>
                                                <span>{moment(item.created).format("time: HH:mm")}</span>
                                                <span>{moment(item.created).format("date: DD.MM.YYYY")}</span>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      </div>
                    </div>
                  );
                })}
            </DragDropContext>
          </div>
          }
        </div>
      </div>
    </Layout>
  )
}
