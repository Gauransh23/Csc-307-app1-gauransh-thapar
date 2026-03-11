import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id) {
    deleteUser(id)
      .then((res) => {
        if (res.status !== 204) throw new Error("Delete failed");
        setCharacters((prev) => prev.filter((c) => c._id !== id));
      })
      .catch(console.log);
  }

  function updateList(person) {
  postUser(person)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error('Failed to create user');
      }
    })
    .then((newUser) => setCharacters((prev) => [...prev, newUser]))
    .catch((error) => {
      console.log(error);
    });
}
  function fetchUsers() {
  const promise = fetch("http://localhost:8000/users");
  return promise;
  }

  function postUser(person) {
  const promise = fetch("http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });
  return promise;
  }
  
  function deleteUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
