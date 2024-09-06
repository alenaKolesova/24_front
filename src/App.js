import { useEffect } from "react";
import { useState } from "react";
import './App.css'
import { Route, Routes, useParams } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/serials/:id" element={<Serials />} />
        </Routes>
    );
}

function Home() {

    const [serials, setSerials] = useState([])

    useEffect(() => {
        loadSerials()
    }, [])

    async function loadSerials() {
        let res = await fetch(process.env.REACT_APP_API + '/api/serial')
        let resJson = await res.json()
        setSerials(resJson);
    }

    async function onChange(paramName, value, serialindex) {
        let newSerials = [...serials]
        newSerials[serialindex][paramName] = value
        setSerials(newSerials)
    }

    return (
        <div className="max-width-500 flex-direction-column">
            {serials.map((serial, serialindex) => {
                return (
                    <div key={serialindex} className="max-width-500 flex-direction-column">
                        {/* HEADER */}
                        <div>
                            <input className="font-size-x-large text-align-center width-100pct"
                                value={serial.name}
                                onChange={(e) => {
                                    let value = e.target.value
                                    onChange('name', value, serialindex)
                                }} />
                        </div>

                        {/* IMAGE */}
                        <div className="flex-direction-column">
                            <img className="width-100pct" src={serial.poster} />
                            <input className="text-align-center width-100pct"
                                value={serial.poster}
                                onChange={(e) => {
                                    let value = e.target.value
                                    onChange('poster', value, serialindex)
                                }} />
                        </div>

                        {/* ACTORS */}
                        <div className="flex-direction-column">{
                            serial.actors.map((actor, actorIndex) => {
                                return (
                                    <div>
                                        <input value={actor}
                                            key={actorIndex}
                                            onChange={(e) => {
                                                let value = e.target.value
                                                let newSerials = [...serials]
                                                newSerials[serialindex].actors[actorIndex] = value
                                                setSerials(newSerials)
                                            }} />

                                        <div className="color-red"
                                            onClick={() => {
                                                let newSerials = [...serials]
                                                newSerials[serialindex].actors.splice(actorIndex, 1)
                                                setSerials(newSerials)
                                            }}
                                        >Удалить</div>
                                    </div>
                                )
                            }

                            )
                        }
                            <div className="color-blue" onClick={(e) => {
                                let newSerials = [...serials]
                                newSerials[serialindex].actors.push('NewName')
                                setSerials(newSerials)
                            }}>Добавить актёра</div>
                        </div>

                        {/* DESCRIPTION */}
                        <textarea value={serial.description} rows="6"
                            onChange={(e) => {
                                let value = e.target.value
                                onChange('description', value, serialindex)
                            }}
                        >
                        </textarea>

                        <button
                            onClick={async () => {
                                let res = await fetch(process.env.REACT_APP_API + '/api/serial', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json;charset=utf-8'
                                    },
                                    body: JSON.stringify(serial)
                                })
                                let resJson = await res.json()
                                console.log(resJson);
                                onChange('_id', resJson['id'], serialindex)
                            }}

                            className="background-color-orange">Сохранить</button>

                        <button
                            onClick={async () => {
                                let newSerials = [...serials]
                                let res = await fetch(process.env.REACT_APP_API + '/api/serial/delete', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json;charset=utf-8'
                                    },
                                    body: JSON.stringify(newSerials[serialindex])
                                })
                                let resJson = await res.json()
                                console.log(resJson);
                                newSerials.splice(serialindex, 1)
                                setSerials(newSerials)
                            }}

                            className="background-color-orange">Удалить</button>

                    </div>
                )
            })}

            <div className="font-size-x-large color-blue" onClick={(e) => {
                let newSerials = [...serials]
                newSerials.push({
                    name: "Новый Сериал",
                    poster: "https://i.postimg.cc/yN9TQKTq/00000-image-social-home.jpg",
                    actors: [
                        "Фамилия Имя",
                        "Фамилия Имя"
                    ],
                    description: "Описание сериала",
                })
                setSerials(newSerials)
            }}>ДОБАВИТЬ СЕРИАЛ</div>

        </div>
    );
}

function Serials() {
    let { id } = useParams();

    const [serial, setSerial] = useState({
        actors: []
    })

    useEffect(() => {
        loadSerials()
    }, [])

    async function loadSerials() {

        let res = await fetch(process.env.REACT_APP_API + '/api/serial/id/?id=' + id)
        let resJson = await res.json()
        setSerial(resJson);
        console.log(resJson)
    }

    return (
        <div className="max-width-500 flex-direction-column">
            {/* HEADER */}
            <div>
                <p className="font-size-x-large text-align-center width-100pct">{serial.name}</p>
            </div>

            {/* IMAGE */}
            <div className="flex-direction-column">
                <img className="width-100pct" src={serial.poster} />
            </div>

            {/* ACTORS */}
            <div className="flex-direction-column">{
                serial.actors.map((actor, actorIndex) => {
                    return (
                        <div>
                            <input value={actor}
                                key={actorIndex}
                            />
                        </div>
                    )
                })
            }
            </div>

            {/* DESCRIPTION */}
            <p> {serial.description}</p>

        </div>
    )
}

export default App;