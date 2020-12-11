import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

const InfoBox = ({ title, cases, total, active, isRed, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox-selected"} ${
        isRed && "infoBox-red"
      }`}
    >
      <CardContent>
        <Typography className='infoBox-title' color='textSecondary'>
          {title}
        </Typography>
        <h2 className={`infoBox-cases ${!isRed && "infoBox-cases--green"}`}>Cases: {cases}</h2>
        <Typography className='infoBox-total' color='textSecondary'>
          Total: {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
