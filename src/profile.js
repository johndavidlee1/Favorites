import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, snapshotToArray, db } from "./firebase";
import { Lists } from "./Lists";
import { AddList } from "./Lists";
import { AddCard } from "./AddCard";
import GlobalFeed from "./globalFeed";

export default function profile(props) {
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [listID, setListID] = useState("");
  const [addCardOpen, setAddCardOpen] = useState(false);

  useEffect(() => {
    if (user) {
      db.collection("lists")
        .where("user", "==", user.uid)
        .onSnapshot(snapshot => {
          const updatedLists = snapshotToArray(snapshot);
          setLists(updatedLists);
        });
    }
  }, [user]);

  return (
    <div>
      <Lists user={user} lists={lists} />
      <AddList
        setCardOpen={setAddCardOpen}
        setListID={setListID}
        user={user}
        dialogOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      />
      <AddCard
        listID={listID}
        addDialogOpen={addCardOpen}
        onClose={() => setAddCardOpen(false)}
      />
      <GlobalFeed user={user} />
    </div>
  );
}
