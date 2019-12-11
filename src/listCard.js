import React, { useState, useEffect } from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { AddCard } from "./AddCard.js";
import { db, snapshotToArray } from "./firebase";

export default function ListCard(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const maxSteps = cards.length;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("lists")
      .doc(props.list.id)
      .collection("cards")
      .orderBy("rank")
      .onSnapshot(snapshot => {
        const updatedCards = snapshotToArray(snapshot);
        setCards(updatedCards);
      });
    return unsubscribe;
  }, [props.list]);

  if (cards.length === 0) {
    return <div />;
  }

  return (
    <div style={{ maxWidth: 400, flexGrow: 1, padding: 20 }}>
      <Paper
        square
        elevation={0}
        style={{
          display: "flex",
          alignItems: "center",
          height: 50,
          paddingLeft: 15,
          backgroundColor: "#E8E7E7",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="h4">{props.list.name}</Typography>
        <IconButton
          onClick={() => {
            setAddDialogOpen(true);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Paper>
      <Paper
        square
        elevation={0}
        style={{
          display: "flex",
          alignItems: "center",
          height: 50,
          paddingLeft: 15,
          backgroundColor: "#E8E7E7"
        }}
      >
        <Typography variant="button">
          {cards[activeStep].rank}. {cards[activeStep].title}
        </Typography>
      </Paper>
      <img
        style={{
          height: 255,
          maxWidth: 400,
          overflow: "hidden",
          display: "block",
          width: "100%"
        }}
        src={cards[activeStep].image}
        alt={cards[activeStep].title}
      />
      <MobileStepper
        style={{ backgroundColor: "#E8E7E7" }}
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
      <AddCard
        addDialogOpen={addDialogOpen}
        listID={props.list.id}
        onClose={() => {
          setAddDialogOpen(false);
        }}
      />
    </div>
  );
}
