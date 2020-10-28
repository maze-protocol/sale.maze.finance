import React from "react";
import {Box, Card, CardContent, Typography} from "@material-ui/core";

const CardBox = props => {
    return (
        <Card style={{height: "100%"}}>
            <CardContent>
                <Typography gutterBottom variant="h5">{props.title}</Typography>
                <Box>
                    {props.children}
                </Box>
            </CardContent>
        </Card>
    );
}

export default CardBox;
