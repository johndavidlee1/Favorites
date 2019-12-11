import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PublicIcon from "@material-ui/icons/Public";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { auth, snapshotToArray, db } from "./firebase";
import { Lists } from "./Lists";
import { AddList } from "./Lists";
import { AddCard } from "./AddCard";
import GlobalFeed from "./globalFeed";
import { Route } from "react-router-dom";

export function App(props) {
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [listID, setListID] = useState("");
  const [addCardOpen, setAddCardOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });
    return unsubscribe;
  }, [props.history]);
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

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  if (!user) {
    return <div />;
  }
  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton color="inherit" to="/app/" component={Link}>
            {" "}
            favorites
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" to="/app/globalFeed/" component={Link}>
            {" "}
            feed
            <PublicIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setDialogOpen(true)}>
            {" "}
            new
            <AddIcon />
          </IconButton>
          <Typography
            color="inherit"
            style={{ marginRight: "15px", flexGrow: 1, textAlign: "right" }}
          >
            {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            {" "}
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Route
        exact
        path="/app/"
        render={() => {
          return <Lists user={user} lists={lists} />;
        }}
      />
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
      <Route
        path="/app/globalFeed"
        render={() => {
          return <GlobalFeed user={user} />;
        }}
      />
    </div>
  );
}
