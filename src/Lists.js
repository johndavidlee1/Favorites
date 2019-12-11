import React, { useState, useEffect } from "react";
import ListCard from "./listCard";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { db, snapshotToArray } from "./firebase";
import { AddCard } from "./AddCard.js";

export function Lists(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [listID, setListID] = useState("");
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (props) {
      db.collection("lists")
        .where("user", "==", props.user.uid)
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

      <div style={{ alignSelf: "flex-end" }}>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
          size="small"
          color="secondary"
          variant="contained"
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          Add List
        </Button>
        <AddList
          user={props.user}
          setCardOpen={setAddCardOpen}
          setListID={setListID}
          listId={listID}
          dialogOpen={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
        />
        <AddCard
          setListID={setListID}
          listID={listID}
          addDialogOpen={addCardOpen}
          onClose={() => setAddCardOpen(false)}
        />
      </div>
    </div>
  );
}

export function AddList(props) {
  const [title, setTitle] = useState("");
  const time = new Date();
  const handleSaveTitle = () => {
    db.collection("lists")
      .add({ name: title, user: props.user.uid, time: time })
      .then(doc => {
        props.setListID(doc.id);
        props.setCardOpen(true);
        props.onClose();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleTitle = e => {
    setTitle(e.target.value);
  };
  return (
    <Dialog open={props.dialogOpen} onClose={props.onClose}>
      <DialogTitle>Add New List</DialogTitle>
      <DialogContent>
        <DialogContentText>
          What do you want to call your list?
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Title"
          type="email"
          fullWidth
          onChange={handleTitle}
          value={title}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleSaveTitle}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
