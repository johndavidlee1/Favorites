import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import { db, storage } from "./firebase";
import uuid from "node-uuid";

export function AddCard(props) {
  const [title, setTitle] = useState("");
  const [rank, setRank] = useState("");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const handleSaveCard = () => {
    setSaving(true);
    console.log(props);
    storage
      .ref("cards/" + uuid())
      .put(file)
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          db.collection("lists")
            .doc(props.listID)
            .collection("cards")
            .add({ title: title, rank: rank, image: downloadURL })
            .then(() => {
              setTitle("");
              setRank("");
              setFile(null);
              setSaving(false);
              props.onClose();
            });
        });
      });
  };
  const handleFile = e => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleTitle = e => {
    setTitle(e.target.value);
  };

  const handleRank = e => {
    setRank(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Dialog open={props.addDialogOpen} onClose={props.onClose}>
      <DialogTitle>Add New Card to List</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "space-around"
        }}
      >
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
        <FormControl style={{ minWidth: 75 }}>
          <InputLabel>Rank</InputLabel>
          <Select
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={rank}
            onChange={handleRank}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
        <div style={{ display: "flex", align: "center", marginTop: 20 }}>
          {file && (
            <Typography style={{ marginRight: 20 }}>{file.name}</Typography>
          )}
          <Button
            variant="contained"
            component="label"
            style={{ marginTop: 20 }}
          >
            Choose a Picture from File
            <input
              type="file"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          Cancel
        </Button>
        <div style={{ position: "relative" }}>
          <Button color="primary" variant="contained" onClick={handleSaveCard}>
            Save
          </Button>
          {saving && (
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12
              }}
              color="secondary"
              size={24}
            />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}
