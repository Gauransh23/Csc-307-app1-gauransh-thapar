import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([
    // {
    //   name: "Charlie",
    //   job: "Janitor"
    // },
    // {
    //   name: "Mac",
    //   job: "Bouncer"
    // },
    // {
    //   name: "Dee",
    //   job: "Aspring actress"
    // },
    // {
    //   name: "Dennis",
    //   job: "Bartender"
    // }
  ]);

//   function removeOneCharacter(id) {
//   setCharacters((prev) => prev.filter((c) => c.id !== id));
// }
  function removeOneCharacter(id) {
    deleteUser(id)
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prev) => prev.filter((c) => c.id !== id));
        } else if (res.status === 404) {
          throw new Error("User not found (404)");
        } else {
          throw new Error(`Delete failed (${res.status})`);
        }
      })
      .catch((err) => console.log(err));
  }
  // function removeOneCharacter(index) {
  //   const updated = characters.filter((character, i) => {
  //     return i !== index;
  //   });
  //   setCharacters(updated);
  // }

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
