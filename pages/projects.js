import Image from 'next/image'
import Layout from '../components/Layout/Layout'
import styles from '../styles/Projects.module.scss'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { isLoggedIn, fetchWithToken } from '../components/Auth/Auth'
import Router from 'next/router'
import Input from '../components/Input/Input'

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
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

export default function Projects() {
  const [ projects, setProjects ] = useState([])
  const [ refresh, setRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ notConfirmed, setNotConfirmed ] = useState(false)

  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')

  const [ hovered, setHovered ] = useState(false);
  const [ modal, setModal ] = useState(false)
  const ref = useRef();

  useOnClickOutside(ref, () => {
    setModal(false)
    setTitle('')
    setDescription('')
  });
  const toggleHover = () => setHovered(!hovered);
  const handleModal = () => setModal(true)

  const handleCreate = () => {
    var raw = JSON.stringify({
      "title": title,
      "description": description
    });

    fetchWithToken(process.env.api + "/projects/",
    { method: 'POST', body: raw, headers: {"Content-Type": "application/json"} })
    .then(res => res.json())
    .then(data => {
      if ("error" in data) {
        setNotConfirmed("In order to create a project, you must confirm your email.")
        setModal(false)
        setTitle('')
        setDescription('')
      }
      else {
        setNotConfirmed('')
        setRefresh(!refresh)
        setModal(false)
        setTitle('')
        setDescription('')
      }
    })
  }

  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      handleCreate();
    }
  };

  const handleDelete = (id) => {
    const fetchProjects = async () => {
      const res = await fetchWithToken(process.env.api + "/projects/" + id + '/',
      { method: 'DELETE', headers: {"Content-Type": "application/json"} })
      setRefresh(!refresh)
    };

    fetchProjects()
  }

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetchWithToken(process.env.api + "/projects/")
      const data = await res.json()
      setProjects(data)
      setIsLoading(false)
    };

    fetchProjects()
  }, [refresh])

  useEffect(async () => {
    if (await isLoggedIn() == false) {
      Router.push('/login')
    }
  }, [])

  return (
      <Layout>
        <div className="Shell">
          <div className={`${styles.Projects_wrapper} ${modal === true ? styles.Dim : ""}`}>
            <h1>Projects</h1>
            <p className={styles.Confirm}>{notConfirmed}</p>
            <div className={styles.Projects}>
              {
                isLoading ? "Loading" : projects.results.map((project) =>

                    <div key={project.id} className={styles.Project}>
                      <div className={styles.Project_image}>
                        <h2>{project.title}</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/><path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18L4,18V6h5.17 l2,2H20V18z M18,12H6v-2h12V12z M14,16H6v-2h8V16z"/></g></svg>
                      </div>
                      <div className={styles.Project_content}>

                        <div className={styles.Project_divide}>
                          <p>created:</p>
                          <p>{project.created}</p>
                        </div>
                        <div className={styles.Project_divide}>
                          <p>description:</p>
                          <p>{project.description}</p>
                        </div>
                      </div>
                      <div className={styles.Project_actions}>
                        <Link href={"/projects/" + project.id}>
                          <a>To project</a>
                        </Link>
                        <button onClick={() => handleDelete(project.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                      </div>
                    </div>
                )
              }

              <button onClick={modal === false ? handleModal : () => event.preventDefault() } ref={ref} className={`${styles.AddProject} ${modal === true ? styles.Open : "" }`} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                <span className={hovered ? styles.Toggle : ""}>Create new project</span>

                <div onKeyPress={(event) => handleKeypress(event)} tabIndex="1" className={ modal === true ? styles.AddProject_form : styles.Hide }>
                  <div onClick={() => setModal(false)} className={styles.Close}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                  </div>
                  <h2>Add new project</h2>
                  <form>
                    <Input onChange={(event) => setTitle(event.target.value)} value={title} name="title" type="text" label="Title" />
                    <Input onChange={(event) => setDescription(event.target.value)} value={description} name="description" type="text" label="Description" />

                    <div className={styles.Form_actions}>
                      <div onClick={handleCreate} className="Btn_login">
                        <span>Create</span>
                      </div>
                    </div>
                  </form>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Layout>
  )
}
