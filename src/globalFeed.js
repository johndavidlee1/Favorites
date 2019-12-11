import React, { useState, useEffect } from "react";
import ListCard from "./listCard";
import { snapshotToArray, db } from "./firebase.js";

export default function GlobalFeed(props) {
  const [lists, setLists] = useState([]);
  useEffect(() => {
    if (props) {
      db.collection("lists")
        .orderBy("time")
        .onSnapshot(snapshot => {
          const updatedLists = snapshotToArray(snapshot);
          setLists(updatedLists);
        });
    }
  }, [props]);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingRight: 10
      }}
    >
      {lists.map(list => {
        return <ListCard key={list.id} list={list} />;
      })}
    </div>
  );
}
